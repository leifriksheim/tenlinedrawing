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
      meta: { reqAuth: true },
      component: GameScreen
    },
    {
      path: "/login",
      meta: { reqAuth: false },
      component: LogInScreen
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.reqAuth) {
    auth.onAuthStateChanged(user => {
      if (!user) {
        return next("/login");
      } else {
        return next();
      }
    });
  } else {
    return next();
  }
});

export default router;
