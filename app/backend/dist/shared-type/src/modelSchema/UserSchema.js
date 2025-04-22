"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = require("zod");
/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    name: zod_1.z.string(),
    password: zod_1.z.string(),
});
