'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaHistory, 
  FaCalendarAlt, 
  FaChartLine, 
  FaDownload,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { predictionService } from '../../services/prediction.service';
import { PredictionHistoryResponse } from '../../types/prediction.types';
import { HistoryCard } from './HistoryCard';

export const HistoryContent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<PredictionHistoryResponse[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await predictionService.getHistory(limit);
      setPredictions(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load prediction history');
    } finally {
      setLoading(false);
    }
  };

  const handleRunPrediction = () => {
    router.push('/student/predict');
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A': 'text-green-600 bg-green-50 border-green-200',
      'B': 'text-blue-600 bg-blue-50 border-blue-200',
      'C': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'D': 'text-orange-600 bg-orange-50 border-orange-200',
      'Fail': 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[grade] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Excellent')) return 'text-green-600';
    if (status.includes('Good')) return 'text-blue-600';
    if (status.includes('Average')) return 'text-yellow-600';
    if (status.includes('Below') || status.includes('Risk')) return 'text-orange-600';
    if (status.includes('Fail')) return 'text-red-600';
    return 'text-gray-600';
  };

  // Calculate statistics
  const totalPredictions = predictions.length;
  const latestPrediction = predictions[0];
  
  // Calculate average probability
  const avgProbability = totalPredictions > 0 
    ? Math.round(predictions.reduce((acc, p) => acc + p.probability, 0) / totalPredictions)
    : 0;

  // Count grades
  const gradeCounts = predictions.reduce((acc, p) => {
    acc[p.grade_label] = (acc[p.grade_label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a6c] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2a6c] flex items-center gap-2">
            <FaHistory /> Prediction History
          </h1>
          <p className="text-[#4a5568] text-sm">Your past performance predictions</p>
        </div>
        <button
          onClick={handleRunPrediction}
          className="px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm flex items-center gap-2"
        >
          <FaChartLine /> New Prediction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-[#e2e8f0] text-center">
          <p className="text-2xl font-bold text-[#1a2a6c]">{totalPredictions}</p>
          <p className="text-xs text-[#4a5568]">Total Predictions</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-[#e2e8f0] text-center">
          <p className="text-2xl font-bold text-[#1a2a6c]">{avgProbability}%</p>
          <p className="text-xs text-[#4a5568]">Avg. Probability</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-[#e2e8f0] text-center">
          <p className="text-2xl font-bold text-[#1a2a6c]">
            {latestPrediction?.grade_label || 'N/A'}
          </p>
          <p className="text-xs text-[#4a5568]">Latest Grade</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-[#e2e8f0] text-center">
          <p className="text-2xl font-bold text-[#1a2a6c]">
            {Object.keys(gradeCounts).length || 0}
          </p>
          <p className="text-xs text-[#4a5568]">Different Grades</p>
        </div>
      </div>

      {/* Export Button */}
      {predictions.length > 0 && (
        <div className="flex justify-end">
          <button className="px-4 py-2 border border-[#1a2a6c] text-[#1a2a6c] rounded-lg hover:bg-[#f0f4ff] transition-all text-sm flex items-center gap-2">
            <FaDownload /> Export CSV
          </button>
        </div>
      )}

      {/* History List */}
      {predictions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-[#e2e8f0]">
          <FaChartLine className="mx-auto text-4xl text-[#cbd5e1] mb-4" />
          <p className="text-[#4a5568] font-medium">No predictions yet</p>
          <p className="text-sm text-[#4a5568] mt-1">Run your first prediction to see history here</p>
          <button
            onClick={handleRunPrediction}
            className="mt-4 px-6 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm"
          >
            Run Your First Prediction
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {predictions.map((prediction) => (
            <HistoryCard
              key={prediction.id}
              prediction={prediction}
              gradeColor={getGradeColor(prediction.grade_label)}
              statusColor={getStatusColor(prediction.academic_status)}
            />
          ))}
        </div>
      )}

      {/* Pagination (if needed) */}
      {predictions.length >= limit && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            className="px-4 py-2 border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-all"
          >
            <FaChevronLeft size={14} />
          </button>
          <span className="px-4 py-2 text-[#4a5568]">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-all"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};