import { ClientSession, startSession } from "mongoose";
import idGenerator from "../../util/idGenarator";
import { CandidateModel } from "../candidate/candidate.model";
import { ExamineeModel } from "../examine/examinee.model";
import { TUser, TUserUpdateData } from "./user.interface";
import { UserModel } from "./user.model";
// import { uploadImgToCloudinary } from "../../util/uploadImgToCloudinary";

const createUser = async (payload: TUser) => {
  // make id generator for candidate,examinee,admin
  const uId = await idGenerator.generateId(payload.userType);
  if (!uId) {
    throw new Error("Id not generated");
  }

  const isUserExist = await UserModel.findOne({
    email: payload.email,
    isDeleted: false,
  });
  if (isUserExist) {
    throw new Error("User already exist");
  }

  // upload ing first
  // const uploadImg = await uploadImgToCloudinary(payload.id, file.path);
  // if (!uploadImg) {
  //   throw new Error("Image not uploaded");
  // }

  payload.id = uId as string;
  // payload.img = uploadImg.secure_url;

  const session: ClientSession = await startSession(); // Start the session
  session.startTransaction(); // Begin transaction

  try {
    // Create the user in the User model
    const createUser = await UserModel.create([payload], { session });

    // Declare a variable to hold the create promise for Candidate/Examinee
    let createExamineeOrCandidate;

    if (payload.userType === "candidate") {
      // Ensure the correct fields are passed to the Candidate model
      createExamineeOrCandidate = CandidateModel.create([{ id: payload.id }], {
        session,
      });
    } else if (payload.userType === "examinee") {
      // Ensure the correct fields are passed to the Examinee model
      createExamineeOrCandidate = ExamineeModel.create([{ id: payload.id }], {
        session,
      });
    }

    // Await the result for the candidate/examinee creation
    await createExamineeOrCandidate;

    // Commit the transaction after both User and related models are created
    await session.commitTransaction(); // Commit the transaction

    const user = createUser[0];
    const result = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      img: user.img,
      userType: user.userType,
    };
    return result;
  } catch (error: any) {
    await session.abortTransaction(); // Rollback the transaction
    throw new Error(error);
  } finally {
    session.endSession();
  }
};

const getSingleUser = async (id: string) => {
  const isUserExist = await UserModel.findOne({
    id,
    isDeleted: false,
  });
  if (!isUserExist) {
    throw new Error("User dose not exist");
  }
  const result = isUserExist;
  return result;
};

const getAllUser = async (firstName: string, lastName: string) => {
  const query: any = { isDeleted: false };
  if (firstName) {
    query.firstName = { $regex: firstName, $options: "i" };
  }
  if (lastName) {
    query.lastName = { $regex: lastName, $options: "i" };
  }
  const result = await UserModel.find(query);
  return result;
};

const updateUser = async (id: string, payload: TUserUpdateData) => {
  const isUserExist = await UserModel.findOne({
    id,
    isDeleted: false,
  });

  if (!isUserExist) {
    throw new Error("User dose not exist");
  }

  const result = await UserModel.updateOne(
    { id, isDeleted: false },
    { firstName: payload.firstName, lastName: payload.lastName }
  );
  return result;
};

const deleteUser = async (id: string) => {
  const result = await UserModel.updateOne({ id }, { isDeleted: true });
  return result;
};

const userServices = {
  createUser,
  updateUser,
  getSingleUser,
  getAllUser,
  deleteUser,
};
export default userServices;
