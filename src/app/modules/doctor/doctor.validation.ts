import { z } from 'zod';

const createDoctorValidationSchema = z.object({
     body: z.object({
          name: z.string().min(2, 'Doctor name is required'),
          specialization: z.string().min(2, 'Specialization is required'),
          hospital: z.string().min(2, 'Hospital is required'),
          phone: z.string().min(5, 'Phone number is required'),
          email: z.string().email('Invalid email address'),
          avatarUrl: z.string().optional(),
          department: z.string().optional(),
          experienceYears: z.number().nonnegative().optional(),
          status: z.enum(['active', 'inactive', 'on_leave'] as const).optional(),
     }),
});

const updateDoctorValidationSchema = z.object({
     body: z.object({
          name: z.string().min(2).optional(),
          specialization: z.string().min(2).optional(),
          hospital: z.string().min(2).optional(),
          phone: z.string().min(5).optional(),
          email: z.string().email().optional(),
          avatarUrl: z.string().optional(),
          department: z.string().optional(),
          experienceYears: z.number().nonnegative().optional(),
          status: z.enum(['active', 'inactive', 'on_leave'] as const).optional(),
     }),
});

export const DoctorValidations = {
     createDoctorValidationSchema,
     updateDoctorValidationSchema,
};
