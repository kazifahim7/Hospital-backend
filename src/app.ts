import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import notFound from './app/middleware/notFound.js';
import globalErrorHandler from './app/middleware/globalErrorHandler.js';
import router from './app/router/index.js';
import connectDB from './app/db/index.js';
import path from "path";
import fs from "fs";
import os from "os";

const app: Application = express();

// Safe creation of uploads folder (safeguarded for read-only serverless environments like Vercel)
try {
     const uploadsPath = process.env.VERCEL
          ? path.join(os.tmpdir(), "uploads")
          : path.join(process.cwd(), "uploads");

     if (!fs.existsSync(uploadsPath)) {
          fs.mkdirSync(uploadsPath, { recursive: true });
          console.log("📁 'uploads' folder created successfully!");
     }
     app.use("/uploads", express.static(uploadsPath));
} catch (e) {
     console.log("⚠️ Serverless environment detected: uploads directory handled safely.");
}

// Parser
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors({
     origin: '*',
     credentials: true
}));

// Root health check route (responds instantly without waiting for database)
app.get('/', (req: Request, res: Response) => {
     res.json({
          status: 'success',
          service: 'Doctor Tracker Clinical Backend API',
          version: '1.0.0',
          databaseConfigured: Boolean(process.env.DATABASE_URL),
          endpoints: {
               auth: '/api/v1/auth/login',
               doctors: '/api/v1/doctor',
               patients: '/api/v1/patient',
               analytics: '/api/v1/analytics/dashboard',
               seed: '/api/v1/analytics/seed'
          },
          timestamp: new Date().toISOString()
     });
});

// Database connection middleware - GUARANTEES DB is connected BEFORE any /api/v1 route runs!
app.use(async (req, res, next) => {
     try {
          await connectDB();
          next();
     } catch (err: any) {
          console.error("❌ Database connection error on request:", err.message);
          return res.status(503).json({
               success: false,
               message: "Database connection unavailable. Please verify DATABASE_URL and MongoDB Atlas Network Access (0.0.0.0/0).",
               error: err.message
          });
     }
});

// API routes (Mounted AFTER database connection middleware)
app.use("/api/v1", router);

// Error handling
app.use(notFound);
app.use(globalErrorHandler);

export default app;
