import express from "express";
import { PATH } from "~/config/path.js";
import userRouter from "./accountRouter.js";

const router = express.Router();

router.use(PATH.USER.PATH, userRouter);

export default router;
