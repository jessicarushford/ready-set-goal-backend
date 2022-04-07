import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import goalRouter from "./routes/goalRouter";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", goalRouter);
export const api = functions.https.onRequest(app);
