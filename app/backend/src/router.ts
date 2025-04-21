import { Router } from "express";
import { postLogin } from "./api/postLogin";
import { postUser } from "./api/postUser";
import { getTask } from "./api/getTask";
import { postTask } from "./api/postTask";
import { apiHandler } from "./api/apiHandler";

const router: Router = Router();

//LOGIN
router.post("/login", postLogin);

//USER
router.post("/user", postUser);

//TASK
router.get("/task", apiHandler(getTask));
router.post("/task", postTask);

export default router;
