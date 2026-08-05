export interface Student {
  id: string;
  studentId: string;
  name: string;
  gender: 'Male' | 'Female';
  grade: string;
  averageScore: number;
  gpa: number;
  participationRate: number;
  daysAbsent: number;
  attendanceRate: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  subjects: {
    name: string;
    score: number;
    grade: string;
  }[];
  flags?: string[];
  notes?: string[];
}

export interface Subject {
  name: string;
  averageScore: number;
  passRate: number;
  studentsCount: number;
}

export interface Activity {
  id: string;
  studentName: string;
  action: string;
  timestamp: string;
  type: 'warning' | 'success' | 'info';
}

export interface GradeDistribution {
  grade: string;
  male: number;
  female: number;
  total: number;
}

export const StaticData = {
  students: [
    {
      id: '1',
      studentId: 'STU-2024-001',
      name: 'Abby Buckley',
      gender: 'Female' as const,
      grade: '5',
      averageScore: 88.4,
      gpa: 3.7,
      participationRate: 80,
      daysAbsent: 2,
      attendanceRate: 93.33,
      riskLevel: 'low' as const,
      subjects: [
        { name: 'Mathematics', score: 85, grade: 'B+' },
        { name: 'English', score: 90, grade: 'A-' },
        { name: 'Science', score: 88, grade: 'B+' },
        { name: 'Arts', score: 92, grade: 'A' },
        { name: 'Physics', score: 87, grade: 'B+' },
      ],
    },
    {
      id: '2',
      studentId: 'STU-2024-002',
      name: 'Abigail Pineda',
      gender: 'Female' as const,
      grade: '2',
      averageScore: 69.4,
      gpa: 2.0,
      participationRate: 80,
      daysAbsent: 2,
      attendanceRate: 93.33,
      riskLevel: 'high' as const,
      subjects: [
        { name: 'Mathematics', score: 62, grade: 'C' },
        { name: 'English', score: 70, grade: 'B-' },
        { name: 'Science', score: 65, grade: 'C+' },
        { name: 'Arts', score: 80, grade: 'B' },
        { name: 'Physics', score: 70, grade: 'B-' },
      ],
      flags: ['Needs tutoring', 'Low math scores'],
      notes: ['Has been struggling since mid-term'],
    },
    {
      id: '3',
      studentId: 'STU-2024-003',
      name: 'Ada Ochoa',
      gender: 'Female' as const,
      grade: '1',
      averageScore: 87.6,
      gpa: 3.7,
      participationRate: 80,
      daysAbsent: 3,
      attendanceRate: 90.0,
      riskLevel: 'medium' as const,
      subjects: [
        { name: 'Mathematics', score: 85, grade: 'B+' },
        { name: 'English', score: 88, grade: 'B+' },
        { name: 'Science', score: 90, grade: 'A-' },
        { name: 'Arts', score: 87, grade: 'B+' },
        { name: 'Physics', score: 88, grade: 'B+' },
      ],
      flags: ['Improving steadily'],
    },
    {
      id: '4',
      studentId: 'STU-2024-004',
      name: 'Aida Bailey',
      gender: 'Female' as const,
      grade: '2',
      averageScore: 90.0,
      gpa: 4.0,
      participationRate: 100,
      daysAbsent: 0,
      attendanceRate: 100.0,
      riskLevel: 'low' as const,
      subjects: [
        { name: 'Mathematics', score: 92, grade: 'A' },
        { name: 'English', score: 90, grade: 'A-' },
        { name: 'Science', score: 88, grade: 'B+' },
        { name: 'Arts', score: 90, grade: 'A-' },
        { name: 'Physics', score: 90, grade: 'A-' },
      ],
    },
    {
      id: '5',
      studentId: 'STU-2024-005',
      name: 'Alba Andrews',
      gender: 'Female' as const,
      grade: '5',
      averageScore: 94.0,
      gpa: 4.0,
      participationRate: 100,
      daysAbsent: 0,
      attendanceRate: 100.0,
      riskLevel: 'low' as const,
      subjects: [
        { name: 'Mathematics', score: 95, grade: 'A' },
        { name: 'English', score: 94, grade: 'A' },
        { name: 'Science', score: 93, grade: 'A' },
        { name: 'Arts', score: 95, grade: 'A' },
        { name: 'Physics', score: 93, grade: 'A' },
      ],
    },
    {
      id: '6',
      studentId: 'STU-2024-006',
      name: 'James Wilson',
      gender: 'Male' as const,
      grade: '3',
      averageScore: 58.0,
      gpa: 1.7,
      participationRate: 45,
      daysAbsent: 8,
      attendanceRate: 73.33,
      riskLevel: 'critical' as const,
      subjects: [
        { name: 'Mathematics', score: 45, grade: 'D' },
        { name: 'English', score: 55, grade: 'C-' },
        { name: 'Science', score: 50, grade: 'D+' },
        { name: 'Arts', score: 70, grade: 'B-' },
        { name: 'Physics', score: 70, grade: 'B-' },
      ],
      flags: ['Frequent absences', 'Needs immediate intervention'],
      notes: ['Has missed 8 classes this semester', 'Parent meeting scheduled'],
    },
    {
      id: '7',
      studentId: 'STU-2024-007',
      name: 'Maria Garcia',
      gender: 'Female' as const,
      grade: '4',
      averageScore: 72.0,
      gpa: 2.8,
      participationRate: 75,
      daysAbsent: 4,
      attendanceRate: 86.67,
      riskLevel: 'medium' as const,
      subjects: [
        { name: 'Mathematics', score: 68, grade: 'C+' },
        { name: 'English', score: 75, grade: 'B' },
        { name: 'Science', score: 70, grade: 'B-' },
        { name: 'Arts', score: 76, grade: 'B' },
        { name: 'Physics', score: 71, grade: 'B-' },
      ],
      flags: ['Needs extra help in math'],
    },
    {
      id: '8',
      studentId: 'STU-2024-008',
      name: 'David Chen',
      gender: 'Male' as const,
      grade: '3',
      averageScore: 82.5,
      gpa: 3.3,
      participationRate: 90,
      daysAbsent: 1,
      attendanceRate: 96.67,
      riskLevel: 'low' as const,
      subjects: [
        { name: 'Mathematics', score: 88, grade: 'B+' },
        { name: 'English', score: 80, grade: 'B' },
        { name: 'Science', score: 85, grade: 'B+' },
        { name: 'Arts', score: 78, grade: 'B' },
        { name: 'Physics', score: 82, grade: 'B' },
      ],
    },
    {
      id: '9',
      studentId: 'STU-2024-009',
      name: 'Sarah Johnson',
      gender: 'Female' as const,
      grade: '5',
      averageScore: 65.0,
      gpa: 2.2,
      participationRate: 60,
      daysAbsent: 6,
      attendanceRate: 80.0,
      riskLevel: 'high' as const,
      subjects: [
        { name: 'Mathematics', score: 55, grade: 'C-' },
        { name: 'English', score: 70, grade: 'B-' },
        { name: 'Science', score: 60, grade: 'C' },
        { name: 'Arts', score: 72, grade: 'B-' },
        { name: 'Physics', score: 68, grade: 'C+' },
      ],
      flags: ['Attendance issues', 'Falling behind'],
      notes: ['Missed important lessons', 'Contacted parents'],
    },
    {
      id: '10',
      studentId: 'STU-2024-010',
      name: 'Michael Brown',
      gender: 'Male' as const,
      grade: '2',
      averageScore: 91.0,
      gpa: 3.9,
      participationRate: 95,
      daysAbsent: 1,
      attendanceRate: 96.67,
      riskLevel: 'low' as const,
      subjects: [
        { name: 'Mathematics', score: 93, grade: 'A' },
        { name: 'English', score: 89, grade: 'B+' },
        { name: 'Science', score: 91, grade: 'A-' },
        { name: 'Arts', score: 90, grade: 'A-' },
        { name: 'Physics', score: 92, grade: 'A' },
      ],
    },
    {
      id: '11',
      studentId: 'STU-2024-011',
      name: 'Emma Davis',
      gender: 'Female' as const,
      grade: '4',
      averageScore: 76.0,
      gpa: 2.9,
      participationRate: 85,
      daysAbsent: 3,
      attendanceRate: 90.0,
      riskLevel: 'medium' as const,
      subjects: [
        { name: 'Mathematics', score: 72, grade: 'B-' },
        { name: 'English', score: 80, grade: 'B' },
        { name: 'Science', score: 75, grade: 'B' },
        { name: 'Arts', score: 78, grade: 'B' },
        { name: 'Physics', score: 75, grade: 'B' },
      ],
    },
    {
      id: '12',
      studentId: 'STU-2024-012',
      name: 'Robert Taylor',
      gender: 'Male' as const,
      grade: '1',
      averageScore: 48.0,
      gpa: 1.3,
      participationRate: 30,
      daysAbsent: 10,
      attendanceRate: 66.67,
      riskLevel: 'critical' as const,
      subjects: [
        { name: 'Mathematics', score: 40, grade: 'D' },
        { name: 'English', score: 45, grade: 'D' },
        { name: 'Science', score: 42, grade: 'D' },
        { name: 'Arts', score: 55, grade: 'C-' },
        { name: 'Physics', score: 58, grade: 'C-' },
      ],
      flags: ['Critical intervention needed', 'Frequent absences'],
      notes: ['Multiple failed subjects', 'Student counseling recommended'],
    },
    {
      id: '13',
      studentId: 'STU-2024-013',
      name: 'Lisa Anderson',
      gender: 'Female' as const,
      grade: '5',
      averageScore: 85.0,
      gpa: 3.5,
      participationRate: 88,
      daysAbsent: 2,
      attendanceRate: 93.33,
      riskLevel: 'low' as const,
      subjects: [
        { name: 'Mathematics', score: 82, grade: 'B' },
        { name: 'English', score: 88, grade: 'B+' },
        { name: 'Science', score: 85, grade: 'B+' },
        { name: 'Arts', score: 87, grade: 'B+' },
        { name: 'Physics', score: 83, grade: 'B' },
      ],
    },
    {
      id: '14',
      studentId: 'STU-2024-014',
      name: 'Thomas Martinez',
      gender: 'Male' as const,
      grade: '3',
      averageScore: 63.0,
      gpa: 2.1,
      participationRate: 65,
      daysAbsent: 5,
      attendanceRate: 83.33,
      riskLevel: 'high' as const,
      subjects: [
        { name: 'Mathematics', score: 58, grade: 'C-' },
        { name: 'English', score: 65, grade: 'C+' },
        { name: 'Science', score: 60, grade: 'C' },
        { name: 'Arts', score: 68, grade: 'C+' },
        { name: 'Physics', score: 64, grade: 'C' },
      ],
      flags: ['Need improvement in math and science'],
    },
    {
      id: '15',
      studentId: 'STU-2024-015',
      name: 'Jennifer Lee',
      gender: 'Female' as const,
      grade: '2',
      averageScore: 95.0,
      gpa: 4.0,
      participationRate: 100,
      daysAbsent: 0,
      attendanceRate: 100.0,
      riskLevel: 'low' as const,
      subjects: [
        { name: 'Mathematics', score: 96, grade: 'A' },
        { name: 'English', score: 94, grade: 'A' },
        { name: 'Science', score: 95, grade: 'A' },
        { name: 'Arts', score: 96, grade: 'A' },
        { name: 'Physics', score: 94, grade: 'A' },
      ],
    },
  ],

  subjects: [
    { name: 'Mathematics', averageScore: 74.8, passRate: 73.3, studentsCount: 15 },
    { name: 'English', averageScore: 78.2, passRate: 80.0, studentsCount: 15 },
    { name: 'Science', averageScore: 75.3, passRate: 76.7, studentsCount: 15 },
    { name: 'Arts', averageScore: 81.2, passRate: 86.7, studentsCount: 15 },
    { name: 'Physics', averageScore: 79.3, passRate: 83.3, studentsCount: 15 },
  ],

  activities: [
    {
      id: '1',
      studentName: 'James Wilson',
      action: 'Risk level updated to CRITICAL',
      timestamp: '2 hours ago',
      type: 'warning' as const,
    },
    {
      id: '2',
      studentName: 'Abigail Pineda',
      action: 'New prediction generated - HIGH risk',
      timestamp: '4 hours ago',
      type: 'warning' as const,
    },
    {
      id: '3',
      studentName: 'Aida Bailey',
      action: 'Excellent performance - GPA 4.0',
      timestamp: '6 hours ago',
      type: 'success' as const,
    },
    {
      id: '4',
      studentName: 'Robert Taylor',
      action: 'Intervention recommended',
      timestamp: '1 day ago',
      type: 'warning' as const,
    },
    {
      id: '5',
      studentName: 'Emma Davis',
      action: 'Attendance improved this month',
      timestamp: '2 days ago',
      type: 'info' as const,
    },
  ],

  gradeDistribution: [
    { grade: 'Grade 1', male: 2, female: 2, total: 4 },
    { grade: 'Grade 2', male: 2, female: 2, total: 4 },
    { grade: 'Grade 3', male: 2, female: 1, total: 3 },
    { grade: 'Grade 4', male: 0, female: 2, total: 2 },
    { grade: 'Grade 5', male: 0, female: 2, total: 2 },
  ],

  stats: {
    totalStudents: 15,
    atRiskStudents: 7,
    riskPercentage: 46.7,
    avgGPA: 3.1,
    avgAttendance: 91.2,
    unreadNotifications: 3,
  },
};

export default StaticData;