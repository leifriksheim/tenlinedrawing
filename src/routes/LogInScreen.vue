<style lang="scss">
.login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 40px;
}

.login-form {
  width: 100%;
}

.login-form__input {
  width: 100%;
  height: 60px;
  padding-left: 10px;
  padding-right: 10px;
  display: block;
  margin-bottom: 10px;
}

.login-form__button {
  width: 100%;
  height: 60px;
  color: white;
  background: rgb(34, 66, 171);
  text-align: center;
  position: relative;

  &.--loading:after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
    width: 20px;
    height: 20px;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border: 2px solid #ccc;
    border-top-color: #333;
    animation: spinner 0.6s linear infinite;
  }
}

@keyframes spinner {
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}
</style>


<template>
  <div class="login">
    <div class="login-wrapper">

      <div class="login-title">
        10 Line Drawing
      </div>

      <div class="login-form">
        <DrawCanvas :width="400" :disabled="false" :height="400" :paths="paths" :onLineEnd="onLineEnd" :updatePaths="updatePaths" />
        <input class="login-form__input" placeholder="Your nickname" v-model="userName" @keyup.enter="joinGame" />
        <button class="login-form__button" :class="{'--loading': isLoading}" @click="joinGame">{{!isLoading ? 'Start' : ''}}</button>
      </div>

    </div>
  </div>
</template>

<script>
import DrawCanvas from "../components/DrawCanvas";
import UserBar from "../components/UserBar";
import { db, auth } from "../firebase";

export default {
  components: { DrawCanvas },
  data() {
    return {
      userName: "",
      isLoading: false,
      paths: []
    };
  },
  methods: {
    updatePaths(lastX, lastY, x, y) {
      this.paths.push(lastX, lastY, x, y);
    },
    onLineEnd() {
      console.log("end");
    },
    joinGame() {
      const userName = this.userName;
      this.isLoading = true;

      auth.signInAnonymously().then(user => {
        db.ref(`users/${user.uid}`).set({ name: userName, uid: user.uid });
        this.loading = false;
        this.$router.push("/");
      });
    }
  }
};
</script>

