import { useState, useEffect } from 'react';
import { instructorService } from '../services/instructor.service';
import {
  AtRiskStudent,
  Cohort,
  InstructorStats,
  StudentInfo,
} from '../types/instructor.types';

export const useInstructor = () => {
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [atRisk, setAtRisk] = useState<AtRiskStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, atRiskData] = await Promise.all([
        instructorService.getStats(),
        instructorService.getAtRiskStudents(),
      ]);
      setStats(statsData);
      setAtRisk(atRiskData);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await instructorService.getStudents();
      setStudents(data);
    } finally {
      setLoading(false);
    }
  };

  const loadCohorts = async () => {
    setLoading(true);
    try {
      const data = await instructorService.getCohorts();
      setCohorts(data);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    students,
    cohorts,
    atRisk,
    loading,
    loadDashboardData,
    loadStudents,
    loadCohorts,
  };
};
