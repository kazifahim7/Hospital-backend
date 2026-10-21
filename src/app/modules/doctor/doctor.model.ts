import { model, Schema } from 'mongoose';
import type { IDoctor } from './doctor.interface.js';

const DoctorSchema = new Schema<IDoctor>(
     {
          name: {
               type: String,
               required: [true, 'Doctor name is required'],
               trim: true,
          },
          specialization: {
               type: String,
               required: [true, 'Specialization is required'],
               trim: true,
          },
          hospital: {
               type: String,
               required: [true, 'Hospital name is required'],
               trim: true,
          },
          phone: {
               type: String,
               required: [true, 'Phone number is required'],
               trim: true,
          },
          email: {
               type: String,
               required: [true, 'Email is required'],
               unique: true,
               trim: true,
               lowercase: true,
          },
          avatarUrl: {
               type: String,
               default: '',
          },
          department: {
               type: String,
               default: 'General',
          },
          experienceYears: {
               type: Number,
               default: 1,
          },
          status: {
               type: String,
               enum: ['active', 'inactive', 'on_leave'],
               default: 'active',
          },
     },
     {
          timestamps: true,
     }
);

// Indexes for query optimization and performance
DoctorSchema.index({ name: 'text', specialization: 'text', hospital: 'text', email: 'text' });
DoctorSchema.index({ createdAt: -1 });
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ hospital: 1 });
DoctorSchema.index({ status: 1 });

export const DoctorModel = model<IDoctor>('Doctor', DoctorSchema);
