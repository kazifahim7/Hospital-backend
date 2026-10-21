import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import notFound from './app/middleware/notFound.js';
import globalErrorHandler from './app/middleware/globalErrorHandler.js';
import router from './app/router/index.js';
import path from "path";
import fs from "fs";

const app: Application = express();

import os from "os";

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

// API routes
app.use("/api/v1", router);

// Root health check route
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

// Error handling
app.use(notFound);
app.use(globalErrorHandler);

export default app;
