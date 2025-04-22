import { z } from "zod";
export declare const TaskSchema: z.ZodObject<{
    userId: z.ZodNumber;
    taskId: z.ZodNumber;
    name: z.ZodString;
    details: z.ZodString;
    due: z.ZodString;
    done: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    name: string;
    userId: number;
    taskId: number;
    details: string;
    due: string;
    done: boolean;
}, {
    name: string;
    userId: number;
    taskId: number;
    details: string;
    due: string;
    done: boolean;
}>;
export type Task = z.infer<typeof TaskSchema>;
