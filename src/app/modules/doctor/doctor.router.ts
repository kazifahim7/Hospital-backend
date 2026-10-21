import express from 'express';
import { DoctorControllers } from './doctor.controller.js';
import auth from '../../middleware/auth.js';
import validateRequest from '../../middleware/validatonRequest.js';
import { DoctorValidations } from './doctor.validation.js';

const router = express.Router();

router.post(
     '/',
     auth('admin'),
     validateRequest(DoctorValidations.createDoctorValidationSchema),
     DoctorControllers.createDoctor
);

router.get('/', auth('admin', 'player'), DoctorControllers.getAllDoctors);

router.get('/:id', auth('admin', 'player'), DoctorControllers.getSingleDoctor);

router.patch(
     '/:id',
     auth('admin'),
     validateRequest(DoctorValidations.updateDoctorValidationSchema),
     DoctorControllers.updateDoctor
);

router.delete('/:id', auth('admin'), DoctorControllers.deleteDoctor);

// Patients under doctor routes
router.get('/:id/patients', auth('admin', 'player'), DoctorControllers.getDoctorPatients);

router.post(
     '/:id/patients',
     auth('admin'),
     DoctorControllers.addPatientUnderDoctor
);

router.delete(
     '/:id/patients/:patientId',
     auth('admin'),
     DoctorControllers.deletePatientFromDoctor
);

export const doctorRouter = router;
