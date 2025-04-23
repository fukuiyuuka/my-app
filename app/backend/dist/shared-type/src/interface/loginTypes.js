"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostLoginResSchema = exports.PostLoginReqSchema = void 0;
const UserSchema_1 = require("../modelSchema/UserSchema");
const zod_1 = require("zod");
const commonType_1 = require("./commonType");
//POST LOGIN REQUEST
exports.PostLoginReqSchema = zod_1.z.object({
    name: zod_1.z.string(),
    password: zod_1.z.string(),
});
//POST LOGIN RESPONCE
const PostLoginResDataSchema = zod_1.z.object({
    successLogin: zod_1.z.boolean().optional(),
    user: UserSchema_1.UserSchema.optional(),
    token: zod_1.z.string().optional(),
});
exports.PostLoginResSchema = (0, commonType_1.createResSchema)(PostLoginResDataSchema);
