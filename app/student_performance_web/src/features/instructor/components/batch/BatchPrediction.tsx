'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { instructorService } from '../../services/instructor.service';
import { FaUpload, FaFileCsv, FaEye, FaSpinner, FaDownload, FaChartBar, FaUsers } from 'react-icons/fa';
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
import { STATIC_BATCH_PREDICTION_RESPONSE } from './batchPredictionStaticData';

const GRADE_ORDER = ['A', 'B', 'C', 'D', 'Fail'];
const GRADE_COLORS: Record<string, string> = {
  A: '#16a34a',
  B: '#22c55e',
  C: '#f59e0b',
  D: '#f97316',
  Fail: '#dc2626',
};

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#dc2626',
};

const RISK_LABELS: Record<string, string> = {
  low: '🟢 Low',
  medium: '🟡 Medium',
  high: '🟠 High',
  critical: '🔴 Critical',
};

// Matches any column whose name looks like a grade field
const isGradeField = (key: string) => /grade/i.test(key);

export const BatchPrediction = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [cohortName, setCohortName] = useState('');
  const [preview, setPreview] = useState<any[] | null>(null);
  const [results, setResults] = useState<any | null>(null);
  const [useStaticData, setUseStaticData] = useState(true); // Set to true for demo

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

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (useStaticData) {
        // Use static data for demo
        setResults({
          ...STATIC_BATCH_PREDICTION_RESPONSE,
          cohort_name: cohortName || STATIC_BATCH_PREDICTION_RESPONSE.cohort_name,
        });
        toast.success(`✅ Batch prediction complete! ${STATIC_BATCH_PREDICTION_RESPONSE.total_students} students processed.`);
      } else {
        // Real API call
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const text = event.target?.result as string;
            const students = parseCsv(text);
            const response = await instructorService.batchPredict({
              cohort_name: cohortName,
              students,
            });
            const rows = response.results ?? response.predictions ?? [];
            setResults({ ...response, results: rows });
            toast.success(`✅ Batch prediction complete! ${response.total_students ?? rows.length} students processed.`);
          } catch (error) {
            toast.error('Error processing batch prediction');
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
        reader.readAsText(file);
        return;
      }
    } catch (error) {
      toast.error('Error submitting batch prediction');
      console.error(error);
    } finally {
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
      count: rows.filter((s: any) => s[gradeFieldKey] === grade).length,
    }));
  }, [rows, gradeFieldKey]);

  const riskCounts = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    rows.forEach((s: any) => {
      const risk = s.risk_level?.toLowerCase();
      if (risk in counts) counts[risk as keyof typeof counts]++;
    });
    return Object.entries(counts).map(([key, value]) => ({
      risk: key,
      count: value,
    }));
  }, [rows]);

  const resultColumns = rows.length ? Object.keys(rows[0]) : [];

  const getRiskBadge = (risk: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return `px-2 py-1 rounded-full text-xs font-medium border ${colors[risk as keyof typeof colors] || colors.low}`;
  };

  const downloadResults = () => {
    if (!results) return;
    const csvRows = [];
    const headers = Object.keys(rows[0] || {});
    csvRows.push(headers.join(','));
    rows.forEach((row: any) => {
      const values = headers.map(header => {
        const val = row[header] || '';
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      });
      csvRows.push(values.join(','));
    });
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch_prediction_${cohortName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2a6c] flex items-center gap-2">
            <FaUpload className="text-blue-500" />
            Batch Prediction
          </h1>
          <p className="text-[#4a5568] text-sm">
            Upload a CSV file to predict performance for multiple students at once
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setUseStaticData(!useStaticData)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
              useStaticData 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            {useStaticData ? '📊 Using Demo Data' : '🔗 Live API'}
          </button>
        </div>
      </div>

      {/* Upload Section */}
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
            <p className="text-xs text-gray-400 mt-1">
              Required: student_name, student_email, hours_studied, attendance, previous_gpa, stress_level
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1a2a6c] file:text-white hover:file:bg-[#2d4373]"
            />
          </div>

          {file && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 flex items-center justify-between">
              <p className="text-sm text-green-700">✅ File uploaded: {file.name}</p>
              <span className="text-xs text-green-600">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          )}

          {preview && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview (first 5 rows)</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0] || {}).map((key) => (
                        <th key={key} className="px-4 py-2 text-left font-medium text-gray-600 border-b">
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="px-4 py-2 text-gray-600 text-xs">{String(val).substring(0, 30)}</td>
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

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold text-[#1a2a6c]">{results.total_students}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <FaUsers />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg GPA</p>
                  <p className="text-2xl font-bold text-[#1a2a6c]">{results.average_gpa.toFixed(2)}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                  <FaChartBar />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">At-Risk Students</p>
                  <p className="text-2xl font-bold text-red-600">
                    {(results.risk_distribution?.critical || 0) + (results.risk_distribution?.high || 0)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <span className="text-xl">⚠️</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((results.success_count / results.total_students) * 100)}%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <FaDownload />
                </div>
              </div>
            </div>
          </div>

          {/* Grade Distribution */}
          {gradeCounts.length > 0 && rows.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
                <h3 className="text-sm font-semibold text-[#1a2a6c] mb-4">Grade Distribution</h3>
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
                <h3 className="text-sm font-semibold text-[#1a2a6c] mb-4">Risk Distribution</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={riskCounts.filter((r) => r.count > 0)}
                      dataKey="count"
                      nameKey="risk"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ risk, count }) => `${RISK_LABELS[risk]}: ${count}`}
                    >
                      {riskCounts.filter((r) => r.count > 0).map(({ risk }) => (
                        <Cell key={risk} fill={RISK_COLORS[risk]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Student Results Table */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-sm font-semibold text-[#1a2a6c] flex items-center gap-2">
                <FaUsers />
                Student Results ({rows.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={downloadResults}
                  className="px-3 py-1.5 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm flex items-center gap-1"
                >
                  <FaDownload size={12} /> Download CSV
                </button>
                {results.cohort_id && (
                  <button
                    onClick={() => router.push(`/instructor/cohorts/${results.cohort_id}`)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm flex items-center gap-1"
                  >
                    <FaEye size={12} /> View Cohort
                  </button>
                )}
              </div>
            </div>

            {resultColumns.length > 0 ? (
              <div className="overflow-x-auto max-h-[480px] overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600 border-b">#</th>
                      {resultColumns.map((key) => (
                        <th
                          key={key}
                          className="px-4 py-3 text-left font-medium text-gray-600 border-b whitespace-nowrap capitalize"
                        >
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row: any, i: number) => {
                      const riskLevel = row.risk_level?.toLowerCase() || 'low';
                      return (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                          <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                          {resultColumns.map((key) => {
                            const value = row[key];
                            if (key === 'risk_level') {
                              return (
                                <td key={key} className="px-4 py-3">
                                  <span className={getRiskBadge(riskLevel)}>
                                    {RISK_LABELS[riskLevel] || value}
                                  </span>
                                </td>
                              );
                            }
                            if (isGradeField(key)) {
                              return (
                                <td key={key} className="px-4 py-3">
                                  <span
                                    className="px-2 py-1 rounded-full text-xs font-medium"
                                    style={{
                                      backgroundColor: `${GRADE_COLORS[value] || '#94a3b8'}20`,
                                      color: GRADE_COLORS[value] || '#475569',
                                    }}
                                  >
                                    {value}
                                  </span>
                                </td>
                              );
                            }
                            if (key === 'recommendations' && Array.isArray(value)) {
                              return (
                                <td key={key} className="px-4 py-3">
                                  <ul className="list-disc list-inside text-xs text-gray-600">
                                    {value.slice(0, 2).map((rec: string, idx: number) => (
                                      <li key={idx}>{rec}</li>
                                    ))}
                                    {value.length > 2 && (
                                      <li className="text-gray-400">+{value.length - 2} more...</li>
                                    )}
                                  </ul>
                                </td>
                              );
                            }
                            if (typeof value === 'number') {
                              return (
                                <td key={key} className="px-4 py-3 text-gray-600">
                                  {value.toFixed(2)}
                                </td>
                              );
                            }
                            return (
                              <td key={key} className="px-4 py-3 text-gray-600">
                                {String(value ?? '—')}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                No student results available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};