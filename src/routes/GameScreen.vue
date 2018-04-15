<style lang="scss">
.game {
  margin-top: -60px;
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.game__details {
  text-align: center;
  width: 350px;
  padding-bottom: 10px;
  margin: 0 auto;
  font-size: 21px;
}
.game__canvas {
  margin: 0 auto;
  width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style>


<template>
  <div class="game">

    <div class="game__details" v-if="users.length > 1">
      <div v-if="count['.value'] === 3">Finished! Wait for a fresh start.</div>
      <div v-else>
        Draw
        <b>{{animal['.value']}}</b>: {{3 - count['.value']}} lines left</div>
    </div>

    <div class="game__canvas">
      <draw-canvas v-if="users.length > 1" :height="400" :width="350" :disabled="disabled || count['.value'] === 3" :onLineEnd="onLineEnd" :paths="paths" :updatePaths="updatePaths" />
      <h2 v-else>Waiting for another player</h2>
    </div>

    <div class="game__users">
      <user-bar :users="users" :currentPlayer="currentPlayer" :currentUser="currentUser" />
    </div>

  </div>
</template>

<script>
import DrawCanvas from "../components/DrawCanvas";
import UserBar from "../components/UserBar";
import { db } from "../firebase";
import { getRandomAnimal } from "../animals";

export default {
  components: { DrawCanvas, UserBar },
  props: { uid: String },
  data() {
    return {
      disabled: true,
      animal: {},
      currentUser: {},
      currentPlayer: {},
      count: {},
      paths: [],
      users: []
    };
  },
  firebase() {
    return {
      currentUser: {
        source: db.ref(`/users/${this.uid}`),
        asObject: true
      },
      currentPlayer: {
        source: db.ref("/game/currentPlayer"),
        asObject: true
      },
      animal: {
        source: db.ref("/game/animal"),
        asObject: true
      },
      count: {
        source: db.ref("game/count"),
        asObject: true
      },
      paths: db.ref("/game/paths"),
      users: db.ref("/users")
    };
  },
  watch: {
    currentPlayer(val) {
      if (val[".value"] === this.uid) {
        this.disabled = false;
      }
    }
  },
  created() {
    if (!this.uid) {
      this.$router.push("/login");
    }
  },
  mounted() {
    this.$firebaseRefs.currentUser.onDisconnect().remove();
  },
  methods: {
    updatePaths(lastX, lastY, x, y) {
      this.$firebaseRefs.paths.push(lastX);
      this.$firebaseRefs.paths.push(lastY);
      this.$firebaseRefs.paths.push(x);
      this.$firebaseRefs.paths.push(y);
    },
    clearDrawing() {
      setTimeout(() => {
        this.$firebaseRefs.paths.set("");
        this.$firebaseRefs.count.set(0);
      }, 3000);
    },
    setNextUser(uid) {
      const users = this.users;
      const numUsers = users.length;
      const userIndex = users.findIndex(user => user.uid === uid);
      if (userIndex + 1 === numUsers) {
        this.$firebaseRefs.currentPlayer.set(users[0][".key"]);
      } else {
        this.$firebaseRefs.currentPlayer.set(users[userIndex + 1][".key"]);
      }
    },
    onLineEnd() {
      this.disabled = true;
      const count = this.count[".value"];
      db.ref("game/count").set(count + 1);
      if (count === 2) {
        this.clearDrawing();
        this.$firebaseRefs.animal.set(getRandomAnimal());
      }
      this.setNextUser(this.uid);
    }
  }
};
</script>

