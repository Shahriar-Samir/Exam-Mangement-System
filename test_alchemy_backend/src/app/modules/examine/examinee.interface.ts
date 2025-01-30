import { Types } from "mongoose";

export type TExaminee = {
  id: String;
  questionPapers: [Types.ObjectId];
};
