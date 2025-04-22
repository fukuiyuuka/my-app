import { z } from "zod";
export declare const SubTaskSchema: z.ZodObject<{
    userId: z.ZodNumber;
    taskId: z.ZodNumber;
    subTaskId: z.ZodNumber;
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
    subTaskId: number;
}, {
    name: string;
    userId: number;
    taskId: number;
    details: string;
    due: string;
    done: boolean;
    subTaskId: number;
}>;
export type SubTask = z.infer<typeof SubTaskSchema>;
