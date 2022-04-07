import { ObjectId } from "mongodb";
import Friend from "./Friend";

export default interface User {
  _id?: ObjectId;
  uid: string;
  friends: Friend[];
}
