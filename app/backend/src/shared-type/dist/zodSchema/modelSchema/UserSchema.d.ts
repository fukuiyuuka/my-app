import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
    password: string;
}, {
    id: number;
    name: string;
    password: string;
}>;
export type User = z.infer<typeof UserSchema>;
export default UserSchema;
