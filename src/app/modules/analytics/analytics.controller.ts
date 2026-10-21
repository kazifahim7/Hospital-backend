import type { Request, Response } from 'express';
import catchAsync from '../../utils/catcgAsync.js';
import { AnalyticsServices } from './analytics.service.js';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
     const result = await AnalyticsServices.getDashboardStatsFromDB();
     res.status(200).json({
          success: true,
          message: 'Dashboard analytics retrieved successfully',
          data: result,
     });
});

const seedSampleData = catchAsync(async (req: Request, res: Response) => {
     const result = await AnalyticsServices.seedSampleDataIntoDB();
     res.status(200).json({
          success: true,
          message: 'Sample data operation completed',
          data: result,
     });
});

export const AnalyticsControllers = {
     getDashboardStats,
     seedSampleData,
};
