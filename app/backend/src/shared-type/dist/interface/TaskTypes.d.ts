import { z } from "zod";
export declare const TaskWithSubTaskSchema: z.ZodObject<z.objectUtil.extendShape<{
    userId: z.ZodNumber;
    taskId: z.ZodNumber;
    name: z.ZodString;
    details: z.ZodString;
    due: z.ZodString;
    done: z.ZodBoolean;
}, {
    subTaskList: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
}>, "strip", z.ZodTypeAny, {
    name: string;
    userId: number;
    taskId: number;
    details: string;
    due: string;
    done: boolean;
    subTaskList: {
        name: string;
        userId: number;
        taskId: number;
        details: string;
        due: string;
        done: boolean;
        subTaskId: number;
    }[];
}, {
    name: string;
    userId: number;
    taskId: number;
    details: string;
    due: string;
    done: boolean;
    subTaskList: {
        name: string;
        userId: number;
        taskId: number;
        details: string;
        due: string;
        done: boolean;
        subTaskId: number;
    }[];
}>;
export declare const GetTaskReqSchema: z.ZodObject<{
    userId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    userId: number;
}, {
    userId: number;
}>;
export type GetTaskReq = z.infer<typeof GetTaskReqSchema>;
export declare const GetTaskResDataSchema: z.ZodObject<{
    taskList: z.ZodArray<z.ZodObject<z.objectUtil.extendShape<{
        userId: z.ZodNumber;
        taskId: z.ZodNumber;
        name: z.ZodString;
        details: z.ZodString;
        due: z.ZodString;
        done: z.ZodBoolean;
    }, {
        subTaskList: z.ZodArray<z.ZodObject<{
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
        }>, "many">;
    }>, "strip", z.ZodTypeAny, {
        name: string;
        userId: number;
        taskId: number;
        details: string;
        due: string;
        done: boolean;
        subTaskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskId: number;
        }[];
    }, {
        name: string;
        userId: number;
        taskId: number;
        details: string;
        due: string;
        done: boolean;
        subTaskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskId: number;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    taskList: {
        name: string;
        userId: number;
        taskId: number;
        details: string;
        due: string;
        done: boolean;
        subTaskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskId: number;
        }[];
    }[];
}, {
    taskList: {
        name: string;
        userId: number;
        taskId: number;
        details: string;
        due: string;
        done: boolean;
        subTaskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskId: number;
        }[];
    }[];
}>;
export declare const GetTaskResSchema: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodObject<{
        taskList: z.ZodArray<z.ZodObject<z.objectUtil.extendShape<{
            userId: z.ZodNumber;
            taskId: z.ZodNumber;
            name: z.ZodString;
            details: z.ZodString;
            due: z.ZodString;
            done: z.ZodBoolean;
        }, {
            subTaskList: z.ZodArray<z.ZodObject<{
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
            }>, "many">;
        }>, "strip", z.ZodTypeAny, {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskList: {
                name: string;
                userId: number;
                taskId: number;
                details: string;
                due: string;
                done: boolean;
                subTaskId: number;
            }[];
        }, {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskList: {
                name: string;
                userId: number;
                taskId: number;
                details: string;
                due: string;
                done: boolean;
                subTaskId: number;
            }[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        taskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskList: {
                name: string;
                userId: number;
                taskId: number;
                details: string;
                due: string;
                done: boolean;
                subTaskId: number;
            }[];
        }[];
    }, {
        taskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskList: {
                name: string;
                userId: number;
                taskId: number;
                details: string;
                due: string;
                done: boolean;
                subTaskId: number;
            }[];
        }[];
    }>>;
}, "strip", z.ZodTypeAny, {
    code: number;
    message?: string | undefined;
    data?: {
        taskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskList: {
                name: string;
                userId: number;
                taskId: number;
                details: string;
                due: string;
                done: boolean;
                subTaskId: number;
            }[];
        }[];
    } | undefined;
}, {
    code: number;
    message?: string | undefined;
    data?: {
        taskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskList: {
                name: string;
                userId: number;
                taskId: number;
                details: string;
                due: string;
                done: boolean;
                subTaskId: number;
            }[];
        }[];
    } | undefined;
}>;
export type GetTaskRes = z.infer<typeof GetTaskResSchema>;
export declare const PostTaskReqSchema: z.ZodObject<{
    userId: z.ZodNumber;
    taskList: z.ZodArray<z.ZodObject<z.objectUtil.extendShape<{
        userId: z.ZodNumber;
        taskId: z.ZodNumber;
        name: z.ZodString;
        details: z.ZodString;
        due: z.ZodString;
        done: z.ZodBoolean;
    }, {
        subTaskList: z.ZodArray<z.ZodObject<{
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
        }>, "many">;
    }>, "strip", z.ZodTypeAny, {
        name: string;
        userId: number;
        taskId: number;
        details: string;
        due: string;
        done: boolean;
        subTaskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskId: number;
        }[];
    }, {
        name: string;
        userId: number;
        taskId: number;
        details: string;
        due: string;
        done: boolean;
        subTaskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskId: number;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    userId: number;
    taskList: {
        name: string;
        userId: number;
        taskId: number;
        details: string;
        due: string;
        done: boolean;
        subTaskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskId: number;
        }[];
    }[];
}, {
    userId: number;
    taskList: {
        name: string;
        userId: number;
        taskId: number;
        details: string;
        due: string;
        done: boolean;
        subTaskList: {
            name: string;
            userId: number;
            taskId: number;
            details: string;
            due: string;
            done: boolean;
            subTaskId: number;
        }[];
    }[];
}>;
export type PostTaskReq = z.infer<typeof PostTaskReqSchema>;
