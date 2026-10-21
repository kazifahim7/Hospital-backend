import { model, Schema } from 'mongoose';
import type { IPatient } from './patient.interface.js';

const PatientSchema = new Schema<IPatient>(
     {
          name: {
               type: String,
               required: [true, 'Patient name is required'],
               trim: true,
          },
          age: {
               type: Number,
               required: [true, 'Patient age is required'],
               min: [0, 'Age cannot be negative'],
          },
          gender: {
               type: String,
               enum: ['male', 'female', 'other'],
               required: [true, 'Gender is required'],
          },
          phone: {
               type: String,
               required: [true, 'Phone number is required'],
               trim: true,
          },
          email: {
               type: String,
               trim: true,
               lowercase: true,
               default: '',
          },
          address: {
               type: String,
               default: '',
          },
          doctor: {
               type: Schema.Types.ObjectId,
               ref: 'Doctor',
               required: [true, 'Doctor assignment is required'],
               index: true,
          },
          condition: {
               type: String,
               required: [true, 'Patient condition/diagnosis is required'],
               trim: true,
          },
          status: {
               type: String,
               enum: ['admitted', 'under_observation', 'stable', 'recovered', 'critical', 'discharged'],
               default: 'admitted',
               index: true,
          },
          admissionDate: {
               type: Date,
               default: Date.now,
               index: true,
          },
          dischargeDate: {
               type: Date,
               default: null,
          },
          notes: {
               type: String,
               default: '',
          },
          bloodGroup: {
               type: String,
               default: '',
          },
          emergencyContact: {
               type: String,
               default: '',
          },
     },
     {
          timestamps: true,
     }
);

// Indexes for query performance and fast searches
PatientSchema.index({ name: 'text', condition: 'text', phone: 'text' });
PatientSchema.index({ createdAt: -1 });
PatientSchema.index({ doctor: 1, createdAt: -1 });
PatientSchema.index({ status: 1, condition: 1 });

export const PatientModel = model<IPatient>('Patient', PatientSchema);
