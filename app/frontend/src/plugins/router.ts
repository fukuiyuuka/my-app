import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Home from "../pages/Home.vue";
import Todo from "../pages/HomeContents/Todo.vue";
import { useCommonData } from "../store/pinia";

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

//未ログイン状態で直接Home等に遷移しようとした場合、ログインページにリダイレクトする。
router.beforeEach((to, from, next) => {
  const commonData = useCommonData();

  const isAuthenticated = !!commonData.user;

  const publicPages = ["/", "/register"]; //ログインが不要の画面
  const authRequired = !publicPages.includes(to.path);

  //ログイン不要の画面以外に、未ログイン状態で遷移しようとした場合はログイン画面に飛ばす。
  if (authRequired && !isAuthenticated) {
    next("/"); // 未ログイン → ログイン画面へ
    return;
  }

  //ログイン画面に遷移仕様としたとき、既にログイン済みの場合はhomeへ自動遷移
  if (to.path === "/" && isAuthenticated) {
    next("/home/todo"); //デフォルトはとりあえずtodo画面にしておく。（あとでTopページとか作ったら変える）
    return;
  }

  next();
});

export default router;
