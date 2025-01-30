export type TUser = {
  id: string;
  email: string;
  password: string;
  userType: "candidate" | "examinee" | "admin";
  firstName: string;
  lastName: string;
  img: string;
  isLoggedIn: boolean;
  isDeleted: boolean;
  loggedOutTime: string;
};

export type TUserUpdateData = {
  email: string;
  password: string;
  userType: "candidate" | "examinee" | "admin";
  firstName: string;
  lastName: string;
  img: string;
};
