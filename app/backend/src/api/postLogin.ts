import { Request, Response } from "express";
import { prisma } from "../prismaClient"; // Prisma Clientをインポート
import * as t from "@yukafukui/shared-type";
import { z } from "zod";
import bcrypt from "bcryptjs";

/**
 * ============================================
 * メソッド： POST
 * パス　　： /login
 * 処理概要： ログイン処理
 * ============================================
 */

export const postLogin = async (req: Request, res: Response) => {
  //入力バリデーション
  if (!t.PostLoginReqSchema.safeParse(req.body)) {
    throw { code: 1 };
  }
  const reqBody = t.PostLoginReqSchema.parse(req.body);

  //ユーザ取得
  const user = await prisma.user.findUnique({
    where: { name: reqBody.name },
  });

  if (user) {
    //パスワード照合
    const match = await bcrypt.compare(reqBody.password, user.password);
    if (match) {
      //ログイン成功
      const resBody: t.PostLoginRes = {
        code: 0,
        data: {
          successLogin: true,
          user: user,
        },
      };
      req.session.logined = true; //セッションの状態を更新
      res.json(resBody);
      return;
    }
  }

  //ログイン失敗（ユーザ名なしorパスワード不一致）
  const resBody: t.PostLoginRes = {
    code: 0,
    data: {
      successLogin: false,
    },
  };
  res.json(resBody);
};
