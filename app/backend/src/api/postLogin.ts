import { Request, Response } from "express";
import { prisma } from "../prismaClient"; // Prisma Clientをインポート
import * as t from "@yukafukui/shared-type";
import { z } from "zod";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

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

      const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

      //DBと照合し、成功したらtokenを生成
      const token = jwt.sign({ id: user.id, username: user.name }, JWT_SECRET, {
        expiresIn: "1h",
      });
      const resBody: t.PostLoginRes = {
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
  const resBody: t.PostLoginRes = {
    code: 0,
    data: {
      successLogin: false,
    },
  };
  res.json(resBody);
};
