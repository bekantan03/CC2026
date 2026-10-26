import React, { useState } from 'react';
import { useAuth, DEFAULT_SISWA_DEMO, DEFAULT_GURU_DEMO } from '../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  User,
  Sparkles,
  ArrowRight,
  KeyRound,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Award,
  Layers,
} from 'lucide-react';

export const LoginGatekeeperScreen: React.FC = () => {
  const { loginAsSiswa, loginAsGuru } = useAuth();
  const [activeTab, setActiveTab] = useState<'siswa' | 'guru'>('siswa');

  // Siswa Form State
  const [siswaName, setSiswaName] = useState('');
  const [siswaKelas, setSiswaKelas] = useState('XI MIPA 1');
  const [siswaNis, setSiswaNis] = useState('');

  // Guru Form State
  const [guruName, setGuruName] = useState('');
  const [guruNip, setGuruNip] = useState('');
  const [guruPin, setGuruPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleSubmitSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siswaName.trim()) {
      alert('Silakan ketik nama lengkap Anda terlebih dahulu.');
      return;
    }
    loginAsSiswa(siswaName, siswaKelas, siswaNis);
  };

  const handleSubmitGuru = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (guruPin !== 'guru123' && guruPin !== 'admin' && guruPin.trim() !== '') {
      setPinError('PIN Guru salah! Gunakan PIN default: guru123');
      return;
    }

    loginAsGuru(guruName || 'Guru Biologi SMA', guruNip);
  };

  const handleQuickDemoSiswa = () => {
    loginAsSiswa(DEFAULT_SISWA_DEMO.name, DEFAULT_SISWA_DEMO.kelas || 'XI MIPA 1', DEFAULT_SISWA_DEMO.nis);
  };

  const handleQuickDemoGuru = () => {
    loginAsGuru(DEFAULT_GURU_DEMO.name, DEFAULT_GURU_DEMO.nip);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-400 selection:text-emerald-950 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl space-y-6">
        {/* App Title Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mx-auto transform hover:rotate-3 transition-transform">
            <BookOpen className="w-9 h-9" />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Cerdas Cermat Biologi SMA
          </h1>

          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-md mx-auto leading-relaxed">
            Platform Belajar Kurikulum Mandiri, Bank 75 Soal HOTS & Esai, serta Rekapitulasi Nilai Google Sheets
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 backdrop-blur-lg">
          {/* Role Tab Selector */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
            <button
              onClick={() => {
                setActiveTab('siswa');
                setPinError('');
              }}
              className={`flex-1 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'siswa'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Masuk sebagai Siswa</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('guru');
                setPinError('');
              }}
              className={`flex-1 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'guru'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Masuk sebagai Guru (Admin)</span>
            </button>
          </div>

          {/* TAB 1: FORM SISWA */}
          {activeTab === 'siswa' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Quick Demo Button */}
              <button
                type="button"
                onClick={handleQuickDemoSiswa}
                className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Masuk Cepat Demo:{' '}
                    <strong>Budi Pratama (XI MIPA 1)</strong>
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Atau Masukkan Nama Anda Sendiri
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              {/* Form Input Siswa */}
              <form onSubmit={handleSubmitSiswa} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Nama Lengkap Siswa <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Sinkron otomatis ke Google Sheet
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={siswaName}
                      onChange={(e) => setSiswaName(e.target.value)}
                      placeholder="Ketik nama lengkap Anda (misal: Ahmad Fauzan)"
                      className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-slate-800"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Kelas SMA
                    </label>
                    <select
                      value={siswaKelas}
                      onChange={(e) => setSiswaKelas(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-700 cursor-pointer"
                    >
                      <option value="XI MIPA 1">XI MIPA 1</option>
                      <option value="XI MIPA 2">XI MIPA 2</option>
                      <option value="XI MIPA 3">XI MIPA 3</option>
                      <option value="XI MIPA 4">XI MIPA 4</option>
                      <option value="XI MIPA 5">XI MIPA 5</option>
                      <option value="XI IPS 1">XI IPS 1</option>
                      <option value="XI IPS 2">XI IPS 2</option>
                      <option value="X MIPA">X MIPA</option>
                      <option value="XII MIPA">XII MIPA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      NIS (Opsional)
                    </label>
                    <input
                      type="text"
                      value={siswaNis}
                      onChange={(e) => setSiswaNis(e.target.value)}
                      placeholder="Nomor Induk Siswa"
                      className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>

                {/* Google Sheet Sync Info */}
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Nama dan kelas ini akan otomatis tercatat di <strong>Google Sheets</strong> dan{' '}
                    <strong>Rapor Evaluasi PDF</strong> saat Anda menyelesaikan kuis.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Mulai Belajar & Masuk Aplikasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: FORM GURU (ADMIN) */}
          {activeTab === 'guru' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Quick Demo Button for Teacher */}
              <button
                type="button"
                onClick={handleQuickDemoGuru}
                className="w-full p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100/90 border border-purple-200 text-purple-900 text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>
                    Masuk Cepat Demo:{' '}
                    <strong>Ibu Dra. Siti Rahmawati, M.Pd</strong>
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-700 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Atau Masuk Akun Guru Anda
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              {/* Form Input Guru */}
              <form onSubmit={handleSubmitGuru} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nama Lengkap Guru / Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={guruName}
                    onChange={(e) => setGuruName(e.target.value)}
                    placeholder="Contoh: Dra. Siti Rahmawati, M.Pd"
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    NIP Guru (Opsional)
                  </label>
                  <input
                    type="text"
                    value={guruNip}
                    onChange={(e) => setGuruNip(e.target.value)}
                    placeholder="Contoh: 197805122003122001"
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-800">
                      PIN Keamanan Guru (Admin)
                    </label>
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-md">
                      Default PIN: guru123
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={guruPin}
                      onChange={(e) => setGuruPin(e.target.value)}
                      placeholder="Masukkan PIN (default: guru123)"
                      className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 focus:bg-white text-slate-800"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
                  </div>
                  {pinError && (
                    <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{pinError}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-sm shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Masuk ke Dashboard Guru (Admin)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Feature Highlights Strip */}
        <div className="grid grid-cols-3 gap-3 text-center text-white/80 text-xs">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <Layers className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="font-bold block text-white text-[11px]">5 Sub Materi</span>
            <span className="text-[9px] text-emerald-200">Kurikulum SMA</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="font-bold block text-white text-[11px]">75 Soal HOTS</span>
            <span className="text-[9px] text-amber-200">PG & Esai Rubrik</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="font-bold block text-white text-[11px]">Google Sheets</span>
            <span className="text-[9px] text-cyan-200">Sinkron Otomatis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
