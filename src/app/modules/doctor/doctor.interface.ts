export type TDoctorStatus = 'active' | 'inactive' | 'on_leave';

export interface IDoctor {
     name: string;
     specialization: string;
     hospital: string;
     phone: string;
     email: string;
     avatarUrl?: string;
     department?: string;
     experienceYears?: number;
     status: TDoctorStatus;
     createdAt?: Date;
     updatedAt?: Date;
}
