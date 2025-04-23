"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const cors_1 = __importDefault(require("cors"));
const jwt = __importStar(require("jsonwebtoken"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json()); //リクエストをJSONで受け取る
//フロントサーバのオリジンのみクロスオリジン通信を許可
app.use((0, cors_1.default)({
    origin: process.env.FRONT_ORIGIN, //許可するオリジン
    credentials: true, //Cookieも許可
}));
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
app.use((req, res, next) => {
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
        if (err)
            return res.status(403).send("Forbidden");
        req.user = user;
        next();
    });
});
//API呼び出し
app.use(router_1.default);
//エラーハンドラ（非同期関数での例外はキャッチできない。）
const errorHandler = (err, req, res, next) => {
    if (!err)
        return;
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
