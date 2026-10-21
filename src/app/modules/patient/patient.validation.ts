import { z } from 'zod';

const createPatientValidationSchema = z.object({
     body: z.object({
          name: z.string().min(2, 'Patient name is required'),
          age: z.number().nonnegative('Age must be a positive number'),
          gender: z.enum(['male', 'female', 'other'] as const),
          phone: z.string().min(5, 'Phone number is required'),
          email: z.string().email().optional().or(z.literal('')),
          address: z.string().optional(),
          doctor: z.string().min(1, 'Assigned doctor is required'),
          condition: z.string().min(2, 'Patient condition is required'),
          status: z.enum(['admitted', 'under_observation', 'stable', 'recovered', 'critical', 'discharged'] as const).optional(),
          admissionDate: z.string().optional(),
          dischargeDate: z.string().optional().nullable(),
          notes: z.string().optional(),
          bloodGroup: z.string().optional(),
          emergencyContact: z.string().optional(),
     }),
});

const updatePatientValidationSchema = z.object({
     body: z.object({
          name: z.string().min(2).optional(),
          age: z.number().nonnegative().optional(),
          gender: z.enum(['male', 'female', 'other'] as const).optional(),
          phone: z.string().min(5).optional(),
          email: z.string().email().optional().or(z.literal('')),
          address: z.string().optional(),
          doctor: z.string().optional(),
          condition: z.string().min(2).optional(),
          status: z.enum(['admitted', 'under_observation', 'stable', 'recovered', 'critical', 'discharged'] as const).optional(),
          admissionDate: z.string().optional(),
          dischargeDate: z.string().optional().nullable(),
          notes: z.string().optional(),
          bloodGroup: z.string().optional(),
          emergencyContact: z.string().optional(),
     }),
});

export const PatientValidations = {
     createPatientValidationSchema,
     updatePatientValidationSchema,
};
