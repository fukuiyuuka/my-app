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
exports.postLogin = void 0;
const prismaClient_1 = require("../prismaClient"); // Prisma Clientをインポート
const t = __importStar(require("@yukafukui/shared-type"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
/**
 * ============================================
 * メソッド： POST
 * パス　　： /login
 * 処理概要： ログイン処理
 * ============================================
 */
const postLogin = async (req, res) => {
    //入力バリデーション
    if (!t.PostLoginReqSchema.safeParse(req.body)) {
        throw { code: 1 };
    }
    const reqBody = t.PostLoginReqSchema.parse(req.body);
    //ユーザ取得
    const user = await prismaClient_1.prisma.user.findUnique({
        where: { name: reqBody.name },
    });
    if (user) {
        //パスワード照合
        const match = await bcryptjs_1.default.compare(reqBody.password, user.password);
        if (match) {
            //ログイン成功
            const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
            //DBと照合し、成功したらtokenを生成
            const token = jwt.sign({ id: user.id, username: user.name }, JWT_SECRET, {
                expiresIn: "1h",
            });
            const resBody = {
                code: 0,
                data: {
                    successLogin: true,
                    user: user,
                    token: token,
                },
            };
            res.json(resBody);
            return;
        }
    }
    //ログイン失敗（ユーザ名なしorパスワード不一致）
    const resBody = {
        code: 0,
        data: {
            successLogin: false,
        },
    };
    res.json(resBody);
};
exports.postLogin = postLogin;
