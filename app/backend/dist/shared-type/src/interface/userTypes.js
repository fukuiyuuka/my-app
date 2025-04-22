"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostUserResSchema = exports.PostUserResDataSchema = exports.PostUserReqSchema = void 0;
const UserSchema_1 = require("../modelSchema/UserSchema");
const zod_1 = require("zod");
const commonType_1 = require("./commonType");
//POST USER REQUEST
exports.PostUserReqSchema = zod_1.z.object({
    name: zod_1.z.string(),
    password: zod_1.z.string(),
});
//POST USER RESPONSE
exports.PostUserResDataSchema = zod_1.z.object({
    user: UserSchema_1.UserSchema.optional(),
});
exports.PostUserResSchema = (0, commonType_1.createResSchema)(exports.PostUserResDataSchema);
