import type { Request, Response } from 'express';
import catchAsync from '../../utils/catcgAsync.js';
import { DoctorServices } from './doctor.service.js';

const createDoctor = catchAsync(async (req: Request, res: Response) => {
     const result = await DoctorServices.createDoctorIntoDB(req.body);
     res.status(201).json({
          success: true,
          message: 'Doctor created successfully',
          data: result,
     });
});

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
     const result = await DoctorServices.getAllDoctorsFromDB(req.query);
     res.status(200).json({
          success: true,
          message: 'Doctors retrieved successfully',
          meta: result.meta,
          data: result.data,
     });
});

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
     const id = String(req.params.id);
     const result = await DoctorServices.getSingleDoctorFromDB(id);
     res.status(200).json({
          success: true,
          message: 'Doctor retrieved successfully',
          data: result,
     });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
     const id = String(req.params.id);
     const result = await DoctorServices.updateDoctorInDB(id, req.body);
     res.status(200).json({
          success: true,
          message: 'Doctor updated successfully',
          data: result,
     });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
     const id = String(req.params.id);
     const result = await DoctorServices.deleteDoctorFromDB(id);
     res.status(200).json({
          success: true,
          message: 'Doctor deleted successfully',
          data: result,
     });
});

const getDoctorPatients = catchAsync(async (req: Request, res: Response) => {
     const id = String(req.params.id);
     const result = await DoctorServices.getDoctorPatientsFromDB(id, req.query);
     res.status(200).json({
          success: true,
          message: 'Doctor patients retrieved successfully',
          doctor: result.doctor,
          meta: result.meta,
          data: result.data,
     });
});

const addPatientUnderDoctor = catchAsync(async (req: Request, res: Response) => {
     const id = String(req.params.id);
     const result = await DoctorServices.addPatientUnderDoctorInDB(id, req.body);
     res.status(201).json({
          success: true,
          message: 'Patient added under doctor successfully',
          data: result,
     });
});

const deletePatientFromDoctor = catchAsync(async (req: Request, res: Response) => {
     const id = String(req.params.id);
     const patientId = String(req.params.patientId);
     const result = await DoctorServices.deletePatientFromDoctorInDB(id, patientId);
     res.status(200).json({
          success: true,
          message: 'Patient removed from doctor successfully',
          data: result,
     });
});

export const DoctorControllers = {
     createDoctor,
     getAllDoctors,
     getSingleDoctor,
     updateDoctor,
     deleteDoctor,
     getDoctorPatients,
     addPatientUnderDoctor,
     deletePatientFromDoctor,
};
