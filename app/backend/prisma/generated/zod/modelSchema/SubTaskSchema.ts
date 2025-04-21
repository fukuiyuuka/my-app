import { z } from 'zod';

/////////////////////////////////////////
// SUB TASK SCHEMA
/////////////////////////////////////////

export const SubTaskSchema = z.object({
  userId: z.number().int(),
  taskId: z.number().int(),
  subTaskId: z.number().int(),
  name: z.string(),
  details: z.string(),
  due: z.string(),
  done: z.boolean(),
})

export type SubTask = z.infer<typeof SubTaskSchema>

export default SubTaskSchema;
