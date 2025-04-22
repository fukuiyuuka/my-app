import router from "./router";
import axios from "axios";
//共通処理

//ログアウト
export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  router.push("/");
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
});

//リクエスト処理
api.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers["Authorization"] = "Bearer " + token;
    }
    console.log("リクエスト送信:", {
      url: request.url,
      method: request.method,
      headers: request.headers,
      data: request.data,
    });
    return request;
  },
  (error) => {
    console.error("リクエストエラー:", error);
    return Promise.reject(error);
  }
);

// レスポンス処理
api.interceptors.response.use(
  (response) => {
    console.log("レスポンス受信:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("レスポンスエラー:", error);

    //トークンがないor失効時、ログイン画面に遷移。
    if (["401", "403"].includes(error.response?.status)) {
      alert("Your session has expired, please login again.");
      logout();
    }
    router.push("/error");
    return Promise.reject(error);
  }
);
