import express from "express";
import { ObjectId } from "mongodb";
import { getClient } from "../db";
import Goal from "../models/Goal";

import Query from "../models/Query";

const goalRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

//create APIs to hit data from Mongo

//get all goals
//using sort, get data in reverse order, with limit, only most recent 9 items will be shown in dashboard
goalRouter.get("/", async (req, res) => {
  try {
    const { uid } = req.query;
    const query: Query = {
      ...(uid ? { uid: uid as string } : {}),
    };
    const client = await getClient();
    const results = await client
      .db()
      .collection<Goal>("goals")
      .find(query)
      .sort({ _id: -1 })
      // .limit(9)
      .toArray();
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

//get a goal by id
goalRouter.get("/details/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Goal>("goals")
      .findOne({ _id: new ObjectId(id) });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).send(`ID ${id} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

//get by uid to see the goals in other user's page
// goalRouter.get("/:uid", async (req, res) => {
//   try {
//     const uid: string = req.params.uid;
//     const client = await getClient();
//     const result = await client
//       .db()
//       .collection<Goal>("goals")
//       .find({ uid: uid as string })
//       .toArray();
//     res.json(result);
//   } catch (err) {
//     errorResponse(err, res);
//   }
// });

//add a goal
goalRouter.post("/", async (req, res) => {
  try {
    const newGoal: Goal = req.body;
    const client = await getClient();
    await client.db().collection<Goal>("goals").insertOne(newGoal);
    res.status(201).json(newGoal);
  } catch (err) {
    errorResponse(err, res);
  }
});

//delete by id
goalRouter.delete("/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Goal>("goals")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404);
      res.send(`ID ${id} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

//update a goal with adding uid into likes
goalRouter.put("/:id/likes/add/:uid", async (req, res) => {
  try {
    const id: string = req.params.id;
    const uid: string = req.params.uid;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Goal>("goals")
      .updateOne({ _id: new ObjectId(id) }, { $push: { likes: uid } });
    if (result.modifiedCount) {
      res.status(200).json(result);
    } else {
      res.status(404);
      res.send(`ID ${id} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

//delete uid in likes when the user unliked.
goalRouter.put("/:id/likes/delete/:uid", async (req, res) => {
  try {
    const id: string = req.params.id;
    const uid: string = req.params.uid;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Goal>("goals")
      .updateOne({ _id: new ObjectId(id) }, { $pull: { likes: uid } });
    if (result.modifiedCount) {
      res.status(200).json(result);
    } else {
      res.status(404);
      res.send(`ID ${id} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// add a comment to a user's posts comment list
goalRouter.put("/new-comment/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    const newComment: Comment | undefined = req.body;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Goal>("goals")
      .updateOne(
        { _id: new ObjectId(id) },
        { $addToSet: { comments: newComment } }
      );
    if (result.modifiedCount) {
      res.status(200).json(newComment);
    } else {
      res.status(404);
      res.send(`ID ${id} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

goalRouter.put("/completed/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    // const uid: string = req.params.uid;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Goal>("goals")
      .updateOne({ _id: new ObjectId(id) }, { $set: { completed: true } });
    if (result.modifiedCount) {
      res.sendStatus(200);
    } else {
      res.status(404);
      res.send(`ID ${id} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

goalRouter.put("/missed/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    // const uid: string = req.params.uid;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Goal>("goals")
      .updateOne({ _id: new ObjectId(id) }, { $set: { completed: false } });
    if (result.modifiedCount) {
      res.sendStatus(200);
    } else {
      res.status(404);
      res.send(`ID ${id} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default goalRouter;
