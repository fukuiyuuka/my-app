import { Request, Response } from "express";
import { prisma } from "../prismaClient"; // Prisma Clientをインポート
import * as t from "@yukafukui/shared-type";

/**
 * ============================================
 * メソッド： GET
 * パス　　： /task
 * 処理概要： ユーザに紐づくタスクを取得する
 * ============================================
 */

export const getTask = async (req: Request, res: Response) => {
  //GETの場合、リクエストはクエリパラメータで受け取る。
  const userId = Number(req.query.userId);

  //バリデーション
  if (!userId) {
    //入力型エラー
    throw { code: 1, message: "入力エラー" };
  }

  //データ取得
  const taskList = await prisma.task.findMany({
    where: {
      userId,
    },
    include: {
      subTaskList: true,
    },
  });

  //正常終了
  const resBody: t.GetTaskRes = {
    code: 0,
    data: {
      taskList: taskList,
    },
  };
  res.json(resBody);
};
