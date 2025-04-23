import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Home from "../components/Home.vue";
import Todo from "../components/HomeContents/Todo.vue";

import { logout } from "./common";

const routes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  {
    path: "/home",
    component: Home,
    children: [{ path: "todo", component: Todo }],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//ログイン制御
router.beforeEach((to, _from, next) => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  //認証済み
  const isAuthenticated = !!user && !!token;

  //認証が必要か
  const publicPages = ["/", "/register", "/error"]; //ログイン不要画面
  const authRequired = !publicPages.includes(to.path);

  //ログインが必要な画面に、未ログイン状態で遷移しようとした場合はログイン画面に飛ばす。
  if (authRequired && !isAuthenticated) {
    logout();
    return;
  }

  if (to.path === "/" && isAuthenticated) {
    //認証時にログイン画面に遷移した場合、ログイン画面を飛ばす
    next("/home/todo");
    return;
  }

  next();
});

export default router;
