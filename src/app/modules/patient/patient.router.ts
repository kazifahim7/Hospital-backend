import express from 'express';
import { PatientControllers } from './patient.controller.js';
import auth from '../../middleware/auth.js';
import validateRequest from '../../middleware/validatonRequest.js';
import { PatientValidations } from './patient.validation.js';

const router = express.Router();

router.post(
     '/',
     auth('admin'),
     validateRequest(PatientValidations.createPatientValidationSchema),
     PatientControllers.createPatient
);

router.get('/', auth('admin', 'player'), PatientControllers.getAllPatients);

router.get('/:id', auth('admin', 'player'), PatientControllers.getSinglePatient);

router.patch(
     '/:id',
     auth('admin'),
     validateRequest(PatientValidations.updatePatientValidationSchema),
     PatientControllers.updatePatient
);

router.delete('/:id', auth('admin'), PatientControllers.deletePatient);

export const patientRouter = router;
