import express from 'express'
import { authController } from './auth.controller.js'
import auth from '../../middleware/auth.js'
import { upload } from '../../utils/multer.js'

const router = express.Router()

router.post("/create-account",authController.createUser)
router.post("/verify-otp",authController.verifyOtp)
router.post("/confirm-signup",authController.confirmSignup)

//custom login 
router.post("/login",  authController.logInUser)
router.post("/send-otp",authController.resetRequest)
router.post("/reset-password",authController.resetPassword)
router.get("/all-player", authController.allUsers)

router.patch("/update-status/:id", auth("admin"), authController.updateStatus)
router.delete("/delete-player/:id", authController.deletePlayer)
router.post('/change-password', auth("player", "admin"),authController.changePassword)
router.put("/update-profile", upload.fields([
     { name: "images", maxCount: 6 }
]), (req, _res, next) => {
     if (req.body.data) {
          try {
               req.body = { ...JSON.parse(req.body.data) };
          } catch (err) {
               return next(new Error("Invalid JSON in 'data' field"));
          }
     }
     next();
},  authController.updateProfile)

router.get("/user", auth("player", "admin"), authController.singleUser)

router.patch("/change-email",auth("admin"),authController.changeEmail) 

router.post("/google-login", authController.googleLogin)
export const authRouter = router

