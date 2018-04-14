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
  font-size: 40px;
}

.login-form {
  width: 100%;
}

.login-form__avatar {
  border-radius: 50%;
}

.login-form__input {
  width: 100%;
  height: 60px;
  padding-left: 10px;
  padding-right: 10px;
  display: block;
  text-align: center;
  margin-bottom: 10px;
  border: 2px solid #fff;
  border-radius: 5px;
  color: #fff;

  &::placeholder {
    color: #fff;
  }
}

.login-form__button {
  width: 100%;
  height: 60px;
  color: #393af9;
  font-family: "Poppins";
  background: #fff;
  text-align: center;
  position: relative;
}
</style>


<template>
  <div class="login">
    <div class="login-wrapper">

      <div class="login-title">
        <img src="../assets/logo.svg" width="60" /><br> The three line animal
      </div>

      <div class="login-form">

        <input class="login-form__input" autofocus placeholder="Your nickname" v-model="userName" @keyup.enter="joinGame" />

        <button class="login-form__button" @click="joinGame">Start</button>

      </div>

    </div>
  </div>
</template>

<script>
import UserBar from "../components/UserBar";
import { db } from "../firebase";
import uuid from "uuid";

export default {
  data() {
    return {
      userName: "",
      myUserId: uuid()
    };
  },
  methods: {
    joinGame() {
      db.ref(`users/${this.myUserId}`).set({
        name: this.userName,
        uid: this.myUserId
      });

      this.$router.push({
        name: "game",
        params: { uid: this.myUserId }
      });
    }
  }
};
</script>

