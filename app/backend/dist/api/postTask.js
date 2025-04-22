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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTask = void 0;
const prismaClient_1 = require("../prismaClient"); // Prisma Clientをインポート
const t = __importStar(require("@yukafukui/shared-type"));
/**
 * ============================================
 * メソッド： POST
 * パス　　： /task
 * 処理概要： タスク、サブタスクを一括投入する。
 * ============================================
 */
const postTask = async (req, res) => {
    //バリデーション
    if (!t.PostTaskReqSchema.safeParse(req.body).success) {
        //入力型エラー
        throw { code: 1, message: "入力エラー" };
    }
    const reqBody = t.PostTaskReqSchema.parse(req.body);
    //全件delete→全件insert（upsertではない）
    await replaceAllTasks(reqBody);
    const resBody = {
        code: 0,
    };
    res.json(resBody);
};
exports.postTask = postTask;
const replaceAllTasks = async (reqBody) => {
    await prismaClient_1.prisma.$transaction(async (tx) => {
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
