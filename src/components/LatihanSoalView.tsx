import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SubMateri, Question, QuestionChoice } from '../types/biology';
import { evaluateEssayLocally, evaluateEssayWithGemini, EssayAutoEvaluationResult } from '../utils/essayEvaluator';
import {
  Clock,
  Sparkles,
  Shuffle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  Zap,
  Info,
  Check,
  RotateCcw,
} from 'lucide-react';

interface LatihanSoalViewProps {
  subMateri: SubMateri;
  onFinishQuiz: (data: {
    pgAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>;
    essayAnswers: Record<string, string>;
    essayScores: Record<string, number>;
    essayFeedback: Record<string, string>;
    timeSpentSeconds: number;
    mode: 'practice' | 'competition';
  }) => void;
}

export const LatihanSoalView: React.FC<LatihanSoalViewProps> = ({
  subMateri,
  onFinishQuiz,
}) => {
  const [mode, setMode] = useState<'practice' | 'competition'>('practice');
  const [isShuffled, setIsShuffled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Answers State
  const [pgAnswers, setPgAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [essayScores, setEssayScores] = useState<Record<string, number>>({});
  const [essayEvaluationResults, setEssayEvaluationResults] = useState<Record<string, EssayAutoEvaluationResult>>({});
  const [evaluatingEssayId, setEvaluatingEssayId] = useState<string | null>(null);

  // Timer & Competition State
  const [timerSeconds, setTimerSeconds] = useState(45); // 45s per question in competition mode
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Prepare Question List (with shuffle support)
  const questionList = useMemo(() => {
    let list = [...subMateri.questions];
    if (isShuffled) {
      // Deterministic / random shuffle
      list = [...list].sort(() => Math.random() - 0.5);
    }
    return list;
  }, [subMateri.questions, isShuffled]);

  const currentQ: Question = questionList[currentIndex] || questionList[0];

  // Timer effect for Competition Mode
  useEffect(() => {
    if (mode === 'competition') {
      setTimerSeconds(45);
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            // Auto advance on timeout in competition mode
            handleNext();
            return 45;
          }
          return prev - 1;
        });
        setTotalTimeSpent((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, currentIndex]);

  const handleSelectPg = (choiceId: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setPgAnswers((prev) => ({
      ...prev,
      [currentQ.id]: choiceId,
    }));
  };

  const handleEvaluateEssay = async (q: Question) => {
    if (!q.rubric) return;
    const ans = essayAnswers[q.id] || '';
    setEvaluatingEssayId(q.id);

    try {
      const res = await evaluateEssayWithGemini(q.question, ans, q.rubric);
      setEssayEvaluationResults((prev) => ({
        ...prev,
        [q.id]: res,
      }));
      // Set initial score from rubric
      setEssayScores((prev) => ({
        ...prev,
        [q.id]: res.score,
      }));
    } catch {
      const fallback = evaluateEssayLocally(ans, q.rubric);
      setEssayEvaluationResults((prev) => ({
        ...prev,
        [q.id]: fallback,
      }));
      setEssayScores((prev) => ({
        ...prev,
        [q.id]: fallback.score,
      }));
    } finally {
      setEvaluatingEssayId(null);
    }
  };

  const handleNext = () => {
    if (currentIndex < questionList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    // Fill in default scores for any unanswered essay to 0
    const finalEssayScores: Record<string, number> = {};
    const finalEssayFeedback: Record<string, string> = {};

    questionList
      .filter((q) => q.type === 'essay')
      .forEach((q) => {
        finalEssayScores[q.id] = essayScores[q.id] !== undefined ? essayScores[q.id] : 0;
        finalEssayFeedback[q.id] = essayEvaluationResults[q.id]?.feedback || 'Belum dievaluasi';
      });

    onFinishQuiz({
      pgAnswers,
      essayAnswers,
      essayScores: finalEssayScores,
      essayFeedback: finalEssayFeedback,
      timeSpentSeconds: totalTimeSpent,
      mode,
    });
  };

  // Progress summary
  const answeredCount =
    Object.keys(pgAnswers).length +
    Object.keys(essayAnswers).filter((k) => essayAnswers[k]?.trim().length > 0).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header Control Bar (Mode Switch & Shuffle) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setMode('practice')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mode === 'practice'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Mode Latihan (Pembahasan Langsung)</span>
          </button>

          <button
            onClick={() => setMode('competition')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mode === 'competition'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Mode Cerdas Cermat (Timer)</span>
          </button>
        </div>

        {/* Shuffle & Timer status */}
        <div className="flex items-center gap-3">
          {mode === 'competition' && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold border ${
                timerSeconds <= 10
                  ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Sisa Waktu: {timerSeconds} dtk</span>
            </div>
          )}

          <button
            onClick={() => {
              setIsShuffled(!isShuffled);
              setCurrentIndex(0);
            }}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
              isShuffled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{isShuffled ? 'Urutan Diacak' : 'Acak Soal'}</span>
          </button>
        </div>
      </div>

      {/* 2. Question Navigation Stepper Grid (1-15) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
          <span>Navigasi 15 Soal (10 Pilihan Ganda + 5 Esai)</span>
          <span className="text-emerald-700">
            Terjawab: {answeredCount} / {questionList.length}
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-15 gap-1.5 sm:gap-2">
          {questionList.map((q, idx) => {
            const isPgAnswered = q.type === 'multiple_choice' && Boolean(pgAnswers[q.id]);
            const isEssayAnswered =
              q.type === 'essay' && Boolean(essayAnswers[q.id]?.trim().length);
            const isAnswered = isPgAnswered || isEssayAnswered;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-9 sm:h-10 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-emerald-600 ring-offset-2 bg-emerald-600 text-white shadow-sm'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{idx + 1}</span>
                <span className="text-[9px] opacity-75 font-mono">
                  {q.type === 'multiple_choice' ? 'PG' : 'Esai'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        {/* Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-800">
              Soal {currentIndex + 1} dari {questionList.length}
            </span>
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                currentQ.difficulty === 'Mudah'
                  ? 'bg-slate-100 text-slate-700'
                  : currentQ.difficulty === 'Sedang'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-amber-100 text-amber-900 font-extrabold'
              }`}
            >
              {currentQ.difficulty}
            </span>
            {currentQ.isHots && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-rose-500 text-white uppercase shadow-xs">
                HOTS / Analisis
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-slate-400">
            {currentQ.type === 'multiple_choice' ? 'Pilihan Ganda (Bobot 70%)' : 'Esai Uraian (Bobot 30%)'}
          </span>
        </div>

        {/* Stimulus Context Box (if any) */}
        {currentQ.stimulus && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
            <span className="font-bold text-slate-900 not-italic block mb-1">
              Stimulus / Kasus:
            </span>
            {currentQ.stimulus}
          </div>
        )}

        {/* Question Statement */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
          {currentQ.question}
        </h3>

        {/* MULTIPLE CHOICE OPTIONS (A, B, C, D, E) */}
        {currentQ.type === 'multiple_choice' && currentQ.options && (
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option) => {
              const isSelected = pgAnswers[currentQ.id] === option.id;
              const isCorrectAnswer = option.id === currentQ.correctAnswer;
              const hasAnswered = Boolean(pgAnswers[currentQ.id]);

              let buttonStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

              if (mode === 'practice' && hasAnswered) {
                if (isCorrectAnswer) {
                  buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200 font-semibold';
                } else if (isSelected && !isCorrectAnswer) {
                  buttonStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through opacity-80';
                }
              } else if (isSelected) {
                buttonStyle = 'bg-emerald-600 border-emerald-600 text-white shadow-md font-semibold';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectPg(option.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer text-xs sm:text-sm leading-relaxed ${buttonStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold shrink-0 text-xs ${
                      isSelected && (mode !== 'practice' || isCorrectAnswer)
                        ? 'bg-white text-emerald-700'
                        : isSelected && !isCorrectAnswer
                        ? 'bg-rose-200 text-rose-800'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {option.id}
                  </span>
                  <span className="mt-0.5">{option.text}</span>
                </button>
              );
            })}

            {/* In Practice Mode: Immediate Explanation */}
            {mode === 'practice' && pgAnswers[currentQ.id] && (
              <div
                className={`mt-6 p-5 rounded-2xl border ${
                  pgAnswers[currentQ.id] === currentQ.correctAnswer
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 font-extrabold text-sm mb-2">
                  {pgAnswers[currentQ.id] === currentQ.correctAnswer ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Jawaban Anda Benar! (Kunci: {currentQ.correctAnswer})</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>Jawaban Kurang Tepat! Kunci yang Benar adalah: {currentQ.correctAnswer}</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                  <span className="font-bold text-slate-900">Pembahasan: </span>
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ESSAY QUESTION AREA */}
        {currentQ.type === 'essay' && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Tulis Jawaban Uraian Anda:
              </label>
              <textarea
                rows={4}
                value={essayAnswers[currentQ.id] || ''}
                onChange={(e) =>
                  setEssayAnswers((prev) => ({
                    ...prev,
                    [currentQ.id]: e.target.value,
                  }))
                }
                placeholder="Ketik uraian jawaban Anda di sini dengan lengkap..."
                className="w-full p-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 focus:bg-white transition-all"
              />
            </div>

            {/* Check Answer Button */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleEvaluateEssay(currentQ)}
                disabled={evaluatingEssayId === currentQ.id || !essayAnswers[currentQ.id]?.trim()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>
                  {evaluatingEssayId === currentQ.id
                    ? 'Menganalisis Jawaban...'
                    : 'Periksa Jawaban (Evaluasi Otomatis & Rubrik)'}
                </span>
              </button>
            </div>

            {/* Evaluation Result & Scoring Rubric */}
            {essayEvaluationResults[currentQ.id] && currentQ.rubric && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-sm text-slate-800">
                      Hasil Evaluasi Otomatis:
                    </span>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Saran Nilai: {essayEvaluationResults[currentQ.id].score} / 100
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700">
                  {essayEvaluationResults[currentQ.id].feedback}
                </p>

                {/* Keyword Checklist */}
                <div>
                  <p className="text-xs font-bold text-slate-600 mb-2">
                    Pencapaian Kata Kunci / Konsep Rubrik:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {essayEvaluationResults[currentQ.id].matchedKeywords.map((kw, kIdx) => (
                      <div
                        key={kIdx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                          kw.matched
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {kw.matched ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                          )}
                          <span className="truncate">{kw.explanation}</span>
                        </div>
                        <span className="font-mono text-[10px] shrink-0 font-bold">
                          +{kw.points} pt
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model Answer Accordion */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-800 block">
                    Kunci Jawaban Model (Pembahasan):
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {currentQ.rubric.modelAnswer}
                  </p>
                </div>

                {/* Self Scoring Buttons */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs font-bold text-slate-700">
                    Swapenilaian Siswa (Konfirmasi Nilai Anda):
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[0, 25, 50, 75, 100].map((score) => {
                      const isChosen = (essayScores[currentQ.id] ?? 0) === score;
                      return (
                        <button
                          key={score}
                          onClick={() =>
                            setEssayScores((prev) => ({
                              ...prev,
                              [currentQ.id]: score,
                            }))
                          }
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            isChosen
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Bottom Stepper Actions */}
        <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center gap-2">
            {currentIndex < questionList.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Soal Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer animate-bounce"
              >
                <Check className="w-4 h-4" />
                <span>Selesai & Lihat Rapor Hasil</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
