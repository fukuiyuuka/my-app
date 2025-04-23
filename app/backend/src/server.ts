import express from "express";
import router from "./router";
import cors from "cors";
import { ErrorRequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); //リクエストをJSONで受け取る

//フロントサーバのオリジンのみクロスオリジン通信を許可
app.use(
  cors({
    origin: process.env.FRONT_ORIGIN, //許可するオリジン
    credentials: true, //Cookieも許可
  })
);

//ログ出力用ミドルウェア
app.use((req, res, next) => {
  console.log("---リクエスト受け取り---");
  console.log(`methoc = ${req.method}, path = ${req.path}`);
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

  const originalSend = res.send.bind(res);
  res.send = (msg) => {
    console.log(`message: ${msg}`);
    return originalSend(msg);
  };
  next();
});

//認証・認可
app.use((req: Request, res: Response, next: NextFunction): void => {
  //認証不要
  if (["/login", "/user"].includes(req.path)) {
    next();
    return;
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    //認証されていない（誰？）
    //トークンがない
    res.status(401).send("Unauthorized");
    return;
  }
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    //認可されていない（誰か分かっているけど、操作が許可されていない）
    //トークンの有効期限切れ
    if (err) return res.status(403).send("Forbidden");
    (req as any).user = user;
    next();
  });
});

//API呼び出し
app.use(router);

//エラーハンドラ（非同期関数での例外はキャッチできない。）
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
  console.log(`Server is running on port ${PORT}`);
});
