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
     if (isConnected || mongoose.connection.readyState === 1) {
          return;
     }

     if (!config.dataBase_url) {
          console.warn("⚠️ Warning: DATABASE_URL environment variable is not defined in Vercel settings.");
          return;
     }

     try {
          await connect(config.dataBase_url as string, {
               serverSelectionTimeoutMS: 5000, // Fail fast in 5s if Atlas is blocking IP
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
               console.warn("Notice: Admin check skipped during cold boot:", seedErr);
          }
     } catch (error) {
          console.error("❌ MongoDB connection error:", error);
     }
}

// Middleware to ensure database connection is ready for API routes
app.use(async (req, res, next) => {
     // Allow root health check to respond immediately without waiting for DB
     if (req.path === '/') {
          return next();
     }

     try {
          await connectDB();
     } catch (err) {
          console.error("DB connection error in middleware:", err);
     }
     next();
});

// Run local HTTP server ONLY in local development (Never bind port in Vercel serverless environment)
if (!process.env.VERCEL) {
     connectDB().then(() => {
          server = app.listen(config.port || 5000, () => {
               console.log(`🚀 App is listening on port ${config.port || 5000}`);
          });
     });

     process.on('unhandledRejection', (err) => {
          console.log(`UnhandledRejection detected, shutting down...`, err);
          if (server) {
               server.close(() => process.exit(1));
          } else {
               process.exit(1);
          }
     });

     process.on('uncaughtException', () => {
          console.log(`UncaughtException detected, shutting down...`);
          process.exit(1);
     });
}

export default app;