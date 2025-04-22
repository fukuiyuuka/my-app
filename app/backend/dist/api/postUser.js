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
exports.postUser = void 0;
const prismaClient_1 = require("../prismaClient"); // Prisma Clientをインポート
const t = __importStar(require("@yukafukui/shared-type"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * ============================================
 * メソッド： POST
 * パス　　： /user
 * 処理概要： ユーザ新規作成
 * ============================================
 */
const postUser = async (req, res) => {
    //バリデーション
    if (!t.PostUserReqSchema.safeParse(req.body)) {
        //入力型エラー
        throw { code: 1, message: "入力エラー" };
    }
    const reqBody = t.PostUserReqSchema.parse(req.body);
    //トランザクション開始
    const user = await prismaClient_1.prisma.$transaction(async (tx) => {
        //ユーザ名重複チェック
        //ロックのため直接クエリを指定
        const existingUser = await tx.$queryRaw `
        SELECT * FROM "User" WHERE name = ${reqBody.name} FOR UPDATE
      `;
        if (existingUser.length >= 1) {
            //ユーザ名重複エラー
            throw { code: 2, message: "ユーザ名重複" };
        }
        //ハッシュ化
        const hashedPassword = await bcryptjs_1.default.hash(reqBody.password, 10);
        //ユーザ登録
        const user = await tx.user.create({
            data: {
                name: reqBody.name,
                password: hashedPassword,
            },
        });
        return user;
    });
    //レスポンス
    const resBody = {
        code: 0,
        data: {
            user: user,
        },
    };
    res.json(resBody);
};
exports.postUser = postUser;
