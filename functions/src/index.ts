import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import goalRouter from "./routes/goalRouter";
import userRouter from "./routes/userRouter";
import zenRouter from "./routes/zenRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/goals", goalRouter);
app.use("/users", userRouter);
app.use("/", zenRouter);
export const api = functions.https.onRequest(app);
