import config from "../../config";
import catchAsync from "../../util/catchAsync";
import golbalRespnseHandler from "../../util/globalResponseHandeler";
import authSercvices from "./auth.services";

const logIn = catchAsync(async (req, res) => {
    const { email, password } = req.body
    const result = await authSercvices.logIn(email, password)
    const { approvalToken, refreshToken } = result

    res.cookie("refreshToken", refreshToken, {
        secure: config.nodeEnv === "production",
        httpOnly: true,
        sameSite: "strict", // Extra CSRF protection
      });

    golbalRespnseHandler(res, {
        statusCode: 200,
    success: true,
    message: "Login Successful",
    data: {
        approvalToken,
        refreshToken,
    }
    })
})

const logOut = catchAsync(async (req, res) => {
    const authorizationToken = req?.headers?.authorization
    console.log(authorizationToken)


    if (!authorizationToken) {
        throw Error("token is missing")
    }
    
    const result = await authSercvices.logOut(authorizationToken)
    golbalRespnseHandler(res, {
    statusCode: 200,
    success: true,
    message: "Logout Successful",
    data: null
    })
})

const refreshToken=catchAsync(async(req,res)=>{
    console.log("cookies",req.cookies)


    const {refreshToken}= req.cookies
    if(!refreshToken){
        throw Error("Token is missing")
    }
        console.log(refreshToken)
    const result = await authSercvices.refreshToken(refreshToken);

    golbalRespnseHandler(res, {
        statusCode: 200,
        success: true,
        message: "Token Refreshed",
        data: result
    })

  })

const authController = {
    logIn, logOut, refreshToken
}
export default authController