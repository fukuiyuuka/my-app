import { Request, Response } from "express";
import { prisma } from "../prismaClient"; // Prisma Clientをインポート
import * as t from "@yukafukui/shared-type";

//API実行
//エラー処理、ログ出力処理

export const apiHandler = (api: Function) => {
  return async (req: Request, res: Response) => {
    console.log(`-Controller ${req.method} ${req.path} BEGIN-`);
    try {
      await api(req, res);
    } catch (e) {
      console.error(e);
      //異常終了
      const resBody: t.CommonRes = t.CommonResSchema.safeParse(e)
        ? t.CommonResSchema.parse(e)
        : { code: -1, message: "異常終了" };
      res.json(resBody);
    } finally {
      console.log(`-Controller ${req.method} ${req.path} END-`);
    }
  };
};
