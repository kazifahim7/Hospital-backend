import type { Types } from "mongoose";

export type TCreateProfile = {
     firstName?: string,
     lastName?: string,
     email: string,
     password: string,
     role: "admin" | "player" 
     isBlocked: "active" | "inactive"|"block",
     imageUrl?: string,

     subscriptionStatus: "active" | "inactive",
     subscription_Type?: "free" | "monthly" | "yearly",
     subscription_start?: Date,
     subscription_end?: Date
}


export type OtpType ={
          id?: Types.ObjectId,
          role?: string,
          email: string,
          otp: number | string,
          otpExpiry: Date
     }