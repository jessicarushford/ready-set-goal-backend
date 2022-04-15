import { ObjectId } from "mongodb";
import Comment from "./Comment";

export default interface Goal {
  _id?: ObjectId;
  uid: string;
  name: string;
  goalText: string;
  category: string;
  date: string;
  day: string;
  month: string;
  year: string;
  comments?: Comment[];
  likes?: string[];
  completed?: boolean;
}
