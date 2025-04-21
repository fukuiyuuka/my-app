import router from "../plugins/router";

//共通処理
import { useCommonData } from "../store/pinia";

export const logout = () => {
  const commonData = useCommonData();
  commonData.$reset();
  localStorage.removeItem("commonData"); //ローカルストレージも削除
  router.push("/");
};

import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});
