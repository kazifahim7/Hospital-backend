import { DoctorModel } from '../doctor/doctor.model.js';
import { PatientModel } from '../patient/patient.model.js';

const getDashboardStatsFromDB = async () => {
     // Run parallel optimized queries using MongoDB aggregation
     const [
          totalDoctors,
          totalPatients,
          statusCounts,
          specializationCounts,
          patientsPerDoctorData,
          admissionsTrend,
          recentPatients,
          recentDoctors,
     ] = await Promise.all([
          DoctorModel.countDocuments(),
          PatientModel.countDocuments(),
          
          // Patient status distribution
          PatientModel.aggregate([
               {
                    $group: {
                         _id: '$status',
                         count: { $sum: 1 },
                    },
               },
          ]),

          // Specialization breakdown
          DoctorModel.aggregate([
               {
                    $group: {
                         _id: '$specialization',
                         count: { $sum: 1 },
                    },
               },
               { $sort: { count: -1 } },
          ]),

          // Patients per doctor aggregation
          PatientModel.aggregate([
               {
                    $group: {
                         _id: '$doctor',
                         patientCount: { $sum: 1 },
                    },
               },
               {
                    $lookup: {
                         from: 'doctors',
                         localField: '_id',
                         foreignField: '_id',
                         as: 'doctorDetails',
                    },
               },
               { $unwind: { path: '$doctorDetails', preserveNullAndEmptyArrays: true } },
               {
                    $project: {
                         doctorId: '$_id',
                         name: { $ifNull: ['$doctorDetails.name', 'Unassigned'] },
                         specialization: { $ifNull: ['$doctorDetails.specialization', 'N/A'] },
                         hospital: { $ifNull: ['$doctorDetails.hospital', 'N/A'] },
                         avatarUrl: '$doctorDetails.avatarUrl',
                         patientCount: 1,
                    },
               },
               { $sort: { patientCount: -1 } },
               { $limit: 8 },
          ]),

          // Date-based statistics (admissions trend by month)
          PatientModel.aggregate([
               {
                    $group: {
                         _id: {
                              $dateToString: {
                                   format: '%Y-%m',
                                   date: { $ifNull: ['$admissionDate', '$createdAt'] },
                              },
                         },
                         admissions: { $sum: 1 },
                    },
               },
               { $sort: { _id: 1 } },
               { $limit: 12 },
          ]),

          // Recent 5 patients
          PatientModel.find()
               .populate('doctor', 'name specialization')
               .sort({ createdAt: -1 })
               .limit(5)
               .lean(),

          // Recent 5 doctors
          DoctorModel.find()
               .sort({ createdAt: -1 })
               .limit(5)
               .lean(),
     ]);

     const avgPatientsPerDoctor =
          totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0;

     // Formatted status map
     const statusMap: Record<string, number> = {
          admitted: 0,
          under_observation: 0,
          stable: 0,
          recovered: 0,
          critical: 0,
          discharged: 0,
     };
     statusCounts.forEach((item) => {
          if (item._id) {
               statusMap[item._id] = item.count;
          }
     });

     return {
          overview: {
               totalDoctors,
               totalPatients,
               avgPatientsPerDoctor,
               admittedPatients: statusMap.admitted || 0,
               criticalPatients: statusMap.critical || 0,
               dischargedPatients: statusMap.discharged || 0,
               recoveredPatients: statusMap.recovered || 0,
               stablePatients: statusMap.stable || 0,
               underObservationPatients: statusMap.under_observation || 0,
          },
          statusDistribution: statusCounts.map((s) => ({
               status: s._id || 'unspecified',
               count: s.count,
          })),
          specializationDistribution: specializationCounts.map((s) => ({
               specialization: s._id,
               count: s.count,
          })),
          doctorWorkload: patientsPerDoctorData,
          admissionsTrend: admissionsTrend.map((t) => ({
               date: t._id,
               admissions: t.admissions,
          })),
          recentPatients,
          recentDoctors,
     };
};

const seedSampleDataIntoDB = async () => {
     // Check if doctors already exist
     const existingCount = await DoctorModel.countDocuments();
     if (existingCount > 0) {
          return { message: 'Database already has data. Seed skipped.' };
     }

     const sampleDoctors = [
          {
               name: 'Dr. Sarah Mitchell',
               specialization: 'Cardiology',
               hospital: 'Apex Memorial Heart Center',
               phone: '+1 415-555-0101',
               email: 'sarah.mitchell@apexhealth.org',
               avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
               department: 'Cardiology & Intensive Care',
               experienceYears: 14,
               status: 'active',
          },
          {
               name: 'Dr. Alexander Vance',
               specialization: 'Neurology',
               hospital: 'St. Jude Neurological Institute',
               phone: '+1 415-555-0102',
               email: 'alex.vance@stjude.org',
               avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
               department: 'Neurosurgery & Brain Health',
               experienceYears: 18,
               status: 'active',
          },
          {
               name: 'Dr. Elena Rostova',
               specialization: 'Pediatrics',
               hospital: 'Childrens Hope Medical Hospital',
               phone: '+1 415-555-0103',
               email: 'elena.rostova@childrenshope.org',
               avatarUrl: 'https://images.unsplash.com/photo-1594824813583-02424fa75fb4?w=150&auto=format&fit=crop&q=80',
               department: 'Pediatric Care',
               experienceYears: 9,
               status: 'active',
          },
          {
               name: 'Dr. Marcus Thorne',
               specialization: 'Orthopedics',
               hospital: 'Metro Orthopedic & Spine Center',
               phone: '+1 415-555-0104',
               email: 'marcus.thorne@metroortho.org',
               avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
               department: 'Orthopedic Surgery',
               experienceYears: 12,
               status: 'active',
          },
          {
               name: 'Dr. Priya Sharma',
               specialization: 'Oncology',
               hospital: 'Global Cancer & Research Hospital',
               phone: '+1 415-555-0105',
               email: 'priya.sharma@cancercare.org',
               avatarUrl: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=150&auto=format&fit=crop&q=80',
               department: 'Medical Oncology',
               experienceYears: 11,
               status: 'active',
          },
          {
               name: 'Dr. David Kim',
               specialization: 'Dermatology',
               hospital: 'Pacific Skin & Laser Clinic',
               phone: '+1 415-555-0106',
               email: 'david.kim@pacificskin.com',
               avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
               department: 'Clinical Dermatology',
               experienceYears: 7,
               status: 'active',
          },
     ];

     const createdDoctors = await DoctorModel.insertMany(sampleDoctors);

     const conditions = [
          'Acute Myocardial Infarction',
          'Chronic Hypertension',
          'Severe Migraine & Neuropathy',
          'Pediatric Asthma Flare-up',
          'Lumbar Spine Herniation',
          'Post-Operative ACL Tear',
          'Stage II Lymphoma Care',
          'Severe Contact Dermatitis',
          'Type 2 Diabetes Mellitus',
          'Atrial Fibrillation Management',
     ];

     const statuses: ('admitted' | 'under_observation' | 'stable' | 'recovered' | 'critical' | 'discharged')[] = [
          'admitted',
          'under_observation',
          'stable',
          'recovered',
          'critical',
          'discharged',
     ];

     const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+'];

     const patientNames = [
          { name: 'Robert Chen', gender: 'male' as const, age: 52 },
          { name: 'Emily Watson', gender: 'female' as const, age: 29 },
          { name: 'Carlos Mendez', gender: 'male' as const, age: 67 },
          { name: 'Sophia Miller', gender: 'female' as const, age: 8 },
          { name: 'Liam Johnson', gender: 'male' as const, age: 34 },
          { name: 'Grace Hopper', gender: 'female' as const, age: 45 },
          { name: 'Lucas Scott', gender: 'male' as const, age: 19 },
          { name: 'Olivia Brown', gender: 'female' as const, age: 38 },
          { name: 'Ethan Wright', gender: 'male' as const, age: 61 },
          { name: 'Mia Taylor', gender: 'female' as const, age: 24 },
          { name: 'Noah Davis', gender: 'male' as const, age: 41 },
          { name: 'Ava Anderson', gender: 'female' as const, age: 55 },
     ];

     const samplePatients = patientNames.map((p, idx) => {
          const doc = createdDoctors[idx % createdDoctors.length]!;
          // Stagger admission dates over past months
          const pastDays = (idx * 5) % 90;
          const admissionDate = new Date();
          admissionDate.setDate(admissionDate.getDate() - pastDays);

          return {
               name: p.name,
               age: p.age,
               gender: p.gender,
               phone: `+1 555-01${10 + idx}`,
               email: `${p.name.toLowerCase().replace(' ', '.')}@email.com`,
               address: `${100 + idx * 12} Healthcare Way, Suite ${idx + 1}`,
               doctor: doc._id,
               condition: conditions[idx % conditions.length],
               status: statuses[idx % statuses.length],
               admissionDate,
               dischargeDate: idx % 4 === 0 ? new Date() : null,
               bloodGroup: bloodGroups[idx % bloodGroups.length],
               emergencyContact: `Emergency Contact (${p.name.split(' ')[1]} Family): +1 555-09${20 + idx}`,
               notes: 'Patient responding well to prescribed protocol and clinical evaluation.',
          };
     });

     await PatientModel.insertMany(samplePatients);

     return {
          message: 'Sample data seeded successfully!',
          doctorsCount: createdDoctors.length,
          patientsCount: samplePatients.length,
     };
};

export const AnalyticsServices = {
     getDashboardStatsFromDB,
     seedSampleDataIntoDB,
};
