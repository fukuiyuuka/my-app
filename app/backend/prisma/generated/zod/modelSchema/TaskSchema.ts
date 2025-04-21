import { z } from 'zod';

/////////////////////////////////////////
// TASK SCHEMA
/////////////////////////////////////////

export const TaskSchema = z.object({
  userId: z.number().int(),
  taskId: z.number().int(),
  name: z.string(),
  details: z.string(),
  due: z.string(),
  done: z.boolean(),
})

export type Task = z.infer<typeof TaskSchema>

export default TaskSchema;
