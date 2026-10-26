import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  Award,
  Zap,
  Target,
  FileText,
  Activity,
  Layers,
  HeartPulse,
  Flame,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { SubMateri } from '../types/biology';
import { allSubMateriList } from '../data/allMateri';
import { getStoredAttempts } from '../utils/storage';
import { exportCompleteCoursePdf, exportSingleSubMateriPdf } from '../utils/pdfExport';

interface HomeViewProps {
  onSelectSubMateri: (id: string, initialTab?: 'materi' | 'latihan' | 'hasil') => void;
  onOpenGoogleSheets?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectSubMateri, onOpenGoogleSheets }) => {
  const attempts = getStoredAttempts();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Overall Statistics
  const completedCount = Object.keys(attempts).length;
  const totalSubMateri = allSubMateriList.length;
  const averageScore =
    completedCount > 0
      ? Math.round(
          Object.values(attempts).reduce((acc, curr) => acc + curr.totalScore, 0) / completedCount
        )
      : 0;

  const handleDownloadSubPdf = (e: React.MouseEvent, sub: SubMateri) => {
    e.stopPropagation();
    setDownloadingId(sub.id);
    setTimeout(() => {
      exportSingleSubMateriPdf(sub);
      setDownloadingId(null);
    }, 150);
  };

  const getSubMateriIcon = (num: number) => {
    switch (num) {
      case 1:
        return <Compass className="w-6 h-6" />;
      case 2:
        return <Activity className="w-6 h-6" />;
      case 3:
        return <Layers className="w-6 h-6" />;
      case 4:
        return <Flame className="w-6 h-6" />;
      case 5:
        return <HeartPulse className="w-6 h-6" />;
      default:
        return <BookOpen className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 sm:p-10 lg:p-12 shadow-xl shadow-emerald-900/10">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/4 -top-16 w-60 h-60 rounded-full bg-teal-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold tracking-wide">
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Platform Pembelajaran Biologi SMA Interaktif</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Kuasai Konsep Biologi dengan Cepat, Akurat, & Menyenangkan!
          </h1>

          <p className="text-emerald-50 text-sm sm:text-base leading-relaxed max-w-2xl">
            Pelajari 5 sub materi inti kurikulum SMA lengkap dengan rangkuman terstruktur, diagram
            berlabel Indonesia, alur langkah biologis, serta latihan 75 soal HOTS dengan evaluasi
            otomatis.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectSubMateri(allSubMateriList[0].id, 'materi')}
              className="px-6 py-3 rounded-2xl bg-white text-emerald-800 font-extrabold text-sm sm:text-base hover:bg-emerald-50 active:scale-95 transition-all shadow-md shadow-black/10 flex items-center gap-2 cursor-pointer"
            >
              <span>Mulai Belajar Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => exportCompleteCoursePdf()}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold text-sm sm:text-base active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Materi Lengkap (PDF)</span>
            </button>

            {onOpenGoogleSheets && (
              <button
                onClick={onOpenGoogleSheets}
                className="px-5 py-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 backdrop-blur-md border border-emerald-300/40 text-emerald-100 font-bold text-sm sm:text-base active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                <span>Rekap Nilai Google Sheet</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Progress & Quick Stats Card */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Sub Materi</p>
            <p className="text-xl font-extrabold text-slate-800">5 Materi Inti</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Bank Soal HOTS</p>
            <p className="text-xl font-extrabold text-slate-800">75 Soal + Rubrik</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Materi Diselesaikan</p>
            <p className="text-xl font-extrabold text-slate-800">
              {completedCount} dari {totalSubMateri}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Rata-Rata Nilai</p>
            <p className="text-xl font-extrabold text-slate-800">
              {completedCount > 0 ? `${averageScore} / 100` : '-'}
            </p>
          </div>
        </div>
      </section>

      {/* 5 Cards Sub Materi Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-6 bg-emerald-600 rounded-full" />
              Daftar 5 Sub Materi Pembelajaran
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pilih sub materi untuk membaca materi ringkas, latihan 15 soal, atau melihat rapor evaluasi.
            </p>
          </div>

          <button
            onClick={() => exportCompleteCoursePdf()}
            className="self-start sm:self-auto text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Semua Materi (PDF)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSubMateriList.map((sub) => {
            const attempt = attempts[sub.id];
            const hasScore = Boolean(attempt);
            const scoreVal = attempt ? Math.round(attempt.totalScore) : 0;

            let badgeStatus = 'Belum Dikerjakan';
            let badgeBg = 'bg-slate-100 text-slate-600';
            if (hasScore) {
              if (scoreVal >= 90) {
                badgeStatus = `Sangat Menguasai (${scoreVal})`;
                badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
              } else if (scoreVal >= 75) {
                badgeStatus = `Menguasai (${scoreVal})`;
                badgeBg = 'bg-blue-100 text-blue-800 border-blue-200';
              } else if (scoreVal >= 60) {
                badgeStatus = `Cukup (${scoreVal})`;
                badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';
              } else {
                badgeStatus = `Perlu Evaluasi (${scoreVal})`;
                badgeBg = 'bg-rose-100 text-rose-800 border-rose-200';
              }
            }

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubMateri(sub.id, 'materi')}
                className="group relative bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Card Header & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                      {getSubMateriIcon(sub.number)}
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeBg}`}
                    >
                      {badgeStatus}
                    </span>
                  </div>

                  {/* Subtitle / Number */}
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                    Sub Materi 0{sub.number}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {sub.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {sub.summary}
                  </p>

                  {/* Learning Objectives Mini Checklist */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Fokus Capaian:
                    </p>
                    {sub.learningObjectives.slice(0, 2).map((tp) => (
                      <div key={tp.id} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{tp.title}</span>
                      </div>
                    ))}
                    {sub.learningObjectives.length > 2 && (
                      <p className="text-[11px] text-emerald-600 font-semibold pl-5">
                        +{sub.learningObjectives.length - 2} capaian kompetensi lainnya
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSubMateri(sub.id, 'latihan');
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                    >
                      Kuis Soal (15)
                    </button>

                    <button
                      onClick={(e) => handleDownloadSubPdf(e, sub)}
                      disabled={downloadingId === sub.id}
                      title="Unduh PDF Sub Materi Ini"
                      className="p-1.5 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Buka <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Kurikulum & Pedoman Belajar */}
      <section className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
          Panduan Belajar Cerdas Cermat Biologi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 mt-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs mb-2">
              1
            </span>
            <p className="font-bold text-slate-800">Pelajari Tab Materi</p>
            <p className="mt-1 text-slate-500">
              Pahami konsep kunci, tabel perbandingan organ, dan alur langkah bernomor pada setiap sistem.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
            <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs mb-2">
              2
            </span>
            <p className="font-bold text-slate-800">Uji di Tab Latihan Soal</p>
            <p className="mt-1 text-slate-500">
              Pilih Mode Latihan (pembahasan langsung) atau Mode Cerdas Cermat (dengan timer & skor tantangan).
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
            <span className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-700 font-bold flex items-center justify-center text-xs mb-2">
              3
            </span>
            <p className="font-bold text-slate-800">Evaluasi & Tindak Lanjut</p>
            <p className="mt-1 text-slate-500">
              Cek persentase penguasaan tiap tujuan pembelajaran dan unduh Rapor Evaluasi dalam format PDF.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
