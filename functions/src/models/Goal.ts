import { ObjectId } from "mongodb";
import Comment from "./Comment";

export default interface Goal {
  _id?: ObjectId;
  uid: string;
  name: string;
  goalText: string;
  category: string;
  month: string;
  date: string;
  year: string;
  comments?: Comment[];
  likes?: number;
  completed?: boolean;
}
