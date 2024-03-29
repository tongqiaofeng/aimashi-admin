import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/login/login";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: "/admin/",
  routes: [
    {
      path: "/",
      component: Login,
      children: [
        {
          path: "/login",
          component: Login
        }
      ]
    },
    {
      //主页
      path: "/home",
      name: "home",
      component: () => import("@/views/home/home")
    }
  ]
});
