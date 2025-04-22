import { UserSchema } from "../modelSchema/UserSchema";
import { z } from "zod";
import { createResSchema } from "./commonType";

//POST LOGIN REQUEST
export const PostLoginReqSchema = z.object({
  name: z.string(),
  password: z.string(),
});
export type PostLoginReq = z.infer<typeof PostLoginReqSchema>;

//POST LOGIN RESPONCE
const PostLoginResDataSchema = z.object({
  successLogin: z.boolean().optional(),
  user: UserSchema.optional(),
  token: z.string().optional(),
});
export const PostLoginResSchema = createResSchema(PostLoginResDataSchema);
export type PostLoginRes = z.infer<typeof PostLoginResSchema>;
