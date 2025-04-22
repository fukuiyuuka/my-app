import { z } from "zod";
export declare const PostLoginReqSchema: z.ZodObject<{
    name: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    password: string;
}, {
    name: string;
    password: string;
}>;
export type PostLoginReq = z.infer<typeof PostLoginReqSchema>;
export declare const PostLoginResSchema: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodObject<{
        successLogin: z.ZodOptional<z.ZodBoolean>;
        user: z.ZodOptional<z.ZodObject<{
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
        }>>;
        token: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        user?: {
            id: number;
            name: string;
            password: string;
        } | undefined;
        successLogin?: boolean | undefined;
        token?: string | undefined;
    }, {
        user?: {
            id: number;
            name: string;
            password: string;
        } | undefined;
        successLogin?: boolean | undefined;
        token?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    code: number;
    message?: string | undefined;
    data?: {
        user?: {
            id: number;
            name: string;
            password: string;
        } | undefined;
        successLogin?: boolean | undefined;
        token?: string | undefined;
    } | undefined;
}, {
    code: number;
    message?: string | undefined;
    data?: {
        user?: {
            id: number;
            name: string;
            password: string;
        } | undefined;
        successLogin?: boolean | undefined;
        token?: string | undefined;
    } | undefined;
}>;
export type PostLoginRes = z.infer<typeof PostLoginResSchema>;
