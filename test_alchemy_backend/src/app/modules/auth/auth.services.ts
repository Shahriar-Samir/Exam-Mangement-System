import bcrypt from "bcrypt";
import  { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { UserModel } from "../user/user.model";
import authUtill from "./auth.utill";

const logIn = async (email: string, password: string) => {
  const findUserWithEmail = await UserModel.findOne({
    email: email,
    isDeleted: false,
  }).select("+password");

  if (!findUserWithEmail) {
    throw Error("no user found with this email");
  }

  const match = await bcrypt.compare(password, findUserWithEmail.password);
  if (!match) {
    throw Error("password is not matched");
  }

  const findUserAndUpdate = await UserModel.findOneAndUpdate(
    { email: email },
    { isLoggedIn: true },
    { new: true }
  );

  if (!findUserWithEmail) {
    throw Error("no; user found with this email");
  }

  // Tokenize user data
  const tokenizeData = {
    id: findUserWithEmail.id,
    role: findUserWithEmail.userType,
  };
  const approvalToken = authUtill.createToken(
    tokenizeData,
    config.jwt_token_secret,
    config.token_expairsIn
  );
  const refreshToken = authUtill.createToken(
    tokenizeData,
    config.jwt_refresh_Token_secret,
    config.rifresh_expairsIn
  );


  return { approvalToken, refreshToken, findUserAndUpdate };
};

const logOut = async (authorizationToken: string) => {
  const decoded = authUtill.decodeAuthorizationToken(authorizationToken);
  const { id } = decoded as JwtPayload;

  const findUserById = await UserModel.findOneAndUpdate(
    { id: id },
    { isLoggedIn: false, loggedOutTime: new Date() },
    { new: true }
  );
  return findUserById;
};

const refreshToken = async (refreshToken: string) => {
  // const decoded = jwt.verify(
  //   refreshToken,
  //   config.jwtRefreshTokenSecret as string,
  // );

  const decoded= authUtill.decodeRefreshToken(refreshToken)

  if (!decoded) {
    throw Error('tocan decodaing Failed');
  }

  const { id, iat, role } = decoded as JwtPayload;

  const findUser = await UserModel.findOne({
    id: id,
    isDelited: false,
  });

  if (!findUser) {
    throw Error('Unauthorised User or forbitten Access');
  }

  // console.log(findUser)
  if (findUser.loggedOutTime && iat) {

    const logOutTimedAt = findUser.loggedOutTime
      ? new Date(findUser.loggedOutTime).getTime() / 1000
      : null;

    if (
      (logOutTimedAt && logOutTimedAt > iat)
    ) {
      throw Error('Unauthorized User: Try logging in again');
    }
  }

  const tokenizeData = {
    id: findUser.id,
    role: role,
  };
  const approvalToken = authUtill.createToken(
    tokenizeData,
    config.jwt_token_secret,
    config.token_expairsIn
  );

  return {
    approvalToken,
  };
};

const authSercvices = {
  logIn,
  logOut,
  refreshToken
};
export default authSercvices;
