import mongoose, { connect } from "mongoose";
import { Server } from "http";
import config from "./app/config/index.js";
import app from "./app.js";
import { userModel } from "./app/modules/auth/auth.model.js";
import { TAdmin } from "./app/Admin/index.js";
import bcrypt from "bcrypt";

let server: Server;
let isConnected = false;

export async function connectDB() {
     if (isConnected || mongoose.connection.readyState >= 1) {
          return;
     }
     try {
          await connect(config.dataBase_url as string);
          isConnected = true;
          console.log("✅ MongoDB Connected successfully!");

          // Seed default administrator if not existing
          const isExists = await userModel.findOne({ email: TAdmin.email });
          if (!isExists) {
               const hashedPassword = await bcrypt.hash(TAdmin.password, Number(config.salt_round));
               TAdmin.password = hashedPassword;
               await userModel.create(TAdmin);
               console.log("🔑 Default admin seeded: admin@gmail.com / admin1234");
          }
     } catch (error) {
          console.error("❌ MongoDB connection error:", error);
     }
}

// Middleware to ensure database connection is alive on each serverless invocation
app.use(async (req, res, next) => {
     await connectDB();
     next();
});

// Run HTTP listener for local development when not running as a Vercel serverless function
if (!process.env.VERCEL) {
     connectDB().then(() => {
          server = app.listen(config.port, () => {
               console.log(`🚀 App is listening on port ${config.port}`);
          });
     });
}

process.on('unhandledRejection', (err) => {
     console.log(`UnhandledRejection detected, shutting down...`, err);
     if (server) {
          server.close(() => {
               process.exit(1);
          });
     } else {
          process.exit(1);
     }
});

process.on('uncaughtException', () => {
     console.log(`UncaughtException detected, shutting down...`);
     process.exit(1);
});

export default app;