import express from 'express';
import { AnalyticsControllers } from './analytics.controller.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', auth('admin', 'player'), AnalyticsControllers.getDashboardStats);
router.post('/seed', auth('admin'), AnalyticsControllers.seedSampleData);

export const analyticsRouter = router;
