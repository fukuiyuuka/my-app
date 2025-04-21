import { z } from "zod";

//COMMON RESPONSE
export const CommonResSchema = z.object({
  code: z.number(),
  message: z.string().optional(),
});

export type CommonRes = z.infer<typeof CommonResSchema>;

//API固有データあり。
export function createResSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    code: z.number(),
    message: z.string().optional(),
    data: dataSchema.optional(),
  });
}
