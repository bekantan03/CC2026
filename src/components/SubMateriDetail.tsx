import React, { useState } from 'react';
import { SubMateri, QuizAttemptRecord } from '../types/biology';
import { allSubMateriList } from '../data/allMateri';
import { MateriView } from './MateriView';
import { LatihanSoalView } from './LatihanSoalView';
import { HasilEvaluasiView } from './HasilEvaluasiView';
import { exportSingleSubMateriPdf } from '../utils/pdfExport';
import { getStoredAttempts, saveQuizAttempt } from '../utils/storage';
import {
  ArrowLeft,
  Download,
  BookOpen,
  HelpCircle,
  Award,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface SubMateriDetailProps {
  subMateri: SubMateri;
  initialTab?: 'materi' | 'latihan' | 'hasil';
  onBackToHome: () => void;
  onSelectSubMateri: (id: string, initialTab?: 'materi' | 'latihan' | 'hasil') => void;
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

export const SubMateriDetail: React.FC<SubMateriDetailProps> = ({
  subMateri,
  initialTab = 'materi',
  onBackToHome,
  onSelectSubMateri,
  onOpenGoogleSheetsToSave,
}) => {
  const [activeTab, setActiveTab] = useState<'materi' | 'latihan' | 'hasil'>(initialTab);
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(() => getStoredAttempts());
  const [isDownloading, setIsDownloading] = useState(false);

  const currentAttempt = attempts[subMateri.id] || null;

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
      exportSingleSubMateriPdf(subMateri);
      setIsDownloading(false);
    }, 150);
  };

  const handleFinishQuiz = (data: {
    pgAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>;
    essayAnswers: Record<string, string>;
    essayScores: Record<string, number>;
    essayFeedback: Record<string, string>;
    timeSpentSeconds: number;
    mode: 'practice' | 'competition';
  }) => {
    // 1. Calculate PG score
    const pgQuestions = subMateri.questions.filter((q) => q.type === 'multiple_choice');
    let pgCorrect = 0;
    pgQuestions.forEach((q) => {
      if (data.pgAnswers[q.id] === q.correctAnswer) pgCorrect++;
    });
    const pgScore = Math.round((pgCorrect / (pgQuestions.length || 1)) * 100);

    // 2. Calculate Essay score
    const essayQuestions = subMateri.questions.filter((q) => q.type === 'essay');
    let essaySum = 0;
    essayQuestions.forEach((q) => {
      essaySum += data.essayScores[q.id] || 0;
    });
    const essayScore = Math.round(essaySum / (essayQuestions.length || 1));

    // 3. Combined Total Score (70% PG + 30% Essay)
    const totalScore = Math.round(0.7 * pgScore + 0.3 * essayScore);

    const record: QuizAttemptRecord = {
      subMateriId: subMateri.id,
      mode: data.mode,
      pgAnswers: data.pgAnswers,
      essayAnswers: data.essayAnswers,
      essayScores: data.essayScores,
      essayFeedback: data.essayFeedback,
      pgScore,
      essayScore,
      totalScore,
      objectiveBreakdown: {},
      timeSpentSeconds: data.timeSpentSeconds,
      completedAt: new Date().toISOString(),
    };

    saveQuizAttempt(record);
    setAttempts((prev) => ({ ...prev, [subMateri.id]: record }));
    setActiveTab('hasil');
  };

  const handleNavigateToSection = (secId: string) => {
    setTargetSectionId(secId);
    setActiveTab('materi');
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* 1. Sub Materi Top Navigation & Title Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Kembali ke Beranda</span>
          </button>

          {/* Sub Materi Quick Dropdown / Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Pindah Sub Materi:</span>
            <select
              value={subMateri.id}
              onChange={(e) => onSelectSubMateri(e.target.value, activeTab)}
              className="text-xs sm:text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {allSubMateriList.map((s) => (
                <option key={s.id} value={s.id}>
                  Sub {s.number}: {s.shortTitle}
                </option>
              ))}
            </select>

            {/* Unduh Sub PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              title="Unduh PDF Sub Materi Ini"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh PDF Materi Ini</span>
            </button>
          </div>
        </div>

        {/* Title & Badge */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
              Sub Materi 0{subMateri.number}
            </span>
            {currentAttempt && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                Nilai Terakhir: {currentAttempt.totalScore}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {subMateri.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {subMateri.summary}
          </p>
        </div>

        {/* 2. Three Main Tabs: (a) Materi, (b) Latihan Soal, (c) Hasil & Evaluasi */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('materi')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'materi'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>(a) Materi Pelajaran</span>
          </button>

          <button
            onClick={() => setActiveTab('latihan')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'latihan'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>(b) Latihan Soal (15 Soal)</span>
          </button>

          <button
            onClick={() => setActiveTab('hasil')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'hasil'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>(c) Hasil & Evaluasi</span>
            {currentAttempt && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Render Active Tab Content */}
      <main>
        {activeTab === 'materi' && (
          <MateriView
            subMateri={subMateri}
            targetSectionId={targetSectionId}
            onGoToQuiz={() => setActiveTab('latihan')}
          />
        )}

        {activeTab === 'latihan' && (
          <LatihanSoalView
            subMateri={subMateri}
            onFinishQuiz={handleFinishQuiz}
          />
        )}

        {activeTab === 'hasil' && (
          <HasilEvaluasiView
            subMateri={subMateri}
            attempt={currentAttempt}
            onRetakeQuiz={() => setActiveTab('latihan')}
            onNavigateToSection={handleNavigateToSection}
            onOpenGoogleSheetsToSave={onOpenGoogleSheetsToSave}
          />
        )}
      </main>
    </div>
  );
};
