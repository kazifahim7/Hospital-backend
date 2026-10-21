import { Types } from 'mongoose';

export type TPatientGender = 'male' | 'female' | 'other';
export type TPatientStatus = 'admitted' | 'under_observation' | 'stable' | 'recovered' | 'critical' | 'discharged';

export interface IPatient {
     name: string;
     age: number;
     gender: TPatientGender;
     phone: string;
     email?: string;
     address?: string;
     doctor: Types.ObjectId | string;
     condition: string;
     status: TPatientStatus;
     admissionDate: Date;
     dischargeDate?: Date | null;
     notes?: string;
     bloodGroup?: string;
     emergencyContact?: string;
     createdAt?: Date;
     updatedAt?: Date;
}
