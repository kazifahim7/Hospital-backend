import express from 'express';
import { authRouter } from '../modules/auth/auth.router.js';
import { doctorRouter } from '../modules/doctor/doctor.router.js';
import { patientRouter } from '../modules/patient/patient.router.js';
import { analyticsRouter } from '../modules/analytics/analytics.router.js';

const router = express.Router();

const moduleRouter = [
     {
          path: '/auth',
          route: authRouter,
     },
     {
          path: '/doctors',
          route: doctorRouter,
     },
     {
          path: '/patients',
          route: patientRouter,
     },
     {
          path: '/analytics',
          route: analyticsRouter,
     },
];


moduleRouter.forEach((route) => router.use(route.path, route.route))


export default router