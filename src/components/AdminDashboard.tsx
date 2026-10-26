import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { allSubMateriList } from '../data/allMateri';
import {
  ShieldCheck,
  Users,
  Award,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  Plus,
  Trash2,
  Eye,
  Key,
  GraduationCap,
  Sparkles,
  ExternalLink,
  UploadCloud,
} from 'lucide-react';
import { getSavedSpreadsheetId } from '../utils/googleSheets';
import { StudentScoreRecord } from '../types/auth';

interface AdminDashboardProps {
  onBackToStudentView: () => void;
  onOpenGoogleSheets: (batchScores?: StudentScoreRecord[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStudentView,
  onOpenGoogleSheets,
}) => {
  const { currentUser, allStudentScores, announcements, addAnnouncement, deleteAnnouncement } =
    useAuth();

  const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>('all');
  const [selectedMateriFilter, setSelectedMateriFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Announcement form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [showAnnForm, setShowAnnForm] = useState(false);

  // Teacher Answer Key Browser
  const [selectedMateriKeys, setSelectedMateriKeys] = useState(allSubMateriList[0].id);

  // Filtered scores
  const filteredScores = useMemo(() => {
    return allStudentScores.filter((sc) => {
      const matchKelas = selectedKelasFilter === 'all' || sc.kelas === selectedKelasFilter;
      const matchMateri = selectedMateriFilter === 'all' || sc.subMateriId === selectedMateriFilter;
      const matchSearch =
        !searchQuery.trim() ||
        sc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sc.kelas.toLowerCase().includes(searchQuery.toLowerCase());
      return matchKelas && matchMateri && matchSearch;
    });
  }, [allStudentScores, selectedKelasFilter, selectedMateriFilter, searchQuery]);

  // Statistics
  const totalSubmissions = filteredScores.length;
  const avgScore =
    totalSubmissions > 0
      ? Math.round(filteredScores.reduce((acc, curr) => acc + curr.totalScore, 0) / totalSubmissions)
      : 0;
  const passedCount = filteredScores.filter((sc) => sc.totalScore >= 75).length;
  const passRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;

  const handleExportCsv = () => {
    const headers = [
      'Tanggal,Nama Siswa,Kelas,Sub Materi,Nilai PG (70%),Nilai Esai (30%),Nilai Akhir,Kategori,Mode',
    ];
    const rows = filteredScores.map(
      (s) =>
        `"${new Date(s.completedAt).toLocaleString('id-ID')}","${s.studentName}","${s.kelas}","${s.subMateriTitle}",${s.pgScore},${s.essayScore},${s.totalScore},"${s.masteryLevel}","${s.mode}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_Biologi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    addAnnouncement(annTitle, annContent);
    setAnnTitle('');
    setAnnContent('');
    setShowAnnForm(false);
  };

  const selectedMateriForKeys = allSubMateriList.find((m) => m.id === selectedMateriKeys);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* 1. Header Banner Guru */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-purple-200">
            <ShieldCheck className="w-4 h-4 text-purple-300" />
            <span>Portal Manajemen Guru (Administrator)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Selamat Datang, {currentUser?.name || 'Bapak/Ibu Guru'}!
          </h1>

          <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
            NIP: {currentUser?.nip || '-'} • Pengampu Mata Pelajaran Biologi SMA. Di sini Anda dapat
            memantau rekap nilai siswa seluruh kelas, mengelola pengumuman, dan melihat kunci jawaban 75 soal kurikulum.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenGoogleSheets()}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Sheets Rekap</span>
          </button>

          <button
            onClick={onBackToStudentView}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Lihat Tampilan Siswa</span>
          </button>
        </div>
      </div>

      {/* Google Sheets Sync Prominent Hub */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Pusat Sinkronisasi Google Sheet Guru
            </span>
            {getSavedSpreadsheetId() && (
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                Spreadsheet Terhubung
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            Kirim Rekap Nilai Siswa ke Google Drive & Sheets Anda
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            {getSavedSpreadsheetId()
              ? `Spreadsheet siap menerima data. Klik tombol di kanan untuk menyinkronkan seluruh riwayat (${filteredScores.length} data nilai) ke Google Sheet.`
              : 'Belum ada Spreadsheet yang terhubung. Klik tombol di kanan untuk membuat Google Spreadsheet baru otomatis dengan 1-klik.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {getSavedSpreadsheetId() && (
            <a
              href={`https://docs.google.com/spreadsheets/d/${getSavedSpreadsheetId()}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <span>Buka Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={() => onOpenGoogleSheets(filteredScores)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Kirim {filteredScores.length} Nilai ke Google Sheet</span>
          </button>
        </div>
      </div>

      {/* 2. Statistical Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Jawaban Siswa</p>
            <p className="text-xl font-extrabold text-slate-800">{totalSubmissions} Latihan</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Rata-Rata Nilai</p>
            <p className="text-xl font-extrabold text-slate-800">{avgScore} / 100</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Ketuntasan (≥ 75)</p>
            <p className="text-xl font-extrabold text-slate-800">{passRate}% Tuntas</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pesan Pengumuman</p>
            <p className="text-xl font-extrabold text-slate-800">{announcements.length} Aktif</p>
          </div>
        </div>
      </div>

      {/* 3. Main Gradebook Table Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-5 bg-purple-600 rounded-full" />
              Rekapitulasi Nilai Seluruh Siswa
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Data nilai yang dikerjakan siswa secara mandiri (kombinasi 70% PG + 30% Esai).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={() => onOpenGoogleSheets(filteredScores)}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Sinkron {filteredScores.length} Nilai ke Google Sheet</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa atau kelas..."
              className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Filter Kelas */}
          <select
            value={selectedKelasFilter}
            onChange={(e) => setSelectedKelasFilter(e.target.value)}
            className="text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="all">Semua Kelas</option>
            <option value="XI MIPA 1">XI MIPA 1</option>
            <option value="XI MIPA 2">XI MIPA 2</option>
            <option value="XI MIPA 3">XI MIPA 3</option>
            <option value="XI IPS">XI IPS</option>
          </select>

          {/* Filter Sub Materi */}
          <select
            value={selectedMateriFilter}
            onChange={(e) => setSelectedMateriFilter(e.target.value)}
            className="text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="all">Semua Sub Materi (1-5)</option>
            {allSubMateriList.map((m) => (
              <option key={m.id} value={m.id}>
                Sub {m.number}: {m.shortTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 sm:p-4">Waktu</th>
                <th className="p-3 sm:p-4">Nama Siswa</th>
                <th className="p-3 sm:p-4">Kelas</th>
                <th className="p-3 sm:p-4">Sub Materi</th>
                <th className="p-3 sm:p-4 text-center">PG (70%)</th>
                <th className="p-3 sm:p-4 text-center">Esai (30%)</th>
                <th className="p-3 sm:p-4 text-center">Nilai Akhir</th>
                <th className="p-3 sm:p-4">Kategori</th>
                <th className="p-3 sm:p-4">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScores.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Tidak ada catatan nilai siswa yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredScores.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 sm:p-4 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(row.completedAt).toLocaleString('id-ID', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="p-3 sm:p-4 font-bold text-slate-900 whitespace-nowrap">
                      {row.studentName}
                    </td>
                    <td className="p-3 sm:p-4 text-slate-600 font-semibold whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs">
                        {row.kelas}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-slate-800 font-medium">
                      {row.subMateriTitle}
                    </td>
                    <td className="p-3 sm:p-4 text-center font-mono font-bold text-emerald-700">
                      {row.pgScore}
                    </td>
                    <td className="p-3 sm:p-4 text-center font-mono font-bold text-teal-700">
                      {row.essayScore}
                    </td>
                    <td className="p-3 sm:p-4 text-center font-mono font-extrabold text-sm text-slate-900">
                      <span
                        className={`px-2 py-1 rounded-lg ${
                          row.totalScore >= 75
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {row.totalScore}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          row.totalScore >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.totalScore >= 75
                            ? 'bg-blue-100 text-blue-800'
                            : row.totalScore >= 60
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {row.masteryLevel}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-slate-500 text-xs whitespace-nowrap">
                      {row.mode === 'competition' ? 'Cerdas Cermat' : 'Latihan'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Teacher Answer Keys & Rubrics Browser (Bank 75 Soal) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-600" />
              Kunci Jawaban & Rubrik Penilaian Guru (75 Soal)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Panduan transparansi bagi pendidik untuk melihat seluruh opsi benar dan kata kunci esai.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Pilih Materi:</span>
            <select
              value={selectedMateriKeys}
              onChange={(e) => setSelectedMateriKeys(e.target.value)}
              className="text-xs sm:text-sm p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {allSubMateriList.map((m) => (
                <option key={m.id} value={m.id}>
                  Sub {m.number}: {m.shortTitle}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedMateriForKeys && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span>Menampilkan 15 Soal untuk:</span>
              <span className="text-purple-700 font-extrabold">{selectedMateriForKeys.title}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 10 Soal PG */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Kunci 10 Pilihan Ganda:
                </h4>
                <div className="space-y-2">
                  {selectedMateriForKeys.questions
                    .filter((q) => q.type === 'multiple_choice')
                    .map((q) => (
                      <div
                        key={q.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Soal No. {q.number}</span>
                          <span className="px-2 py-0.5 rounded-md font-mono font-black bg-emerald-100 text-emerald-800">
                            Kunci: {q.correctAnswer}
                          </span>
                        </div>
                        <p className="text-slate-600 line-clamp-2">{q.question}</p>
                        <p className="text-[11px] text-slate-500 italic">
                          Pembahasan: {q.explanation}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* 5 Soal Esai & Rubrik */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  Rubrik Penilaian 5 Soal Esai:
                </h4>
                <div className="space-y-2">
                  {selectedMateriForKeys.questions
                    .filter((q) => q.type === 'essay')
                    .map((q) => (
                      <div
                        key={q.id}
                        className="p-3 rounded-xl bg-teal-50/50 border border-teal-200 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-teal-950">Soal No. {q.number} (Esai)</span>
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                            Maks 100 pt
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium">{q.question}</p>
                        {q.rubric && (
                          <div className="pt-1 border-t border-teal-100">
                            <span className="font-bold text-teal-900 block text-[11px]">
                              Kata Kunci Penilaian:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {q.rubric.keywords.map((kw, kwIdx) => (
                                <span
                                  key={kwIdx}
                                  className="px-1.5 py-0.5 bg-white border border-teal-300 text-teal-800 rounded text-[10px]"
                                >
                                  {kw.word} (+{kw.points}pt)
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Class Announcements Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Pengumuman / Arahan Belajar Siswa
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pesan yang Anda buat di sini akan tampil di Beranda aplikasi siswa.
            </p>
          </div>

          <button
            onClick={() => setShowAnnForm(!showAnnForm)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Pengumuman Baru</span>
          </button>
        </div>

        {/* Announcement Creator Form */}
        {showAnnForm && (
          <form
            onSubmit={handleCreateAnnouncement}
            className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3"
          >
            <h4 className="font-bold text-xs sm:text-sm text-purple-900">
              Form Pengumuman Baru:
            </h4>
            <input
              type="text"
              required
              value={annTitle}
              onChange={(e) => setAnnTitle(e.target.value)}
              placeholder="Judul Pengumuman (misal: Tugas Latihan Minggu Ini)"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
            <textarea
              required
              rows={3}
              value={annContent}
              onChange={(e) => setAnnContent(e.target.value)}
              placeholder="Tuliskan arahan tugas atau pesan instruksi untuk siswa..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAnnForm(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 shadow-sm"
              >
                Terbitkan Pengumuman
              </button>
            </div>
          </form>
        )}

        {/* Announcement List */}
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-700">{ann.authorName}</span>
                  <span className="text-xs text-slate-400">• {ann.createdAt}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">{ann.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ann.content}</p>
              </div>

              <button
                onClick={() => deleteAnnouncement(ann.id)}
                title="Hapus Pengumuman"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
