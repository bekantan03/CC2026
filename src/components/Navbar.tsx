import React, { useState } from 'react';
import { BookOpen, Download, Home, Sparkles, CheckCircle2, ChevronRight, Award, User, FileSpreadsheet } from 'lucide-react';
import { allSubMateriList } from '../data/allMateri';
import { exportCompleteCoursePdf } from '../utils/pdfExport';
import { getStudentName, saveStudentName } from '../utils/storage';

interface NavbarProps {
  currentSubMateriId: string | null;
  onNavigateHome: () => void;
  onSelectSubMateri: (id: string) => void;
  onOpenGoogleSheets: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSubMateriId,
  onNavigateHome,
  onSelectSubMateri,
  onOpenGoogleSheets,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');
  const [downloadPercent, setDownloadPercent] = useState(0);
  const [studentName, setStudentName] = useState(() => getStudentName());
  const [isEditingName, setIsEditingName] = useState(false);

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    setDownloadPercent(5);
    setDownloadMsg('Memulai penyusunan PDF...');

    setTimeout(() => {
      try {
        exportCompleteCoursePdf((pct, msg) => {
          setDownloadPercent(pct);
          setDownloadMsg(msg);
        });
      } catch (err) {
        console.error(err);
        alert('Gagal membuat PDF. Silakan coba lagi.');
      } finally {
        setTimeout(() => {
          setIsDownloading(false);
        }, 1200);
      }
    }, 100);
  };

  const handleSaveName = (newName: string) => {
    const trimmed = newName.trim() || 'Siswa Berprestasi';
    setStudentName(trimmed);
    saveStudentName(trimmed);
    setIsEditingName(false);
  };

  const currentSub = allSubMateriList.find((s) => s.id === currentSubMateriId);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Logo & Title */}
            <div
              onClick={onNavigateHome}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                    Cerdas Cermat Biologi
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 rounded-full border border-emerald-200">
                    SMA Kelas XI
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Materi Kurikulum Nasional & Bank Soal Interaktif
                </p>
              </div>
            </div>

            {/* Breadcrumb / Current Sub Materi Indicator */}
            {currentSub && (
              <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                <button
                  onClick={onNavigateHome}
                  className="hover:text-emerald-600 font-medium transition-colors"
                >
                  Beranda
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-emerald-700 truncate max-w-xs">
                  Sub {currentSub.number}: {currentSub.shortTitle}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Student Name Pill */}
              <div className="relative">
                {isEditingName ? (
                  <input
                    type="text"
                    defaultValue={studentName}
                    autoFocus
                    onBlur={(e) => handleSaveName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName(e.currentTarget.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    title="Klik untuk mengubah nama siswa"
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="max-w-[100px] sm:max-w-[130px] truncate">{studentName}</span>
                  </button>
                )}
              </div>

              {/* Google Sheets Integration Button */}
              <button
                onClick={onOpenGoogleSheets}
                title="Buka Rekapitulasi Nilai Google Sheets"
                className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Google Sheets</span>
              </button>

              {/* Unduh Materi Lengkap PDF Button */}
              <button
                onClick={handleDownloadAll}
                disabled={isDownloading}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Unduh Materi Lengkap (PDF)</span>
                <span className="sm:hidden">Unduh PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Download Progress Modal */}
      {isDownloading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
              <Download className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Menyusun Berkas PDF Lengkap</h3>
            <p className="text-xs text-slate-500 mt-1">{downloadMsg}</p>

            <div className="w-full bg-slate-100 rounded-full h-2.5 mt-5 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${downloadPercent}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-emerald-700 mt-2">{downloadPercent}% selesai</p>
          </div>
        </div>
      )}
    </>
  );
};
