'use client';

import { FaGraduationCap } from 'react-icons/fa';
import { Modal } from './Modal';

interface CompleteProfilePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const CompleteProfilePrompt = ({ isOpen, onClose, onComplete }: CompleteProfilePromptProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Your Profile">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#1a2a6c]/10 flex items-center justify-center mx-auto">
          <FaGraduationCap className="text-[#1a2a6c] text-2xl" />
        </div>
        <p className="text-gray-600">
          Complete your profile so your instructors can give you personalized advice and track your progress accurately.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            Later
          </button>
          <button
            onClick={onComplete}
            className="flex-1 py-2.5 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all"
          >
            Complete Profile
          </button>
        </div>
      </div>
    </Modal>
  );
};