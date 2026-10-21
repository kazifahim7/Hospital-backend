import { model, Schema } from "mongoose";
import type { OtpType } from "./auth.interface.js";


const otpSchema = new Schema<OtpType>(
     {
          role: { type: String },
          email: { type: String, required: true },
          otp: { type: Number, required: true },
          otpExpiry: { type: Date, required: true, index: { expires: 0 } },
     },
     { timestamps: true }
);

// Model
const OtpModel = model<OtpType>("Otp", otpSchema);

export default OtpModel;