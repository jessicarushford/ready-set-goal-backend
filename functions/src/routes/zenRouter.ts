import express from "express";
import axios from "axios";

const zenRouter = express.Router();

zenRouter.get("/", async (req, res) => {
  const results = (await axios.get("https://zenquotes.io/api/today")).data;
  res.status(200).json(results[0]);
});

export default zenRouter;
