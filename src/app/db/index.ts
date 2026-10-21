import mongoose from "mongoose";
import config from "../config/index.js";
import { userModel } from "../modules/auth/auth.model.js";
import { TAdmin } from "../Admin/index.js";
import bcrypt from "bcrypt";

let isConnected = false;

export async function connectDB() {
     if (isConnected || mongoose.connection.readyState === 1) {
          return;
     }

     if (!config.dataBase_url) {
          console.warn("⚠️ Warning: DATABASE_URL is not defined in environment variables!");
          return;
     }

     try {
          console.log("Connecting to MongoDB Atlas...");
          await mongoose.connect(config.dataBase_url as string, {
               serverSelectionTimeoutMS: 5000,
               connectTimeoutMS: 5000,
          });
          isConnected = true;
          console.log("✅ MongoDB Connected successfully!");

          // Seed default administrator if not existing
          try {
               const isExists = await userModel.findOne({ email: TAdmin.email });
               if (!isExists) {
                    const hashedPassword = await bcrypt.hash(TAdmin.password, Number(config.salt_round || 10));
                    TAdmin.password = hashedPassword;
                    await userModel.create(TAdmin);
                    console.log("🔑 Default admin seeded: admin@gmail.com / admin1234");
               }
          } catch (seedErr) {
               console.warn("Admin seed check notice:", seedErr);
          }
     } catch (error) {
          console.error("❌ MongoDB connection error:", error);
          throw error;
     }
}

export default connectDB;
