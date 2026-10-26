import { QuizAttemptRecord } from '../types/biology';

const STORAGE_KEY_ATTEMPTS = 'cerdas_cermat_attempts_v1';
const STORAGE_KEY_BOOKMARKS = 'cerdas_cermat_bookmarks_v1';
const STORAGE_KEY_STUDENT_NAME = 'cerdas_cermat_student_name_v1';

export const getStoredAttempts = (): Record<string, QuizAttemptRecord> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveQuizAttempt = (record: QuizAttemptRecord): void => {
  try {
    const all = getStoredAttempts();
    all[record.subMateriId] = record;
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save quiz attempt', e);
  }
};

export const getStudentName = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEY_STUDENT_NAME) || 'Siswa Berprestasi';
  } catch {
    return 'Siswa Berprestasi';
  }
};

export const saveStudentName = (name: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY_STUDENT_NAME, name);
  } catch (e) {
    console.error('Failed to save student name', e);
  }
};
