import { Types } from "mongoose";

export type TQuestionPaper = {
  id: string;
  subject: string;
  examineeId: string;
  duration: number;
  totalMarks?: number;
  MCQSet: TMCQ[];
  isDeleted: Boolean;
};

export type TMCQ = {
  QPid: string;
  mcqId: string;
  question: string;
  options: string[];
  correctAns: 1 | 2 | 3 | 4;
  mark: number;
};
