import { z } from "zod";
export declare const CommonResSchema: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: number;
    message?: string | undefined;
}, {
    code: number;
    message?: string | undefined;
}>;
export type CommonRes = z.infer<typeof CommonResSchema>;
export declare function createResSchema<T extends z.ZodTypeAny>(dataSchema: T): z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<T>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    code: z.ZodNumber;
    message: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<T>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    code: z.ZodNumber;
    message: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<T>;
}>, any>[k]; } : never, z.baseObjectInputType<{
    code: z.ZodNumber;
    message: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<T>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<{
    code: z.ZodNumber;
    message: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<T>;
}>[k_1]; } : never>;
