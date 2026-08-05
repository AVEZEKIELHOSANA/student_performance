'use client';

import { useState } from 'react';
import { 
  FaTimes, 
  FaHandsHelping, 
  FaUserGraduate, 
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaFlag
} from 'react-icons/fa';
import { Student } from './StaticData';

interface InterventionModalProps {
  isOpen: boolean;
  student: Student;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const INTERVENTION_TYPES = [
  { value: 'academic_support', label: '📚 Academic Support', description: 'Tutoring, study plan, academic resources' },
  { value: 'meeting', label: '👤 One-on-One Meeting', description: 'Individual consultation with the student' },
  { value: 'parent_contact', label: '📞 Parent Contact', description: 'Call or meeting with parents/guardians' },
  { value: 'mental_health', label: '🧠 Mental Health Support', description: 'Counseling, stress management, wellness resources' },
  { value: 'attendance_plan', label: '📋 Attendance Improvement', description: 'Plan to improve attendance and engagement' },
  { value: 'peer_support', label: '🤝 Peer Support', description: 'Peer tutoring, buddy system, group study' },
  { value: 'referral', label: '📤 Referral', description: 'Referral to specialist or external support' },
  { value: 'other', label: '📌 Other', description: 'Custom intervention type' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' },
];

export const InterventionModal = ({ isOpen, student, onClose, onSubmit }: InterventionModalProps) => {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    priority: 'high',
    dueDate: '',
    time: '',
    location: '',
    notes: '',
    sendEmail: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedType = INTERVENTION_TYPES.find(t => t.value === formData.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#e2e8f0] flex items-start justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <FaHandsHelping size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1a2a6c]">Start Intervention</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <FaUserGraduate />
                <span>{student.name}</span>
                <span className="text-gray-300">|</span>
                <span>{student.studentId}</span>
                {student.flags && student.flags.length > 0 && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1 text-yellow-600">
                      <FaFlag size={10} /> Flagged
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="space-y-5">
            {/* Current Status */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {student.riskLevel.toUpperCase()} RISK STUDENT
                  </p>
                  <p className="text-sm text-red-700">
                    This student requires immediate attention. Current GPA: {student.gpa.toFixed(2)} · 
                    Attendance: {student.attendanceRate}%
                  </p>
                </div>
              </div>
            </div>

            {/* Intervention Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intervention Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
              >
                <option value="">Select intervention type...</option>
                {INTERVENTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
              {selectedType && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedType.description}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Academic Support Plan - Mathematics"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the intervention plan, goals, and expected outcomes..."
                required
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent resize-none"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITY_OPTIONS.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => handleChange('priority', priority.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      formData.priority === priority.value
                        ? `${priority.color} border-${priority.value}-300 ring-2 ring-${priority.value}-200`
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Room 301, Online (Zoom), Parent's Office"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional information, context, or specific requirements..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent resize-none"
              />
            </div>

            {/* Email Notification */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sendEmail}
                      onChange={(e) => handleChange('sendEmail', e.target.checked)}
                      className="w-4 h-4 accent-[#1a2a6c]"
                    />
                    <span className="text-sm font-medium text-blue-800">
                      Send email notification to student
                    </span>
                  </label>
                  <p className="text-xs text-blue-600 mt-1">
                    An email will be sent to {student.email} with intervention details and next steps.
                  </p>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <p className="text-xs text-yellow-700 flex items-center gap-2">
                <FaExclamationTriangle size={12} />
                This intervention will be logged and visible to the student. Please ensure all information is accurate.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.type || !formData.title || !formData.description || !formData.dueDate}
              className="flex-1 py-2.5 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaHandsHelping />
                  Start Intervention & Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};