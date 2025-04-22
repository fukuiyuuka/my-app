"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postLogin_1 = require("./api/postLogin");
const postUser_1 = require("./api/postUser");
const getTask_1 = require("./api/getTask");
const postTask_1 = require("./api/postTask");
const apiHandler_1 = require("./api/apiHandler");
const router = (0, express_1.Router)();
//LOGIN
router.post("/login", postLogin_1.postLogin);
//USER
router.post("/user", postUser_1.postUser);
//TASK
router.get("/task", (0, apiHandler_1.apiHandler)(getTask_1.getTask));
router.post("/task", postTask_1.postTask);
exports.default = router;
