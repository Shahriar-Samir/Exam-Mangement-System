import { model, Schema } from "mongoose";
import { TCandidate } from "./candidate.interface";

const candidateSchema = new Schema<TCandidate>({
  id: {
    type: String,
  },
  examSet: {
    type: [Schema.Types.ObjectId],
    ref: "Exam",
    required: true,
  },
},{
  timestamps:true
});

export const CandidateModel = model("Candidate", candidateSchema);
