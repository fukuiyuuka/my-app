import { z } from 'zod';

export const TaskScalarFieldEnumSchema = z.enum(['userId','taskId','name','details','due','done']);

export default TaskScalarFieldEnumSchema;
