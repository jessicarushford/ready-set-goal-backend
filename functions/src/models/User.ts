import { ObjectId } from "mongodb";
import Friend from "./Friend";
import LastLogin from "./LastLogin";

export default interface User {
  _id?: ObjectId;
  uid: string;
  name: string;
  friends: Friend[];
  lastLogin: LastLogin;
}
