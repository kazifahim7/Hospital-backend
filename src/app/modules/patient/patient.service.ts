import QueryBuilder from '../../builder/QueryBuilder.js';
import AppError from '../../Error/AppError.js';
import type { IPatient } from './patient.interface.js';
import { PatientModel } from './patient.model.js';
import { DoctorModel } from '../doctor/doctor.model.js';

const createPatientIntoDB = async (payload: IPatient) => {
     // Verify doctor exists
     const doctor = await DoctorModel.findById(payload.doctor);
     if (!doctor) {
          throw new AppError(404, 'Assigned doctor not found');
     }

     const result = await PatientModel.create(payload);
     return result;
};

const getAllPatientsFromDB = async (query: Record<string, unknown>) => {
     const searchableFields = ['name', 'condition', 'phone', 'email', 'notes'];

     const patientQuery = new QueryBuilder(
          PatientModel.find().populate('doctor', 'name specialization hospital email phone avatarUrl'),
          query
     )
          .search(searchableFields)
          .filter()
          .sort()
          .paginate()
          .fields();

     const meta = await patientQuery.countTotal();
     const result = await patientQuery.modelQuery;

     return {
          meta,
          data: result,
     };
};

const getSinglePatientFromDB = async (id: string) => {
     const patient = await PatientModel.findById(id).populate(
          'doctor',
          'name specialization hospital email phone avatarUrl department'
     );
     if (!patient) {
          throw new AppError(404, 'Patient not found');
     }
     return patient;
};

const updatePatientInDB = async (id: string, payload: Partial<IPatient>) => {
     const patient = await PatientModel.findById(id);
     if (!patient) {
          throw new AppError(404, 'Patient not found');
     }

     if (payload.doctor) {
          const doctor = await DoctorModel.findById(payload.doctor);
          if (!doctor) {
               throw new AppError(404, 'Assigned doctor not found');
          }
     }

     const result = await PatientModel.findByIdAndUpdate(id, payload, {
          new: true,
          runValidators: true,
     }).populate('doctor', 'name specialization hospital email phone avatarUrl');

     return result;
};

const deletePatientFromDB = async (id: string) => {
     const patient = await PatientModel.findById(id);
     if (!patient) {
          throw new AppError(404, 'Patient not found');
     }

     const result = await PatientModel.findByIdAndDelete(id);
     return result;
};

export const PatientServices = {
     createPatientIntoDB,
     getAllPatientsFromDB,
     getSinglePatientFromDB,
     updatePatientInDB,
     deletePatientFromDB,
};
