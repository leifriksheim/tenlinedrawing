<style lang="scss">
@-webkit-keyframes border-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes border-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.user-bar {
  position: fixed;
  bottom: 0;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  background: rgba(43, 43, 199, 0.66);
  width: 100vw;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}

.user-bar__users {
  display: flex;
  height: 60px;
  justify-content: flex-start;
  align-items: center;
}

.user-bar__user {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-right: 15px;
  height: 30px;
  padding: 0 30px;
  border-radius: 5px;
  border: 1px solid #fff;
  color: #fff;

  &.--active {
    background: #fff;
    color: #393af9;
    animation: border-pulse 0.5s infinite;
    -webkit-animation: border-pulse 0.5s infinite;
  }
}

.user-bar__avatar {
  background-image: url(http://i.pravatar.cc/300);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.user-bar__username {
  font-size: 0.8rem;
}
</style>


<template>
  <div class="user-bar">
    <div class="user-bar__users">
      <div class="user-bar__user" v-for="user in users" :class="{'--active': user['.key'] === currentPlayer['.value']}">
        <!--<div class="user-bar__avatar" />-->
        <div class="user-bar__username" v-if="currentUser['.key'] === user['.key']">You</div>
        <div class="user-bar__username" v-else>{{user.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    users: Array,
    currentPlayer: Object,
    currentUser: Object
  }
};
</script>
