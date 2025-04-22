"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostTaskReqSchema = exports.GetTaskResSchema = exports.GetTaskResDataSchema = exports.GetTaskReqSchema = exports.TaskWithSubTaskSchema = void 0;
const TaskSchema_1 = require("../modelSchema/TaskSchema");
const SubTaskSchema_1 = require("../modelSchema/SubTaskSchema");
const zod_1 = require("zod");
const commonType_1 = require("./commonType");
//結合して取得する場合は、以下のように型を拡張する。
exports.TaskWithSubTaskSchema = TaskSchema_1.TaskSchema.extend({
    subTaskList: zod_1.z.array(SubTaskSchema_1.SubTaskSchema),
});
//GET TASK REQUEST
exports.GetTaskReqSchema = zod_1.z.object({
    userId: zod_1.z.number(),
});
//GET TASK RESPONSE
exports.GetTaskResDataSchema = zod_1.z.object({
    taskList: zod_1.z.array(exports.TaskWithSubTaskSchema),
});
exports.GetTaskResSchema = (0, commonType_1.createResSchema)(exports.GetTaskResDataSchema);
//POST TASK REQUEST
exports.PostTaskReqSchema = zod_1.z.object({
    userId: zod_1.z.number(),
    taskList: zod_1.z.array(exports.TaskWithSubTaskSchema),
});
//POST TASK RESPONSE = COMMON RESPONSE
