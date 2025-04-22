import { z } from "zod";
export declare const PostUserReqSchema: z.ZodObject<{
    name: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    password: string;
}, {
    name: string;
    password: string;
}>;
export type PostUserReq = z.infer<typeof PostUserReqSchema>;
export declare const PostUserResDataSchema: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    user?: {
        id: number;
        name: string;
        password: string;
    } | undefined;
}, {
    user?: {
        id: number;
        name: string;
        password: string;
    } | undefined;
}>;
export declare const PostUserResSchema: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodObject<{
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
    }, "strip", z.ZodTypeAny, {
        user?: {
            id: number;
            name: string;
            password: string;
        } | undefined;
    }, {
        user?: {
            id: number;
            name: string;
            password: string;
        } | undefined;
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
    } | undefined;
}>;
export type PostUserRes = z.infer<typeof PostUserResSchema>;
