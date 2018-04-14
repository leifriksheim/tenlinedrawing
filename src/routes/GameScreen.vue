<style lang="scss">
.game {
  margin-top: 20px;
}
.game__details {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  border: 2px solid #fff;
  border-radius: 5px 5px 0px 0px;
  width: 350px;
  height: 60px;
  margin: 0 auto;
}
.game__canvas {
  margin: 0 auto;
  width: 350px;
}
</style>


<template>
  <div class="game">

    <div class="game__details">
      {{10 - currentCount['.value']}} lines left
    </div>

    <div class="game__canvas">
      <draw-canvas v-if="users.length > 1" :height="400" :width="350" :disabled="disabled" :onLineEnd="onLineEnd" :paths="paths" :updatePaths="updatePaths" />
      <div v-else>Waiting for another player</div>
    </div>

    <div class="game__users">
      <user-bar :users="users" :currentPlayer="currentPlayer" :currentUser="currentUser" />
    </div>

  </div>
</template>

<script>
import DrawCanvas from "../components/DrawCanvas";
import UserBar from "../components/UserBar";
import { db, auth, users, getNextUserId } from "../firebase";

const setNextUser = uid => {
  db.ref("users").once("value", function(snapshot) {
    const users = snapshot.val();
    const numUsers = snapshot.numChildren();
    const userIndex = Object.keys(users).findIndex(id => id === uid);
    const userArray = Object.keys(users).map(id => users[id]);

    const nextUser = userArray.reduce(
      (acc, user, index) => {
        if (!user.online || user.uid === uid) {
          return { ...acc };
        }
        const isAfterUser = index > userIndex ? true : false;
        const lastDistance = Math.abs(userIndex - acc.index);
        const currDistance = Math.abs(userIndex - index);
        console.log(
          "user",
          user,
          "userIndex",
          userIndex,
          "isAfterUser",
          isAfterUser,
          "lastDistance",
          lastDistance,
          "currDistance",
          currDistance
        );
        if (isAfterUser && currDistance >= lastDistance) {
          return { uid: user.uid, index: index };
        }
        if (!isAfterUser && currDistance <= lastDistance) {
          return { uid: user.uid, index: index };
        }
      },
      { uid: "", index: 0 }
    );
    db.ref("game/currentPlayer").set(nextUser.uid);
  });
};

export default {
  components: { DrawCanvas, UserBar },
  data() {
    return {
      disabled: true,
      currentUser: {},
      currentPlayer: {},
      currentCount: {},
      paths: [],
      users: []
    };
  },
  firebase() {
    return {
      currentUser: {
        source: db.ref(`/users/${auth.currentUser.uid}`),
        asObject: true
      },
      currentPlayer: {
        source: db.ref("/game/currentPlayer"),
        asObject: true
      },
      currentCount: {
        source: db.ref("game/currentCount"),
        asObject: true
      },
      paths: db.ref("/game/paths"),
      users: db
        .ref("/users")
        .orderByChild("online")
        .equalTo(true)
    };
  },
  watch: {
    currentPlayer(val) {
      if (val[".value"] === auth.currentUser.uid) {
        this.disabled = false;
      }
    }
  },
  mounted() {
    setNextUser("KsAky3JENXWwH6oLmOAycvjGwDf1");
    this.$firebaseRefs.currentUser.update({ online: true });
    this.$firebaseRefs.currentUser.onDisconnect().update({ online: false });
  },
  methods: {
    updatePaths(lastX, lastY, x, y) {
      this.$firebaseRefs.paths.push(lastX);
      this.$firebaseRefs.paths.push(lastY);
      this.$firebaseRefs.paths.push(x);
      this.$firebaseRefs.paths.push(y);
    },
    clearDrawing() {
      this.$firebaseRefs.paths.set("");
      this.$firebaseRefs.currentCount.set(0);
      db.ref("game/lastPlayer").set(auth.currentUser.uid);
    },
    async onLineEnd() {
      this.disabled = true;
      const count = this.currentCount[".value"];
      if (count === 9) {
        this.clearDrawing();
        return;
      }
      db.ref("game/currentCount").set(count + 1);
      db.ref("game/lastPlayer").set(auth.currentUser.uid);
    }
  }
};
</script>

