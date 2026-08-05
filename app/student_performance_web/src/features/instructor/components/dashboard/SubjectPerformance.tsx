'use client';

import { Subject, Student } from './StaticData';

interface SubjectPerformanceProps {
  subjects: Subject[];
  students: Student[];
}

export const SubjectPerformance = ({ subjects }: SubjectPerformanceProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
      <h3 className="text-lg font-semibold text-[#1a2a6c] flex items-center gap-2 mb-4">
        <span className="text-blue-500">📊</span>
        Subject Performance
      </h3>

      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{subject.name}</span>
              <span className="text-gray-500">{subject.averageScore}% avg</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    subject.averageScore >= 80 ? 'bg-green-500' :
                    subject.averageScore >= 70 ? 'bg-yellow-500' :
                    subject.averageScore >= 60 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${subject.averageScore}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {subject.passRate}% pass rate
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#e2e8f0] grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-gray-500">Pass Rate</span>
          <span className="block font-bold text-green-600">80.0%</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-gray-500">Fail Rate</span>
          <span className="block font-bold text-red-600">20.0%</span>
        </div>
      </div>
    </div>
  );
};