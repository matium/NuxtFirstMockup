import express from "express";
import { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { router as indexRouter } from "./routes/index";
import { router as testRouter } from "./routes/test";
import { router as authRouter } from "./routes/auth";

const app = express();
export default app;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/test', testRouter);
app.use('/auth', authRouter);
