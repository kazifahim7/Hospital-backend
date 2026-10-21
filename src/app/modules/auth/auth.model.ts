import { model, Schema } from "mongoose";
import type { TCreateProfile } from "./auth.interface.js";

const ProfileSchema: Schema = new Schema<TCreateProfile>({
     firstName: { type: String},
     lastName: { type: String},
     email: { type: String, required: true, unique: true },
     password: { type: String },
     role: { type: String, enum: ['admin', 'player'] , default:"player" },
     isBlocked: { type: String, enum: ['active', 'inactive','block'], default: 'active' },
     imageUrl: { type: String },
     subscriptionStatus: {
          type: String,
          enum: ['active', 'inactive'],
          default: 'inactive'
     },

     subscription_Type: {
          type: String,
          enum: ['free', 'monthly', 'yearly'],
          default: 'free'
     },

     subscription_start: {
          type: Date,
          default:null
     },

     subscription_end: {
          type: Date,
          default: null
     }
}, {
     timestamps: true,
});

export const userModel = model<TCreateProfile>('Players', ProfileSchema);