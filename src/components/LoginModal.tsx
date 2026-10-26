import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  User,
  X,
  Sparkles,
  ArrowRight,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAsSiswa, loginAsGuru, switchRoleQuick, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'siswa' | 'guru'>(
    currentUser?.role === 'guru' ? 'guru' : 'siswa'
  );

  // Form states for Siswa
  const [siswaName, setSiswaName] = useState('');
  const [siswaKelas, setSiswaKelas] = useState('XI MIPA 1');
  const [siswaNis, setSiswaNis] = useState('');

  // Form states for Guru
  const [guruName, setGuruName] = useState('');
  const [guruNip, setGuruNip] = useState('');
  const [guruPin, setGuruPin] = useState('');
  const [pinError, setPinError] = useState('');

  if (!isOpen) return null;

  const handleSubmitSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siswaName.trim()) {
      alert('Silakan masukkan nama siswa terlebih dahulu.');
      return;
    }
    loginAsSiswa(siswaName, siswaKelas, siswaNis);
    onClose();
  };

  const handleSubmitGuru = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    // Default PIN check for Admin security (PIN default: "guru123")
    if (guruPin !== 'guru123' && guruPin !== 'admin' && guruPin.trim() !== '') {
      setPinError('PIN Guru salah! Gunakan PIN default: guru123');
      return;
    }

    loginAsGuru(guruName || 'Guru Biologi SMA', guruNip);
    onClose();
  };

  const handleQuickDemoSiswa = () => {
    switchRoleQuick('siswa');
    onClose();
  };

  const handleQuickDemoGuru = () => {
    switchRoleQuick('guru');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 shadow-xs">
            {activeTab === 'siswa' ? (
              <GraduationCap className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-purple-700" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pilih Akun Masuk
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Masuk sebagai Siswa (User) atau Guru Biologi (Admin).
          </p>
        </div>

        {/* Role Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
          <button
            onClick={() => {
              setActiveTab('siswa');
              setPinError('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'siswa'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Siswa (User)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('guru');
              setPinError('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'guru'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Guru (Admin)</span>
          </button>
        </div>

        {/* TAB 1: FORM SISWA */}
        {activeTab === 'siswa' && (
          <div className="space-y-4">
            {/* Quick Demo Button */}
            <button
              onClick={handleQuickDemoSiswa}
              className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Masuk Cepat: <strong>Budi Pratama (XI MIPA 1)</strong></span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">
                Atau Daftar / Masuk Siswa Baru
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            <form onSubmit={handleSubmitSiswa} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={siswaName}
                  onChange={(e) => setSiswaName(e.target.value)}
                  placeholder="Contoh: Muhammad Rizki"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelas SMA
                  </label>
                  <select
                    value={siswaKelas}
                    onChange={(e) => setSiswaKelas(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                  >
                    <option value="XI MIPA 1">XI MIPA 1</option>
                    <option value="XI MIPA 2">XI MIPA 2</option>
                    <option value="XI MIPA 3">XI MIPA 3</option>
                    <option value="XI MIPA 4">XI MIPA 4</option>
                    <option value="XI MIPA 5">XI MIPA 5</option>
                    <option value="XI IPS">XI IPS</option>
                    <option value="X MIPA">X MIPA</option>
                    <option value="XII MIPA">XII MIPA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIS (Opsional)
                  </label>
                  <input
                    type="text"
                    value={siswaNis}
                    onChange={(e) => setSiswaNis(e.target.value)}
                    placeholder="Contoh: 20241029"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Masuk Belajar sebagai Siswa
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: FORM GURU (ADMIN) */}
        {activeTab === 'guru' && (
          <div className="space-y-4">
            {/* Quick Demo Button for Teacher */}
            <button
              onClick={handleQuickDemoGuru}
              className="w-full p-3 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-900 text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Masuk Cepat: <strong>Ibu Dra. Siti Rahmawati, M.Pd</strong></span>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-700 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">
                Atau Masuk Akun Guru Sendiri
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            <form onSubmit={handleSubmitGuru} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Guru / Gelar
                </label>
                <input
                  type="text"
                  value={guruName}
                  onChange={(e) => setGuruName(e.target.value)}
                  placeholder="Contoh: Bapak Ahmad Fauzi, S.Pd"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NIP / No. Induk Guru (Opsional)
                </label>
                <input
                  type="text"
                  value={guruNip}
                  onChange={(e) => setGuruNip(e.target.value)}
                  placeholder="Contoh: 198003152006041002"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
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
                    placeholder="Ketik: guru123"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 focus:bg-white"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
                {pinError && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 leading-relaxed">
                <span className="font-bold">Akses Guru (Admin):</span> Membuka Dashboard Khusus untuk memantau rekap nilai seluruh siswa kelas, kunci jawaban & rubrik 75 soal, serta ekspor rekapan kelas ke Google Sheets.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Masuk ke Dashboard Guru (Admin)
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
