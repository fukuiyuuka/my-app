import { z } from 'zod';

export const SubTaskScalarFieldEnumSchema = z.enum(['userId','taskId','subTaskId','name','details','due','done']);

export default SubTaskScalarFieldEnumSchema;
