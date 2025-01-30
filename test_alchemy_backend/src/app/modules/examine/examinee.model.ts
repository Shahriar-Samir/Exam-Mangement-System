import { model, Schema } from "mongoose";
import { TExaminee } from "./examinee.interface";


const examineeSchema = new Schema<TExaminee>({
  id: {
    type: String,
  },
  questionPapers: {
    type: [Schema.Types.ObjectId],
    ref: "QuestionPaper",
    required: true,
  },
},{
  timestamps:true
});

export const ExamineeModel = model("Examinee", examineeSchema);
