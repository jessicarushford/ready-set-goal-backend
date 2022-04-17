import express from "express";

import { getClient } from "../db";
import Friend from "../models/Friend";
import User from "../models/User";

const userRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

// get one user to access friends
userRouter.get("/:uid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .findOne({ uid: uid as string });
    res.json(result);
  } catch (err) {
    errorResponse(err, res);
  }
});

// create a new user in database
userRouter.post("/", async (req, res) => {
  try {
    const client = await getClient();
    await client.db().collection<User>("users").insertOne(req.body);
    console.log(req.body);
    res.status(201).json(req.body);
  } catch (err) {
    errorResponse(err, res);
  }
});

// add a friend to a user's friend list
userRouter.put("/:uid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const newFriend: Friend = req.body;
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .updateOne({ uid }, { $push: { friends: newFriend } });
    if (result.modifiedCount) {
      res.status(200).json(newFriend);
    } else {
      res.status(404);
      res.send(`ID ${uid} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// delete a friend from a user's friend list
userRouter.put("/:userUid/friends/:friendUid", async (req, res) => {
  try {
    const userUid: string = req.params.userUid;
    const friendUid: string = req.params.friendUid;
    console.log(userUid, friendUid);
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .updateOne({ uid: userUid }, { $pull: { friends: { uid: friendUid } } });
    console.log(result);
    if (result.modifiedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).send(`UID ${userUid} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.put("/lastLogin/:uid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const lastLogin = `${month}.${day}.${year}`;
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .updateOne({ uid }, { $set: { lastLogin } });
    if (result.modifiedCount) {
      res.sendStatus(200);
    } else {
      res.status(404);
      res.send(`ID ${uid} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default userRouter;
