import { UserSchema } from "../modelSchema/UserSchema";
import { z } from "zod";
import { createResSchema } from "./commonType";

//POST USER REQUEST
export const PostUserReqSchema = z.object({
  name: z.string(),
  password: z.string(),
});
export type PostUserReq = z.infer<typeof PostUserReqSchema>;

//POST USER RESPONSE
export const PostUserResDataSchema = z.object({
  user: UserSchema.optional(),
});
export const PostUserResSchema = createResSchema(PostUserResDataSchema);
export type PostUserRes = z.infer<typeof PostUserResSchema>;
