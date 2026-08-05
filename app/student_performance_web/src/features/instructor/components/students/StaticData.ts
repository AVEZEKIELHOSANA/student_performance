export interface Subject {
  name: string;
  score: number;
  grade: string;
}

export interface Intervention {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
  dueDate?: string;
  location?: string;
  notes?: string[];
  outcome?: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  gender: 'Male' | 'Female';
  grade: string;
  age: number;
  email: string;
  phone?: string;
  averageScore: number;
  gpa: number;
  participationRate: number;
  daysAbsent: number;
  attendanceRate: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  flags: string[];
  isFlagged: boolean;
  notes: string[];
  subjects: Subject[];
  interventions?: Intervention[];
}

export const StudentData: Student[] = [
  {
    id: '1',
    studentId: 'STU-2024-001',
    name: 'Abby Buckley',
    gender: 'Female',
    grade: '5',
    age: 17,
    email: 'abby.buckley@example.com',
    phone: '+237 6XX XXX XXX',
    averageScore: 88.4,
    gpa: 3.7,
    participationRate: 80,
    daysAbsent: 2,
    attendanceRate: 93.33,
    riskLevel: 'low',
    flags: [],
    isFlagged: false,
    notes: ['Consistently performing well', 'Active in class discussions'],
    subjects: [
      { name: 'Mathematics', score: 85, grade: 'B+' },
      { name: 'English', score: 90, grade: 'A-' },
      { name: 'Science', score: 88, grade: 'B+' },
      { name: 'Arts', score: 92, grade: 'A' },
      { name: 'Physics', score: 87, grade: 'B+' },
    ],
    interventions: []
  },
  {
    id: '2',
    studentId: 'STU-2024-002',
    name: 'Abigail Pineda',
    gender: 'Female',
    grade: '2',
    age: 15,
    email: 'abigail.pineda@example.com',
    phone: '+237 6XX XXX XXX',
    averageScore: 69.4,
    gpa: 2.0,
    participationRate: 80,
    daysAbsent: 2,
    attendanceRate: 93.33,
    riskLevel: 'high',
    flags: ['Needs tutoring', 'Low math scores', 'At risk of failing'],
    isFlagged: true,
    notes: ['Has been struggling since mid-term', 'Parent meeting scheduled'],
    subjects: [
      { name: 'Mathematics', score: 62, grade: 'C' },
      { name: 'English', score: 70, grade: 'B-' },
      { name: 'Science', score: 65, grade: 'C+' },
      { name: 'Arts', score: 80, grade: 'B' },
      { name: 'Physics', score: 70, grade: 'B-' },
    ],
    interventions: [
      {
        id: 'int-001',
        type: 'academic_support',
        title: 'Mathematics Tutoring Program',
        description: 'Weekly tutoring sessions to improve math skills. Focus on algebra and geometry fundamentals.',
        priority: 'high',
        status: 'in_progress',
        date: '2024-03-15T10:00:00',
        dueDate: '2024-04-30',
        location: 'Room 203, Math Lab',
        notes: ['Student has shown improvement in recent tests'],
        outcome: 'Expected to improve grade to B by end of semester'
      }
    ]
  },
  {
    id: '3',
    studentId: 'STU-2024-003',
    name: 'Ada Ochoa',
    gender: 'Female',
    grade: '1',
    age: 14,
    email: 'ada.ochoa@example.com',
    averageScore: 87.6,
    gpa: 3.7,
    participationRate: 80,
    daysAbsent: 3,
    attendanceRate: 90.0,
    riskLevel: 'medium',
    flags: ['Improving steadily'],
    isFlagged: true,
    notes: ['Showing improvement in all subjects'],
    subjects: [
      { name: 'Mathematics', score: 85, grade: 'B+' },
      { name: 'English', score: 88, grade: 'B+' },
      { name: 'Science', score: 90, grade: 'A-' },
      { name: 'Arts', score: 87, grade: 'B+' },
      { name: 'Physics', score: 88, grade: 'B+' },
    ],
    interventions: []
  },
  {
    id: '4',
    studentId: 'STU-2024-004',
    name: 'Aida Bailey',
    gender: 'Female',
    grade: '2',
    age: 15,
    email: 'aida.bailey@example.com',
    averageScore: 90.0,
    gpa: 4.0,
    participationRate: 100,
    daysAbsent: 0,
    attendanceRate: 100.0,
    riskLevel: 'low',
    flags: [],
    isFlagged: false,
    notes: ['Excellent student', 'Role model for peers'],
    subjects: [
      { name: 'Mathematics', score: 92, grade: 'A' },
      { name: 'English', score: 90, grade: 'A-' },
      { name: 'Science', score: 88, grade: 'B+' },
      { name: 'Arts', score: 90, grade: 'A-' },
      { name: 'Physics', score: 90, grade: 'A-' },
    ],
    interventions: []
  },
  {
    id: '5',
    studentId: 'STU-2024-005',
    name: 'Alba Andrews',
    gender: 'Female',
    grade: '5',
    age: 17,
    email: 'alba.andrews@example.com',
    averageScore: 94.0,
    gpa: 4.0,
    participationRate: 100,
    daysAbsent: 0,
    attendanceRate: 100.0,
    riskLevel: 'low',
    flags: ['Top performer'],
    isFlagged: true,
    notes: ['Outstanding academic record'],
    subjects: [
      { name: 'Mathematics', score: 95, grade: 'A' },
      { name: 'English', score: 94, grade: 'A' },
      { name: 'Science', score: 93, grade: 'A' },
      { name: 'Arts', score: 95, grade: 'A' },
      { name: 'Physics', score: 93, grade: 'A' },
    ],
    interventions: []
  },
  {
    id: '6',
    studentId: 'STU-2024-006',
    name: 'James Wilson',
    gender: 'Male',
    grade: '3',
    age: 16,
    email: 'james.wilson@example.com',
    phone: '+237 6XX XXX XXX',
    averageScore: 58.0,
    gpa: 1.7,
    participationRate: 45,
    daysAbsent: 8,
    attendanceRate: 73.33,
    riskLevel: 'critical',
    flags: ['Frequent absences', 'Needs immediate intervention', 'Multiple failed subjects'],
    isFlagged: true,
    notes: ['Has missed 8 classes this semester', 'Parent meeting scheduled', 'Consider counseling'],
    subjects: [
      { name: 'Mathematics', score: 45, grade: 'D' },
      { name: 'English', score: 55, grade: 'C-' },
      { name: 'Science', score: 50, grade: 'D+' },
      { name: 'Arts', score: 70, grade: 'B-' },
      { name: 'Physics', score: 70, grade: 'B-' },
    ],
    interventions: [
      {
        id: 'int-002',
        type: 'attendance_plan',
        title: 'Attendance Improvement Plan',
        description: 'Comprehensive plan to address chronic absenteeism. Includes daily check-ins and parent communication.',
        priority: 'critical',
        status: 'in_progress',
        date: '2024-03-10T08:30:00',
        dueDate: '2024-05-01',
        location: 'School Counselors Office',
        notes: ['Student has improved attendance in the last 2 weeks'],
        outcome: 'Attendance rate improved to 80%'
      },
      {
        id: 'int-003',
        type: 'mental_health',
        title: 'Mental Health Support',
        description: 'Regular counseling sessions to address anxiety and depression symptoms.',
        priority: 'critical',
        status: 'pending',
        date: '2024-03-20T14:00:00',
        dueDate: '2024-04-15',
        location: 'Wellness Center, Room 12',
        notes: ['First session scheduled for next week']
      }
    ]
  },
  {
    id: '7',
    studentId: 'STU-2024-007',
    name: 'Maria Garcia',
    gender: 'Female',
    grade: '4',
    age: 16,
    email: 'maria.garcia@example.com',
    averageScore: 72.0,
    gpa: 2.8,
    participationRate: 75,
    daysAbsent: 4,
    attendanceRate: 86.67,
    riskLevel: 'medium',
    flags: ['Needs extra help in math'],
    isFlagged: true,
    notes: ['Consistent effort, but struggling with some concepts'],
    subjects: [
      { name: 'Mathematics', score: 68, grade: 'C+' },
      { name: 'English', score: 75, grade: 'B' },
      { name: 'Science', score: 70, grade: 'B-' },
      { name: 'Arts', score: 76, grade: 'B' },
      { name: 'Physics', score: 71, grade: 'B-' },
    ],
    interventions: []
  },
  {
    id: '8',
    studentId: 'STU-2024-008',
    name: 'David Chen',
    gender: 'Male',
    grade: '3',
    age: 16,
    email: 'david.chen@example.com',
    averageScore: 82.5,
    gpa: 3.3,
    participationRate: 90,
    daysAbsent: 1,
    attendanceRate: 96.67,
    riskLevel: 'low',
    flags: [],
    isFlagged: false,
    notes: ['Consistent performer', 'Good attendance'],
    subjects: [
      { name: 'Mathematics', score: 88, grade: 'B+' },
      { name: 'English', score: 80, grade: 'B' },
      { name: 'Science', score: 85, grade: 'B+' },
      { name: 'Arts', score: 78, grade: 'B' },
      { name: 'Physics', score: 82, grade: 'B' },
    ],
    interventions: []
  },
  {
    id: '9',
    studentId: 'STU-2024-009',
    name: 'Sarah Johnson',
    gender: 'Female',
    grade: '5',
    age: 17,
    email: 'sarah.johnson@example.com',
    phone: '+237 6XX XXX XXX',
    averageScore: 65.0,
    gpa: 2.2,
    participationRate: 60,
    daysAbsent: 6,
    attendanceRate: 80.0,
    riskLevel: 'high',
    flags: ['Attendance issues', 'Falling behind', 'Potential dropout risk'],
    isFlagged: true,
    notes: ['Missed important lessons', 'Contacted parents', 'Needs intervention'],
    subjects: [
      { name: 'Mathematics', score: 55, grade: 'C-' },
      { name: 'English', score: 70, grade: 'B-' },
      { name: 'Science', score: 60, grade: 'C' },
      { name: 'Arts', score: 72, grade: 'B-' },
      { name: 'Physics', score: 68, grade: 'C+' },
    ],
    interventions: [
      {
        id: 'int-004',
        type: 'parent_contact',
        title: 'Parent-Teacher Conference',
        description: 'Meeting with parents to discuss academic performance and develop improvement plan.',
        priority: 'high',
        status: 'completed',
        date: '2024-03-05T16:00:00',
        dueDate: '2024-03-10',
        location: 'School Conference Room',
        notes: ['Parents agreed to support academic improvement at home'],
        outcome: 'Action plan created and agreed upon'
      }
    ]
  },
  {
    id: '10',
    studentId: 'STU-2024-010',
    name: 'Michael Brown',
    gender: 'Male',
    grade: '2',
    age: 15,
    email: 'michael.brown@example.com',
    averageScore: 91.0,
    gpa: 3.9,
    participationRate: 95,
    daysAbsent: 1,
    attendanceRate: 96.67,
    riskLevel: 'low',
    flags: ['High achiever'],
    isFlagged: true,
    notes: ['Excellent academic performance'],
    subjects: [
      { name: 'Mathematics', score: 93, grade: 'A' },
      { name: 'English', score: 89, grade: 'B+' },
      { name: 'Science', score: 91, grade: 'A-' },
      { name: 'Arts', score: 90, grade: 'A-' },
      { name: 'Physics', score: 92, grade: 'A' },
    ],
    interventions: []
  },
  {
    id: '11',
    studentId: 'STU-2024-011',
    name: 'Emma Davis',
    gender: 'Female',
    grade: '4',
    age: 16,
    email: 'emma.davis@example.com',
    averageScore: 76.0,
    gpa: 2.9,
    participationRate: 85,
    daysAbsent: 3,
    attendanceRate: 90.0,
    riskLevel: 'medium',
    flags: ['Improving attendance'],
    isFlagged: true,
    notes: ['Shows improvement in attendance and performance'],
    subjects: [
      { name: 'Mathematics', score: 72, grade: 'B-' },
      { name: 'English', score: 80, grade: 'B' },
      { name: 'Science', score: 75, grade: 'B' },
      { name: 'Arts', score: 78, grade: 'B' },
      { name: 'Physics', score: 75, grade: 'B' },
    ],
    interventions: []
  },
  {
    id: '12',
    studentId: 'STU-2024-012',
    name: 'Robert Taylor',
    gender: 'Male',
    grade: '1',
    age: 14,
    email: 'robert.taylor@example.com',
    phone: '+237 6XX XXX XXX',
    averageScore: 48.0,
    gpa: 1.3,
    participationRate: 30,
    daysAbsent: 10,
    attendanceRate: 66.67,
    riskLevel: 'critical',
    flags: ['Critical intervention needed', 'Frequent absences', 'Multiple failed subjects'],
    isFlagged: true,
    notes: ['Multiple failed subjects', 'Student counseling recommended', 'Immediate action required'],
    subjects: [
      { name: 'Mathematics', score: 40, grade: 'D' },
      { name: 'English', score: 45, grade: 'D' },
      { name: 'Science', score: 42, grade: 'D' },
      { name: 'Arts', score: 55, grade: 'C-' },
      { name: 'Physics', score: 58, grade: 'C-' },
    ],
    interventions: [
      {
        id: 'int-005',
        type: 'referral',
        title: 'Academic Support Referral',
        description: 'Referred to academic support team for comprehensive assessment and intervention planning.',
        priority: 'critical',
        status: 'pending',
        date: '2024-03-25T09:00:00',
        dueDate: '2024-04-15',
        location: 'Academic Support Office',
        notes: ['Waiting for assessment results']
      }
    ]
  },
  {
    id: '13',
    studentId: 'STU-2024-013',
    name: 'Lisa Anderson',
    gender: 'Female',
    grade: '5',
    age: 17,
    email: 'lisa.anderson@example.com',
    averageScore: 85.0,
    gpa: 3.5,
    participationRate: 88,
    daysAbsent: 2,
    attendanceRate: 93.33,
    riskLevel: 'low',
    flags: [],
    isFlagged: false,
    notes: ['Strong academic performer'],
    subjects: [
      { name: 'Mathematics', score: 82, grade: 'B' },
      { name: 'English', score: 88, grade: 'B+' },
      { name: 'Science', score: 85, grade: 'B+' },
      { name: 'Arts', score: 87, grade: 'B+' },
      { name: 'Physics', score: 83, grade: 'B' },
    ],
    interventions: []
  },
  {
    id: '14',
    studentId: 'STU-2024-014',
    name: 'Thomas Martinez',
    gender: 'Male',
    grade: '3',
    age: 16,
    email: 'thomas.martinez@example.com',
    phone: '+237 6XX XXX XXX',
    averageScore: 63.0,
    gpa: 2.1,
    participationRate: 65,
    daysAbsent: 5,
    attendanceRate: 83.33,
    riskLevel: 'high',
    flags: ['Need improvement in math and science', 'Attendance issues'],
    isFlagged: true,
    notes: ['Struggling with core concepts'],
    subjects: [
      { name: 'Mathematics', score: 58, grade: 'C-' },
      { name: 'English', score: 65, grade: 'C+' },
      { name: 'Science', score: 60, grade: 'C' },
      { name: 'Arts', score: 68, grade: 'C+' },
      { name: 'Physics', score: 64, grade: 'C' },
    ],
    interventions: []
  },
  {
    id: '15',
    studentId: 'STU-2024-015',
    name: 'Jennifer Lee',
    gender: 'Female',
    grade: '2',
    age: 15,
    email: 'jennifer.lee@example.com',
    averageScore: 95.0,
    gpa: 4.0,
    participationRate: 100,
    daysAbsent: 0,
    attendanceRate: 100.0,
    riskLevel: 'low',
    flags: ['Top performer'],
    isFlagged: true,
    notes: ['Outstanding academic achievement'],
    subjects: [
      { name: 'Mathematics', score: 96, grade: 'A' },
      { name: 'English', score: 94, grade: 'A' },
      { name: 'Science', score: 95, grade: 'A' },
      { name: 'Arts', score: 96, grade: 'A' },
      { name: 'Physics', score: 94, grade: 'A' },
    ],
    interventions: []
  }
];

export default StudentData;