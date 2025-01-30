import catchAsync from "../../util/catchAsync";
import golbalRespnseHandler from "../../util/globalResponseHandeler";
import userServices from "./user.service";

const createUser = catchAsync(async (req, res) => {
  // const file = req.file;
  const payload = req.body;
  const result = await userServices.createUser(payload);
  golbalRespnseHandler(res, {
    message: `${req.body.userType} created successfully`,
    success: true,
    statusCode: 200,
    data: req.body.userType === "examinee" ? result : null,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const uid = req.user.id;
  const result = await userServices.updateUser(uid, req.body);
  res.status(200).json({
    message: "User updated successfully",
    success: true,
    status: 200,
    body: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await userServices.getSingleUser(req.params.id);
  res.status(200).json({
    message: "User data retrieved successfully",
    success: true,
    status: 200,
    body: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await userServices.getAllUser(
    req.query.firstName as string,
    req.query.lastName as string
  );
  res.status(200).json({
    message: "All users data retrieved successfully",
    success: true,
    status: 200,
    body: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await userServices.deleteUser(req.params.id);
  res.status(200).json({
    message: "User deleted successfully",
    success: true,
    status: 200,
    body: result,
  });
});

const userController = {
  createUser,
  updateUser,
  getSingleUser,
  getAllUser,
  deleteUser,
};
export default userController;
