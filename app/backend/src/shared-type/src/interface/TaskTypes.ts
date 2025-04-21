import { TaskSchema } from "../modelSchema/TaskSchema";
import { SubTaskSchema } from "../modelSchema/SubTaskSchema";
import { z } from "zod";
import { createResSchema } from "./commonType";

//結合して取得する場合は、以下のように型を拡張する。
export const TaskWithSubTaskSchema = TaskSchema.extend({
  subTaskList: z.array(SubTaskSchema),
});

//GET TASK REQUEST
export const GetTaskReqSchema = z.object({
  userId: z.number(),
});
export type GetTaskReq = z.infer<typeof GetTaskReqSchema>;

//GET TASK RESPONSE
export const GetTaskResDataSchema = z.object({
  taskList: z.array(TaskWithSubTaskSchema),
});

export const GetTaskResSchema = createResSchema(GetTaskResDataSchema);
export type GetTaskRes = z.infer<typeof GetTaskResSchema>;

//POST TASK REQUEST
export const PostTaskReqSchema = z.object({
  userId: z.number(),
  taskList: z.array(TaskWithSubTaskSchema),
});

export type PostTaskReq = z.infer<typeof PostTaskReqSchema>;

//POST TASK RESPONSE = COMMON RESPONSE
