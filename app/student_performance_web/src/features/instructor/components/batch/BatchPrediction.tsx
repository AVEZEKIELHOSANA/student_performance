'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { instructorService } from '../../services/instructor.service';
import { FaUpload, FaFileCsv, FaEye, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const GRADE_ORDER = ['A', 'B', 'C', 'D', 'Fail'];

const GRADE_COLORS: Record<string, string> = {
  A: '#16a34a',
  B: '#22c55e',
  C: '#f59e0b',
  D: '#f97316',
  Fail: '#dc2626',
};

// Matches any column whose name looks like a grade field (predicted_grade, grade, final_grade, ...)
const isGradeField = (key: string) => /grade/i.test(key);

export const BatchPrediction = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [cohortName, setCohortName] = useState('');
  const [preview, setPreview] = useState<any[] | null>(null);
  const [results, setResults] = useState<any | null>(null);

  const parseCsv = (text: string) => {
    const lines = text.split('\n').filter((line) => line.trim());
    const headers = lines[0].split(',').map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = values[i] || '';
      });
      return obj;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (!newFile) return;

    setFile(newFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = parseCsv(text);
        setPreview(data.slice(0, 5));
      } catch (error) {
        toast.error('Error parsing CSV file');
      }
    };
    reader.readAsText(newFile);
  };

  const handleSubmit = async () => {
    if (!file || !cohortName) {
      toast.error('Please provide a cohort name and upload a CSV file');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          const students = parseCsv(text);
          const response = await instructorService.batchPredict({
            cohort_name: cohortName,
            students,
          });

          // Defensive: some backends name this field `predictions` instead of `results`.
          // If your table still comes up empty after this fix, log `response` here and
          // confirm the actual key name returned by /batch-predict.
          const rows = response.results ?? response.predictions ?? [];

          setResults({ ...response, results: rows });
          toast.success(`Batch prediction complete! ${response.total_students ?? rows.length} students processed.`);
        } catch (error) {
          toast.error('Error processing batch prediction');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error('Error submitting batch prediction');
      setLoading(false);
    }
  };

  // --- Derived data for the summary cards + charts -------------------------------------

  const rows: any[] = results?.results ?? [];

  const gradeFieldKey = useMemo(() => {
    if (!rows.length) return null;
    return Object.keys(rows[0]).find(isGradeField) ?? null;
  }, [rows]);

  const gradeCounts = useMemo(() => {
    if (!gradeFieldKey) return [];
    return GRADE_ORDER.map((grade) => ({
      grade,
      count: rows.filter((s) => s[gradeFieldKey] === grade).length,
    }));
  }, [rows, gradeFieldKey]);

  const resultColumns = rows.length ? Object.keys(rows[0]) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2a6c] flex items-center gap-2">
            <FaUpload /> Batch Prediction
          </h1>
          <p className="text-[#4a5568] text-sm">Upload a CSV file to predict performance for multiple students at once</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cohort Name</label>
            <input
              type="text"
              value={cohortName}
              onChange={(e) => setCohortName(e.target.value)}
              placeholder="e.g., CSC 301 - Sem 1 2026"
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1a2a6c] transition-all">
            <FaFileCsv className="mx-auto text-3xl text-gray-400 mb-2" />
            <p className="text-gray-600">Upload CSV file with student data</p>
            <p className="text-xs text-gray-400 mt-1">CSV must include: Name, Email, Level, Hours_Studied, Attendance, etc.</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1a2a6c] file:text-white hover:file:bg-[#2d4373]"
            />
          </div>

          {file && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-sm text-green-700">✅ File uploaded: {file.name}</p>
            </div>
          )}

          {preview && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview (first 5 rows)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0] || {}).map((key) => (
                        <th key={key} className="px-4 py-2 text-left font-medium text-gray-600 border-b">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="px-4 py-2 text-gray-600">{String(val).substring(0, 30)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !file || !cohortName}
            className="w-full py-3 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Processing...
              </>
            ) : (
              <>
                <FaUpload /> Run Batch Prediction
              </>
            )}
          </button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
            <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4">Results summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-[#1a2a6c]">{results.total_students ?? rows.length}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              {gradeCounts.map(({ grade, count }) => (
                <div
                  key={grade}
                  className="rounded-lg p-3 text-center"
                  style={{ backgroundColor: `${GRADE_COLORS[grade]}1a` }}
                >
                  <p className="text-2xl font-bold" style={{ color: GRADE_COLORS[grade] }}>{count}</p>
                  <p className="text-xs text-gray-500">{grade}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution charts */}
          {gradeCounts.length > 0 && rows.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
                <h3 className="text-sm font-semibold text-[#1a2a6c] mb-4">Grade distribution</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={gradeCounts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {gradeCounts.map(({ grade }) => (
                        <Cell key={grade} fill={GRADE_COLORS[grade]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
                <h3 className="text-sm font-semibold text-[#1a2a6c] mb-4">Grade proportion</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={gradeCounts.filter((g) => g.count > 0)}
                      dataKey="count"
                      nameKey="grade"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ grade, count }) => `${grade}: ${count}`}
                    >
                      {gradeCounts.filter((g) => g.count > 0).map(({ grade }) => (
                        <Cell key={grade} fill={GRADE_COLORS[grade]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Comprehensive student-level results table */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#1a2a6c]">
                Student-level results ({rows.length})
              </h3>
              {results.cohort_id && (
                <button
                  onClick={() => router.push(`/instructor/cohorts/${results.cohort_id}`)}
                  className="px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm flex items-center gap-2"
                >
                  <FaEye /> View cohort
                </button>
              )}
            </div>

            {resultColumns.length > 0 ? (
              <div className="overflow-x-auto max-h-[480px] overflow-y-auto border border-gray-100 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {resultColumns.map((key) => (
                        <th
                          key={key}
                          className="px-4 py-2 text-left font-medium text-gray-600 border-b whitespace-nowrap capitalize"
                        >
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        {resultColumns.map((key) => (
                          <td key={key} className="px-4 py-2 text-gray-600 whitespace-nowrap">
                            {isGradeField(key) ? (
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${GRADE_COLORS[row[key]] || '#94a3b8'}1a`,
                                  color: GRADE_COLORS[row[key]] || '#475569',
                                }}
                              >
                                {row[key]}
                              </span>
                            ) : (
                              String(row[key] ?? '—')
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No per-student results were returned by the server. Check that the
                <code className="mx-1 px-1 bg-gray-100 rounded">/batch-predict</code>
                endpoint response includes a <code className="mx-1 px-1 bg-gray-100 rounded">results</code>
                array.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
