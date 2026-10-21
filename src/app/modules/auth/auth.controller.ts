import { type Request, type Response } from "express";
import catchAsync from "../../utils/catcgAsync.js";
import { authService } from "./auth.services.js";
import { getLocalImageURL, uploadToS3 } from "../../utils/multer.js";


const createUser = catchAsync(async (req: Request, res: Response) => {
     const data = req.body;
     const result = await authService.createUserIntoDB(data)

     res.status(200).json({
          success: true,
          message: "check your email",
          data:result
     })
})
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
     const data = req.body;
     const result = await authService.verifyOtp(data)

     res.status(200).json({
          success: true,
          message: "Verification successfully",
          data:result
     })
})
const confirmSignup = catchAsync(async (req: Request, res: Response) => {
     const data = req.body;
     const result = await authService.confirmSignup(data)

     res.status(200).json({
          success: true,
          message: "Account created successfully",
          data:result
     })
})



const logInUser = catchAsync(async (req: Request, res: Response) => {
     const data = req.body;
     const result = await authService.loginUser(data)

     res.status(200).json({
          success: true,
          message: "User login successfully",
          data: result
     })


})

const resetRequest = catchAsync(async (req: Request, res: Response) => {
     const data = req.body;
     const result = await authService.resetRequest(data)

     res.status(200).json({
          success: true,
          message: "Check your Email",
          data: result
     })


})
const updateStatus = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id;
     const data = req.body
     const result = await authService.updateStatusInDB(id!, data)

     res.status(200).json({
          success: true,
          message: "User status update successfully successfully",
          data: result
     })


})
const deletePlayer = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id;
    
     const result = await authService.deletePlayerFromDB(id!)

     res.status(200).json({
          success: true,
          message: "deleted successfully successfully",
          data: result
     })


})
const updateProfile = catchAsync(async (req: Request, res: Response) => {
     const id = req.body?.email;
     const data = req.body

     const imageFiles = (req.files as any).images || [];
     for (const file of imageFiles) {
          const url = await uploadToS3(file);
          data.imageUrl = url
     }
     const result = await authService.updateProfileInDB(id!, data)

     res.status(200).json({
          success: true,
          message: "User Update successfully ",
          data: result
     })


})
const allUsers = catchAsync(async (req: Request, res: Response) => {

     const result = await authService.allStudentFromDB(req.query)

     res.status(200).json({
          success: true,
          message: "User is retrieved successfully ",
          data: result
     })


})
const singleUser = catchAsync(async (req: Request, res: Response) => {
     console.log(req?.user?.email!,"hello")

     const result = await authService.getSingleUser(req?.user?.email!)

     res.status(200).json({
          success: true,
          message: "User is retrieved successfully ",
          data: result
     })


})
const resetPassword = catchAsync(async (req: Request, res: Response) => {

     const result = await authService.resetPassword(req?.body)

     res.status(200).json({
          success: true,
          message: "Password successfully updated ",
          data: result
     })


})
const changePassword = catchAsync(async (req: Request, res: Response) => {
     const userId = req.user.id

     const result = await authService.changePassword(req?.body, userId)

     res.status(200).json({
          success: true,
          message: "Password successfully updated",
          data: result
     })


})


const changeEmail = catchAsync(async (req: Request, res: Response) => {

     const result = await authService.changeEmail(req.user.id,req?.body)

     res.status(200).json({
          success: true,
          message: "Email successfully updated ",
          data: result
     })


})


const googleLogin = catchAsync(async (req: Request, res: Response) => {
     const data = req.body;
     const result = await authService.googleLogin(data)

     res.status(200).json({
          success: true,
          message: "Google login successfully",
          data: result
     })


})






export const authController = {
     createUser,
     verifyOtp,
     confirmSignup,
     logInUser,
     updateStatus,
     updateProfile,
     allUsers,
     singleUser,
     resetRequest,
     resetPassword,
     changePassword,
     deletePlayer,
     changeEmail,
     googleLogin
}