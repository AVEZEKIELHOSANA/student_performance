'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaLightbulb, 
  FaCheckCircle, 
  FaClock, 
  FaArrowRight,
  FaFilter,
  FaStar,
  FaStarHalfAlt,
  FaRegStar
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { recommendationService } from '../../services/recommendation.service';
import { Recommendation } from '../../types/recommendation.types';

export const RecommendationsContent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'implemented'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await recommendationService.getRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkImplemented = async (id: string, rating?: number) => {
    try {
      await recommendationService.markImplemented(id, rating);
      toast.success('Recommendation marked as implemented!');
      fetchRecommendations();
    } catch (error) {
      toast.error('Failed to mark as implemented');
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 1) return 'bg-red-100 text-red-700 border-red-200';
    if (priority <= 2) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (priority <= 3) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Academic': '📚',
      'Study Habits': '📖',
      'Mental Health': '🧠',
      'Wellness': '💪',
      'Environment': '🏠',
      'Urgent': '🚨',
      'Wellbeing': '😊',
    };
    return icons[category] || '💡';
  };

  // Filter recommendations
  const filteredRecommendations = recommendations.filter(rec => {
    if (filter === 'pending') return !rec.is_implemented;
    if (filter === 'implemented') return rec.is_implemented;
    return true;
  }).filter(rec => {
    if (selectedCategory === 'all') return true;
    return rec.category === selectedCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(recommendations.map(r => r.category))];

  // Count pending
  const pendingCount = recommendations.filter(r => !r.is_implemented).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a6c] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recommendations...</p>
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
            <FaLightbulb /> Recommendations
          </h1>
          <p className="text-[#4a5568] text-sm">
            Personalized recommendations to improve your performance
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                {pendingCount} pending
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchRecommendations}
          className="px-4 py-2 border border-[#1a2a6c] text-[#1a2a6c] rounded-lg hover:bg-[#f0f4ff] transition-all text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-white rounded-lg border border-[#e2e8f0] p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm transition-all ${
              filter === 'all' ? 'bg-[#1a2a6c] text-white' : 'text-[#4a5568] hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-md text-sm transition-all ${
              filter === 'pending' ? 'bg-[#1a2a6c] text-white' : 'text-[#4a5568] hover:bg-gray-100'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('implemented')}
            className={`px-3 py-1.5 rounded-md text-sm transition-all ${
              filter === 'implemented' ? 'bg-[#1a2a6c] text-white' : 'text-[#4a5568] hover:bg-gray-100'
            }`}
          >
            Implemented
          </button>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c]"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Recommendations List */}
      {filteredRecommendations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-[#e2e8f0]">
          <FaLightbulb className="mx-auto text-4xl text-[#cbd5e1] mb-4" />
          <p className="text-[#4a5568] font-medium">No recommendations found</p>
          <p className="text-sm text-[#4a5568] mt-1">
            {filter === 'pending' ? 'You have no pending recommendations' : 
             filter === 'implemented' ? 'You have no implemented recommendations yet' :
             'Run a prediction to get personalized recommendations'}
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="mt-4 text-sm text-[#1a2a6c] hover:underline"
            >
              View all recommendations
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-xl shadow-sm p-5 border border-[#e2e8f0] hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">{getCategoryIcon(rec.category)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        {rec.title}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(rec.priority)}`}>
                          Priority {rec.priority}
                        </span>
                      </h3>
                      <p className="text-sm text-[#4a5568] mt-1">{rec.description}</p>
                      {rec.action_plan && (
                        <p className="text-sm text-[#1a2a6c] mt-2 bg-[#f0f4ff] p-3 rounded-lg border border-[#e2e8f0]">
                          <span className="font-medium">Action Plan:</span> {rec.action_plan}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs text-[#4a5568]">
                        {new Date(rec.generated_at).toLocaleDateString()}
                      </span>
                      {rec.is_implemented ? (
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
                          <FaCheckCircle size={12} /> Implemented
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkImplemented(rec.id)}
                          className="text-xs bg-[#1a2a6c] text-white px-4 py-1.5 rounded-full hover:bg-[#2d4373] transition-all flex items-center gap-1"
                        >
                          <FaCheckCircle size={12} /> Mark Done
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {rec.category}
                    </span>
                    {rec.feature_focus && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        Focus: {rec.feature_focus.replace(/_/g, ' ')}
                      </span>
                    )}
                    {rec.is_implemented && rec.effectiveness_rating && (
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        Rating: {'⭐'.repeat(rec.effectiveness_rating)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};