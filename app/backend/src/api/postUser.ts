import { Request, Response } from "express";
import { prisma } from "../prismaClient"; // Prisma Clientをインポート
import * as t from "@yukafukui/shared-type";
import { number, z } from "zod";
import bcrypt from "bcryptjs";

/**
 * ============================================
 * メソッド： POST
 * パス　　： /user
 * 処理概要： ユーザ新規作成
 * ============================================
 */
export const postUser = async (req: Request, res: Response) => {
  //バリデーション
  if (!t.PostUserReqSchema.safeParse(req.body)) {
    //入力型エラー
    throw { code: 1, message: "入力エラー" };
  }
  const reqBody: t.PostUserReq = t.PostUserReqSchema.parse(req.body);

  //トランザクション開始
  const user = await prisma.$transaction(async (tx) => {
    //ユーザ名重複チェック
    //ロックのため直接クエリを指定
    const existingUser = await tx.$queryRaw<t.User[]>`
        SELECT * FROM "User" WHERE name = ${reqBody.name} FOR UPDATE
      `;
    if (existingUser.length >= 1) {
      //ユーザ名重複エラー
      throw { code: 2, message: "ユーザ名重複" };
    }

    //ハッシュ化
    const hashedPassword = await bcrypt.hash(reqBody.password, 10);
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
  const resBody: t.PostUserRes = {
    code: 0,
    data: {
      user: user,
    },
  };
  res.json(resBody);
};
