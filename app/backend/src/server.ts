import express from "express";
import router from "./router";
import cors from "cors";
import expressSession from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import { ErrorRequestHandler } from "express";

//セッションの型定義
declare module "express-session" {
  interface SessionData {
    logined: boolean;
    useID: string;
    sessionID: string;
  }
}

const app = express();
const PORT = 3000;
app.use(express.json()); //リクエストをJSONで受け取る

//フロントサーバのオリジンのみクロスオリジン通信を許可
app.use(
  cors({
    origin: process.env.FRONT_ORIGIN, //許可するオリジン
    credentials: true, //Cookie付きの通信を許容するか
  })
);

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    tls: true, // UpstashはTLS必須
    //tls: false, //開発環境はfalse
  },
  password: process.env.REDIS_PASSWORD,
});
redisClient.connect(); //Radis(インメモリDB)と接続
const store = new RedisStore({ client: redisClient }); //セッションストア生成

//セッション生成・検索ミドルウェア
//cookieに保存されたセッションIDがセッションストア（redis）に存在していれば、
//自動でセッション情報をreq.sessionに格納してくれる。なければ生成する。
app.use(
  expressSession({
    name: "my-app-session",
    secret: "secret",
    resave: false,
    saveUninitialized: false, //セッションに何か書き込まれるまでは、セッションはストアされない
    store: store,
    cookie: {
      httpOnly: true, //スクリプトからの値の読み取り不可
      //secure: true, //HTTPS通信でのみ送信可能
      secure: false, //開発中はfalse
      sameSite: "strict", //他サイトのリクエストに付加しない。
    },
  })
);

//ログ出力用ミドルウェア
app.use((req, res, next) => {
  console.log("---リクエスト受け取り---");
  console.log(`methoc = ${req.method}, path = ${req.path}`);
  console.log(
    `session = ${req.session ? JSON.stringify(req.session) : "なし"}`
  );
  console.log(`body = ${req.body ? JSON.stringify(req.body) : "なし"}`);

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    console.log("---レスポンス---");
    console.log(`methoc = ${req.method}, path = ${req.path}`);
    console.log("statusCode: 200");
    console.log("body:", body);
    return originalJson(body);
  };

  const originalStatus = res.status.bind(res);
  res.status = (code) => {
    console.log("---レスポンス---");
    console.log(`statusCode: ${code}`);
    return originalStatus(code);
  };
  next();
});

//ログアウト処理
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    //redisへの接続ができなかった場合などはエラーになる。
    //セッションが無くてもエラーにはならない。
    if (err) {
      console.error("セッション破棄エラー:", err);
      return res.status(500).send("ログアウト失敗");
    }
    res.clearCookie("my-app-session"); // クッキー消す
    res.sendStatus(200);
  });
});

//セッション管理用ミドルウェア
app.use((req, res, next) => {
  //未ログイン（セッションが存在しないか、セッションのlogindがfalseの時）
  if (!req.session?.logined) {
    //ログイン処理orユーザ登録リクエストの場合、処理続行。
    if (req.path === "/login" || req.path === "user") {
      next();
      return;
    }

    //未ログインで上記処理以外を実施しようとした場合、処理中断。
    //レスポンスを返し、フロントでログイン画面に遷移させる。
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  //上記以外の場合（req.session.logined = true）、ログイン済み。処理続行
  next();
});

//API呼び出し
app.use(router);

//エラーハンドラ（非同期関数での例外はキャッチできないらしい。要修正）
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (!err) return;
  console.log("---レスポンス---");
  console.log(`methoc = ${req.method}, path = ${req.path}`);
  console.log("statusCode: 500");
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
};
app.use(errorHandler);

//サーバ起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
