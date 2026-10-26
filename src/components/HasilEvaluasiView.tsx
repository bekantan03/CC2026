import React, { useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { SubMateri, QuizAttemptRecord, EvaluationResult, MasteryLevel } from '../types/biology';
import { exportEvaluationReportPdf } from '../utils/pdfExport';
import { getStudentName } from '../utils/storage';
import {
  Award,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BarChart3,
  BookOpen,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';

interface HasilEvaluasiViewProps {
  subMateri: SubMateri;
  attempt: QuizAttemptRecord | null;
  onRetakeQuiz: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onOpenGoogleSheetsToSave?: (result: {
    studentName: string;
    subMateriTitle: string;
    pgScore: number;
    essayScore: number;
    totalScore: number;
    masteryLevel: string;
    mode: string;
  }) => void;
}

export const HasilEvaluasiView: React.FC<HasilEvaluasiViewProps> = ({
  subMateri,
  attempt,
  onRetakeQuiz,
  onNavigateToSection,
  onOpenGoogleSheetsToSave,
}) => {
  // If no attempt yet, show friendly prompt
  if (!attempt) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center max-w-xl mx-auto space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-800">Belum Ada Riwayat Latihan</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Anda belum menyelesaikan latihan soal untuk sub materi{' '}
          <strong>{subMateri.title}</strong>. Silakan selesaikan 15 soal latihan terlebih dahulu
          untuk melihat rapor capaian dan rekomendasi belajar.
        </p>
        <button
          onClick={onRetakeQuiz}
          className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Mulai Latihan Soal Sekarang
        </button>
      </div>
    );
  }

  // Calculate Evaluation Breakdown
  const evaluation: EvaluationResult = useMemo(() => {
    // 1. Calculate PG Score (10 questions)
    const pgQuestions = subMateri.questions.filter((q) => q.type === 'multiple_choice');
    let pgCorrectCount = 0;
    pgQuestions.forEach((q) => {
      if (attempt.pgAnswers[q.id] === q.correctAnswer) {
        pgCorrectCount++;
      }
    });
    const pgScore = (pgCorrectCount / (pgQuestions.length || 1)) * 100;

    // 2. Calculate Essay Score (5 questions)
    const essayQuestions = subMateri.questions.filter((q) => q.type === 'essay');
    let totalEssayScorePoints = 0;
    essayQuestions.forEach((q) => {
      totalEssayScorePoints += attempt.essayScores[q.id] || 0;
    });
    const essayScore = totalEssayScorePoints / (essayQuestions.length || 1);

    // 3. Final Combined Score: 70% PG + 30% Essay
    const totalScore = Math.round(0.7 * pgScore + 0.3 * essayScore);

    // 4. Mastery Level Category
    let masteryLevel: MasteryLevel = 'Belum Menguasai';
    let masteryBadgeColor = 'bg-rose-100 text-rose-800 border-rose-300';

    if (totalScore >= 90) {
      masteryLevel = 'Sangat Menguasai';
      masteryBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (totalScore >= 75) {
      masteryLevel = 'Menguasai';
      masteryBadgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
    } else if (totalScore >= 60) {
      masteryLevel = 'Cukup';
      masteryBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    }

    // 5. Objective Breakdown
    const objectiveStats = subMateri.learningObjectives.map((obj) => {
      const relatedQuestions = subMateri.questions.filter((q) => q.objectiveId === obj.id);
      let earnedPoints = 0;
      let maxPoints = 0;

      relatedQuestions.forEach((q) => {
        if (q.type === 'multiple_choice') {
          maxPoints += 100;
          if (attempt.pgAnswers[q.id] === q.correctAnswer) {
            earnedPoints += 100;
          }
        } else {
          maxPoints += 100;
          earnedPoints += attempt.essayScores[q.id] || 0;
        }
      });

      const scorePercent = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 100;
      return {
        objective: obj,
        scorePercent,
        totalQuestions: relatedQuestions.length,
        isMastered: scorePercent >= 75,
      };
    });

    // 6. Recommendations Mapping
    const recommendations: EvaluationResult['recommendations'] = [];
    objectiveStats.forEach((st) => {
      if (st.scorePercent < 75) {
        // Find matching section in subMateri
        const matchingSec = subMateri.sections.find((s) =>
          s.id.includes(st.objective.id.replace('tp-', 'sec-').slice(0, 5))
        ) || subMateri.sections[0];

        recommendations.push({
          sectionId: matchingSec.id,
          sectionTitle: matchingSec.title,
          reason: `Penguasaan pada '${st.objective.title}' baru mencapai ${st.scorePercent}%.`,
          reviewTips: `Baca kembali ringkasan ${matchingSec.title}, perhatikan tabel perbandingan, dan cermati kotak 'Ingat!' terkait.`,
        });
      }
    });

    return {
      totalScore,
      pgScore,
      essayScore,
      masteryLevel,
      masteryBadgeColor,
      objectiveStats,
      recommendations,
    };
  }, [subMateri, attempt]);

  // Trigger celebration confetti on high score
  useEffect(() => {
    if (evaluation.totalScore >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if canvas not supported
      }
    }
  }, [evaluation.totalScore]);

  const handleDownloadReport = () => {
    const studentName = getStudentName();
    exportEvaluationReportPdf(subMateri, evaluation, studentName);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Overall Score Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/40 rounded-3xl p-6 sm:p-10 border border-emerald-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <span
            className={`inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${evaluation.masteryBadgeColor}`}
          >
            Kategori: {evaluation.masteryLevel}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rapor Evaluasi Belajar Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
            Skor dihitung dari pembobotan kurikulum: <strong>70% Pilihan Ganda</strong> +{' '}
            <strong>30% Esai Uraian</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs sm:text-sm">
            <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs font-bold text-slate-700">
              Nilai PG (70%): <span className="text-emerald-700">{Math.round(evaluation.pgScore)}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs font-bold text-slate-700">
              Nilai Esai (30%): <span className="text-teal-700">{Math.round(evaluation.essayScore)}</span>
            </div>
          </div>
        </div>

        {/* Big Score Dial */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-600/25 ring-8 ring-emerald-100">
            <span className="text-3xl sm:text-4xl font-black">{evaluation.totalScore}</span>
            <span className="text-xs font-semibold opacity-90">dari 100</span>
          </div>
        </div>
      </div>

      {/* Google Sheets Sync Highlight Banner */}
      {onOpenGoogleSheetsToSave && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-emerald-950">
                Kirim Nilai Ini ke Google Sheet Guru
              </h4>
              <p className="text-xs text-emerald-800">
                Nama Siswa: <strong>{getStudentName()}</strong> • Nilai Akhir: <strong>{evaluation.totalScore} / 100</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              onOpenGoogleSheetsToSave({
                studentName: getStudentName(),
                subMateriTitle: subMateri.title,
                pgScore: Math.round(evaluation.pgScore),
                essayScore: Math.round(evaluation.essayScore),
                totalScore: evaluation.totalScore,
                masteryLevel: evaluation.masteryLevel,
                mode: attempt.mode,
              })
            }
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Simpan ke Google Sheet Guru</span>
          </button>
        </div>
      )}

      {/* 2. Capaian Per Tujuan Pembelajaran (Grafik Batang) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Persentase Penguasaan per Tujuan Pembelajaran
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
            Standar Tuntas: ≥ 75%
          </span>
        </div>

        <div className="space-y-5">
          {evaluation.objectiveStats.map((st) => (
            <div key={st.objective.id} className="space-y-2">
              <div className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <span className="font-extrabold text-emerald-700 mr-2">
                    [{st.objective.code}]
                  </span>
                  <span className="font-bold text-slate-800">{st.objective.title}</span>
                  <p className="text-xs text-slate-500 mt-0.5">{st.objective.description}</p>
                </div>
                <span
                  className={`font-black text-sm shrink-0 px-2.5 py-0.5 rounded-lg border ${
                    st.scorePercent >= 75
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {st.scorePercent}%
                </span>
              </div>

              {/* Bar Fill */}
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    st.scorePercent >= 90
                      ? 'bg-emerald-500'
                      : st.scorePercent >= 75
                      ? 'bg-teal-500'
                      : st.scorePercent >= 60
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(5, Math.min(100, st.scorePercent))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Rekomendasi Belajar Ulang dengan Direct Link */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Rekomendasi Tindak Lanjut Pembelajaran
          </h3>
        </div>

        {evaluation.recommendations.length === 0 ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="block text-sm font-bold text-emerald-950">
                Selamat! Seluruh Tujuan Pembelajaran Telah Dikuasai.
              </strong>
              Anda telah mencapai ketuntasan belajar di atas 75% untuk setiap indikator kompetensi.
              Pertahankan prestasi Anda atau coba sub materi berikutnya!
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-slate-600">
              Berdasarkan hasil analisis latihan, kami merekomendasikan Anda untuk mengulang bagian materi berikut:
            </p>
            {evaluation.recommendations.map((rec, rIdx) => (
              <div
                key={rIdx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-100/80 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>{rec.reason}</span>
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{rec.sectionTitle}</h4>
                  <p className="text-xs text-slate-500">{rec.reviewTips}</p>
                </div>

                <button
                  onClick={() => onNavigateToSection(rec.sectionId)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Pelajari Bagian Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Action Buttons (Ulangi Latihan, Simpan ke Google Sheet, & Unduh Rapor PDF) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <button
          onClick={onRetakeQuiz}
          className="px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-600" />
          <span>Ulangi Latihan Soal</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {onOpenGoogleSheetsToSave && (
            <button
              onClick={() =>
                onOpenGoogleSheetsToSave({
                  studentName: getStudentName(),
                  subMateriTitle: subMateri.title,
                  pgScore: Math.round(evaluation.pgScore),
                  essayScore: Math.round(evaluation.essayScore),
                  totalScore: evaluation.totalScore,
                  masteryLevel: evaluation.masteryLevel,
                  mode: attempt.mode,
                })
              }
              className="px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Simpan ke Google Sheet</span>
            </button>
          )}

          <button
            onClick={handleDownloadReport}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Rapor Evaluasi (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
