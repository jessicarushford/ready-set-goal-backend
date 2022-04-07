import express from "express";
import { getClient } from "../db";
import Friend from "../models/Friend";
import User from "../models/User";

const userRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};
userRouter.get("/:uid", async (req, res) => {
  try {
    const { friends } = req.query;
    const client = await getClient();
    if (friends) {
      const results = await client
        .db()
        .collection<User>("users")
        .find()
        .toArray();
      res.json(results);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});
userRouter.post("/:uid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const newUser: User = { uid, friends: [] };
    const client = await getClient();
    await client.db().collection<User>("users").insertOne(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    errorResponse(err, res);
  }
});
userRouter.put("/:uid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const newFriend: Friend = req.body;
    const client = await getClient();
    await client
      .db()
      .collection<User>("users")
      .updateOne({ uid }, { $push: { friends: newFriend } });
  } catch (err) {
    errorResponse(err, res);
  }
});
userRouter.delete("/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .deleteOne({ uid: id });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).send(`ID ${id} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default userRouter;
