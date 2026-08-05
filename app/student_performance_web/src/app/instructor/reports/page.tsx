'use client';

import { useAuth } from '@/context/AuthContext';
import { instructorService } from '@/features/instructor/services/instructor.service';
import { FaFileAlt, FaFilePdf, FaFileCsv } from 'react-icons/fa';
import { toast } from 'react-toastify';

const saveBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
};

export default function ReportsPage() {
  const { user } = useAuth();

  const handleDownload = async (format: 'pdf' | 'csv') => {
    if (!user) return;
    try {
      const blob = await instructorService.getCohortReport(user.id, format);
      saveBlob(blob, `cohort-report.${format}`);
      toast.success(`Report downloaded (${format.toUpperCase()})`);
    } catch (error) {
      toast.error('Unable to download report');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2a6c] flex items-center gap-2">
            <FaFileAlt /> Reports
          </h1>
          <p className="text-[#4a5568] text-sm">Download cohort reports in PDF or CSV format.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0] max-w-3xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Export reports</h2>
        <p className="text-sm text-gray-500 mb-6">
          Download reports for your latest cohort or student predictions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleDownload('pdf')}
            className="w-full px-4 py-3 rounded-lg bg-[#1a2a6c] text-white hover:bg-[#2d4373] transition-all flex items-center justify-center gap-2"
          >
            <FaFilePdf /> Download PDF
          </button>
          <button
            type="button"
            onClick={() => handleDownload('csv')}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
          >
            <FaFileCsv /> Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
