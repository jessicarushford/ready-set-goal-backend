import express from "express";
import { ObjectId } from "mongodb";
import { getClient } from "../db";
import Goal from "../models/Goal";

const goalRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

//create APIs to hit data from Mongo

//get all goals
goalRouter.get("/", async (req, res) => {
  try {
    const {} = req.query;
    const client = await getClient();
    const results = await client
      .db()
      .collection<Goal>("goals")
      .find()
      .toArray();
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

//get goals by id
goalRouter.get("/:id", async (req, res) => {
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
goalRouter.get("/:uid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Goal>("goals")
      .findOne({ uid: uid as string });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).send(`ID ${uid} was not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

//add goal
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

export default goalRouter;
