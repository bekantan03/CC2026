import { EssayRubric } from '../types/biology';

export interface EssayAutoEvaluationResult {
  score: number;
  matchedKeywords: { word: string; points: number; explanation: string; matched: boolean }[];
  feedback: string;
  isAiEvaluated?: boolean;
}

export const evaluateEssayLocally = (
  userAnswer: string,
  rubric: EssayRubric
): EssayAutoEvaluationResult => {
  const cleanAnswer = userAnswer.toLowerCase().trim();
  if (!cleanAnswer) {
    return {
      score: 0,
      matchedKeywords: rubric.keywords.map((k) => ({ ...k, matched: false })),
      feedback: 'Jawaban masih kosong. Silakan tuliskan pemahaman Anda mengenai konsep ini.',
    };
  }

  let totalPoints = 0;
  const matchedKeywords = rubric.keywords.map((kw) => {
    // Split alternatives by '/'
    const alternatives = kw.word.toLowerCase().split('/').map((s) => s.trim());
    const matched = alternatives.some((alt) => {
      // Check for partial or full match
      const subWords = alt.split(' ').filter(Boolean);
      return subWords.every((w) => cleanAnswer.includes(w));
    });

    if (matched) {
      totalPoints += kw.points;
    }

    return {
      ...kw,
      matched,
    };
  });

  const finalScore = Math.min(100, Math.max(0, totalPoints));

  let feedback = '';
  if (finalScore >= 90) {
    feedback = 'Jawaban sangat lengkap dan ilmiah! Semua konsep kunci dan terminologi biologi telah diuraikan dengan tepat.';
  } else if (finalScore >= 70) {
    feedback = 'Pemahaman Anda sudah baik. Beberapa istilah atau argumen penjelas telah dikemukakan dengan benar.';
  } else if (finalScore >= 50) {
    feedback = 'Jawaban sudah menyentuh poin dasar, namun perlu melengkapi konsep kunci yang tertera pada rubrik penilaian.';
  } else {
    feedback = 'Jawaban masih memerlukan penguatan konsep. Cermati kembali model jawaban dan kata kunci di bawah ini.';
  }

  return {
    score: finalScore,
    matchedKeywords,
    feedback,
    isAiEvaluated: false,
  };
};

export const evaluateEssayWithGemini = async (
  question: string,
  userAnswer: string,
  rubric: EssayRubric
): Promise<EssayAutoEvaluationResult> => {
  // First evaluate with robust local rule
  const localResult = evaluateEssayLocally(userAnswer, rubric);

  // If Gemini API is available in browser through server proxy or injected key
  try {
    const response = await fetch('/api/evaluate-essay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userAnswer, rubric }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.score === 'number') {
        return {
          score: Math.min(100, Math.max(0, data.score)),
          matchedKeywords: data.matchedKeywords || localResult.matchedKeywords,
          feedback: data.feedback || localResult.feedback,
          isAiEvaluated: true,
        };
      }
    }
  } catch {
    // Graceful fallback to local rubric evaluation
  }

  return localResult;
};
