import { Types } from "mongoose";

export type TCandidate = {
  id: string;
  examSet: [Types.ObjectId];
}
;
