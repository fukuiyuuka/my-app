import { Request, Response } from "express";
import { prisma } from "../prismaClient"; // Prisma Clientをインポート
import * as t from "@yukafukui/shared-type";

/**
 * ============================================
 * メソッド： POST
 * パス　　： /task
 * 処理概要： タスク、サブタスクを一括投入する。
 * ============================================
 */

export const postTask = async (req: Request, res: Response) => {
  //バリデーション
  if (!t.PostTaskReqSchema.safeParse(req.body).success) {
    //入力型エラー
    throw { code: 1, message: "入力エラー" };
  }
  const reqBody: t.PostTaskReq = t.PostTaskReqSchema.parse(req.body);

  //全件delete→全件insert（upsertではない）
  await replaceAllTasks(reqBody);

  const resBody: t.CommonRes = {
    code: 0,
  };
  res.json(resBody);
};

const replaceAllTasks = async (reqBody: t.PostTaskReq) => {
  await prisma.$transaction(async (tx) => {
    // SubTask は onDelete: Cascade により自動削除されるので Task だけ削除
    await tx.task.deleteMany({
      where: { userId: reqBody.userId },
    });

    // 新規登録
    for (const task of reqBody.taskList) {
      await tx.task.create({
        data: {
          userId: reqBody.userId,
          taskId: task.taskId,
          name: task.name,
          details: task.details,
          due: task.due,
          done: task.done,
        },
      });

      //複合キーの場合、親レコードと一緒に一括インサートが上手くいかなかった。
      if (task.subTaskList.length > 0) {
        await tx.subTask.createMany({
          data: task.subTaskList.map((sub) => ({
            userId: reqBody.userId,
            taskId: task.taskId,
            subTaskId: sub.subTaskId,
            name: sub.name,
            details: sub.details,
            due: sub.due,
            done: sub.done,
          })),
        });
      }
    }
  });
};
