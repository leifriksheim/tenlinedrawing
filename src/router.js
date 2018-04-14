import Vue from "vue";
import Router from "vue-router";
import GameScreen from "./routes/GameScreen";
import LogInScreen from "./routes/LogInScreen";
import { auth } from "./firebase";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "game",
      props: true,
      component: GameScreen
    },
    {
      path: "/login",
      name: "login",
      component: LogInScreen
    }
  ]
});

export default router;
