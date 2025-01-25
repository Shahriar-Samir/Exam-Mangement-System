import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
import { CandidateModel } from "../candidate/candidate.model";
import { ExamineeModel } from "../examine/examinee.model";

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["candidate", "examinee", "admin"],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    loggedOutTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const hashedPass = await bcrypt.hash(this.password as string, 6);
  this.password = hashedPass;
  next();
});

// userSchema.post("save", async function () {
//   if (this.userType === "candidate") {
//     console.log(this.id);
//     await CandidateModel.create({
//       uid: this.id,
//       examSet: [],
//     });
//   }
//   if (this.userType === "examinee") {
//     await ExamineeModel.create({
//       uid: this.id,
//       questionPapers: [],
//     });
//   }
// });

userSchema.pre("findOneAndUpdate", async function (next) {
  console.log(this);
  next();
});

export const UserModel = model<TUser>("User", userSchema);
