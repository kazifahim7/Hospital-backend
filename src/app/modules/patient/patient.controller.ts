import type { Request, Response } from 'express';
import catchAsync from '../../utils/catcgAsync.js';
import { PatientServices } from './patient.service.js';

const createPatient = catchAsync(async (req: Request, res: Response) => {
     const result = await PatientServices.createPatientIntoDB(req.body);
     res.status(201).json({
          success: true,
          message: 'Patient registered successfully',
          data: result,
     });
});

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
     const result = await PatientServices.getAllPatientsFromDB(req.query);
     res.status(200).json({
          success: true,
          message: 'Patients retrieved successfully',
          meta: result.meta,
          data: result.data,
     });
});

const getSinglePatient = catchAsync(async (req: Request, res: Response) => {
     const id = String(req.params.id);
     const result = await PatientServices.getSinglePatientFromDB(id);
     res.status(200).json({
          success: true,
          message: 'Patient retrieved successfully',
          data: result,
     });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
     const id = String(req.params.id);
     const result = await PatientServices.updatePatientInDB(id, req.body);
     res.status(200).json({
          success: true,
          message: 'Patient updated successfully',
          data: result,
     });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
     const id = String(req.params.id);
     const result = await PatientServices.deletePatientFromDB(id);
     res.status(200).json({
          success: true,
          message: 'Patient deleted successfully',
          data: result,
     });
});

export const PatientControllers = {
     createPatient,
     getAllPatients,
     getSinglePatient,
     updatePatient,
     deletePatient,
};
