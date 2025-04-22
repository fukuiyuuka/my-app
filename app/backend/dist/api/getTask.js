"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTask = void 0;
const prismaClient_1 = require("../prismaClient"); // Prisma Clientをインポート
/**
 * ============================================
 * メソッド： GET
 * パス　　： /task
 * 処理概要： ユーザに紐づくタスクを取得する
 * ============================================
 */
const getTask = async (req, res) => {
    //GETの場合、リクエストはクエリパラメータで受け取る。
    const userId = Number(req.query.userId);
    //バリデーション
    if (!userId) {
        //入力型エラー
        throw { code: 1, message: "入力エラー" };
    }
    //データ取得
    const taskList = await prismaClient_1.prisma.task.findMany({
        where: {
            userId,
        },
        include: {
            subTaskList: true,
        },
    });
    //正常終了
    const resBody = {
        code: 0,
        data: {
            taskList: taskList,
        },
    };
    res.json(resBody);
};
exports.getTask = getTask;
