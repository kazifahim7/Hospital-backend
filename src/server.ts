import { Server } from "http";
import config from "./app/config/index.js";
import app from "./app.js";
import connectDB from "./app/db/index.js";

let server: Server;

// Initiate cold-start connection in the background
connectDB().catch((err) => {
     console.error("Cold-start MongoDB connection notice:", err.message);
});

// Run local HTTP server ONLY in local development (Never bind port in Vercel serverless environment)
if (!process.env.VERCEL) {
     const port = config.port || 5000;
     server = app.listen(port, () => {
          console.log(`🚀 App is listening on port ${port}`);
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