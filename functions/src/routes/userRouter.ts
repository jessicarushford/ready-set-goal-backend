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
      .find({ uid: uid as string })
      .toArray();
    res.json(result);
  } catch (err) {
    errorResponse(err, res);
  }
});

// create a new user in database
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
// userRouter.put("/:uid", async (req, res) => {
//   try {
//     const uid: string = req.params.uid;
//     const friendUid: string = req.body;
//     const client = await getClient();
//     const result = await client
//       .db()
//       .collection<User>("users")
//       .updateOne({ uid}, { $unset: { friends: friendUid } });
//     if (result.modifiedCount) {
//       res.sendStatus(204);
//     } else {
//       res.status(404).send(`ID ${id} was not found`);
//     }
//   } catch (err) {
//     errorResponse(err, res);
//   }
// });
// test

export default userRouter;
