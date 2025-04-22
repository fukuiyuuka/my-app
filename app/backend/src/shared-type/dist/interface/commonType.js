"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonResSchema = void 0;
exports.createResSchema = createResSchema;
const zod_1 = require("zod");
//COMMON RESPONSE
exports.CommonResSchema = zod_1.z.object({
    code: zod_1.z.number(),
    message: zod_1.z.string().optional(),
});
//API固有データあり。
function createResSchema(dataSchema) {
    return zod_1.z.object({
        code: zod_1.z.number(),
        message: zod_1.z.string().optional(),
        data: dataSchema.optional(),
    });
}
