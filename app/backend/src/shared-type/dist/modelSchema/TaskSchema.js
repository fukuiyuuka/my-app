"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = void 0;
const zod_1 = require("zod");
/////////////////////////////////////////
// TASK SCHEMA
/////////////////////////////////////////
exports.TaskSchema = zod_1.z.object({
    userId: zod_1.z.number().int(),
    taskId: zod_1.z.number().int(),
    name: zod_1.z.string(),
    details: zod_1.z.string(),
    due: zod_1.z.string(),
    done: zod_1.z.boolean(),
});
