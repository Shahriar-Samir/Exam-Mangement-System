import mongoose, { model, Schema } from "mongoose";
import { TMCQ, TQuestionPaper } from "./questionPaper.interface";
import { ExamineeModel } from "../examine/examinee.model";

const TMCQSchema: Schema = new Schema<TMCQ>({
  QPid: {
    type: String,
    ref: "QuestionPaper",
    required: true,
  },
  mcqId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAns: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
  mark: {
    type: Number,
    required: true,
  },
});

const questionPaperSchema = new Schema<TQuestionPaper>(
  {
    subject: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
    },
    MCQSet: {
      type: [TMCQSchema],
      required: true,
      default: [],
    },
    examineeId: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: String,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

questionPaperSchema.post("save", async function () {
  await ExamineeModel.updateOne(
    { uid: this.id },
    {
      $push: {
        questionPapers: [],
      },
    }
  );
});

export const QuestionPaperModel = model<TQuestionPaper>(
  "QuestionPaper",
  questionPaperSchema
);
