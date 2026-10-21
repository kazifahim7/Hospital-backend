import QueryBuilder from '../../builder/QueryBuilder.js';
import AppError from '../../Error/AppError.js';
import type { IDoctor } from './doctor.interface.js';
import { DoctorModel } from './doctor.model.js';
import { PatientModel } from '../patient/patient.model.js';
import type { IPatient } from '../patient/patient.interface.js';

const createDoctorIntoDB = async (payload: IDoctor) => {
     const isExist = await DoctorModel.findOne({ email: payload.email });
     if (isExist) {
          throw new AppError(400, 'Doctor with this email already exists');
     }
     const result = await DoctorModel.create(payload);
     return result;
};

const getAllDoctorsFromDB = async (query: Record<string, unknown>) => {
     const searchableFields = ['name', 'specialization', 'hospital', 'phone', 'email', 'department'];

     const doctorQuery = new QueryBuilder(DoctorModel.find(), query)
          .search(searchableFields)
          .filter()
          .sort()
          .paginate()
          .fields();

     const meta = await doctorQuery.countTotal();
     const result = await doctorQuery.modelQuery.lean();

     // Efficiently attach patient count for each doctor
     const doctorIds = result.map((doc) => doc._id);
     const patientCounts = await PatientModel.aggregate([
          { $match: { doctor: { $in: doctorIds } } },
          { $group: { _id: '$doctor', count: { $sum: 1 } } },
     ]);

     const countMap = new Map<string, number>();
     patientCounts.forEach((item) => {
          countMap.set(String(item._id), item.count);
     });

     const doctorsWithCounts = result.map((doc) => ({
          ...doc,
          patientCount: countMap.get(String(doc._id)) || 0,
     }));

     return {
          meta,
          data: doctorsWithCounts,
     };
};

const getSingleDoctorFromDB = async (id: string) => {
     const doctor = await DoctorModel.findById(id).lean();
     if (!doctor) {
          throw new AppError(404, 'Doctor not found');
     }

     const patients = await PatientModel.find({ doctor: id }).sort({ createdAt: -1 });

     return {
          ...doctor,
          patientCount: patients.length,
          patients,
     };
};

const updateDoctorInDB = async (id: string, payload: Partial<IDoctor>) => {
     const doctor = await DoctorModel.findById(id);
     if (!doctor) {
          throw new AppError(404, 'Doctor not found');
     }

     if (payload.email && payload.email !== doctor.email) {
          const emailExists = await DoctorModel.findOne({ email: payload.email });
          if (emailExists) {
               throw new AppError(400, 'Doctor with this email already exists');
          }
     }

     const result = await DoctorModel.findByIdAndUpdate(id, payload, {
          new: true,
          runValidators: true,
     });
     return result;
};

const deleteDoctorFromDB = async (id: string) => {
     const doctor = await DoctorModel.findById(id);
     if (!doctor) {
          throw new AppError(404, 'Doctor not found');
     }

     // Delete doctor and delete associated patients or unassign them
     await PatientModel.deleteMany({ doctor: id });
     const result = await DoctorModel.findByIdAndDelete(id);
     return result;
};

const getDoctorPatientsFromDB = async (doctorId: string, query: Record<string, unknown>) => {
     const doctor = await DoctorModel.findById(doctorId);
     if (!doctor) {
          throw new AppError(404, 'Doctor not found');
     }

     const patientQuery = new QueryBuilder(
          PatientModel.find({ doctor: doctorId }),
          query
     )
          .search(['name', 'condition', 'phone', 'email'])
          .filter()
          .sort()
          .paginate()
          .fields();

     const meta = await patientQuery.countTotal();
     const result = await patientQuery.modelQuery;

     return {
          doctor,
          meta,
          data: result,
     };
};

const addPatientUnderDoctorInDB = async (doctorId: string, payload: Omit<IPatient, 'doctor'>) => {
     const doctor = await DoctorModel.findById(doctorId);
     if (!doctor) {
          throw new AppError(404, 'Doctor not found');
     }

     const newPatient = await PatientModel.create({
          ...payload,
          doctor: doctorId,
     });

     return newPatient;
};

const deletePatientFromDoctorInDB = async (doctorId: string, patientId: string) => {
     const patient = await PatientModel.findOne({ _id: patientId, doctor: doctorId });
     if (!patient) {
          throw new AppError(404, 'Patient not found under this doctor');
     }

     await PatientModel.findByIdAndDelete(patientId);
     return { message: 'Patient removed from doctor successfully' };
};

export const DoctorServices = {
     createDoctorIntoDB,
     getAllDoctorsFromDB,
     getSingleDoctorFromDB,
     updateDoctorInDB,
     deleteDoctorFromDB,
     getDoctorPatientsFromDB,
     addPatientUnderDoctorInDB,
     deletePatientFromDoctorInDB,
};
