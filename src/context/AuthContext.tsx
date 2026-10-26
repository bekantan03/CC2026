import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, StudentScoreRecord, TeacherAnnouncement } from '../types/auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole | null;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loginAsSiswa: (name: string, kelas: string, nis?: string) => void;
  loginAsGuru: (name: string, nip?: string) => boolean;
  logout: () => void;
  switchRoleQuick: (role: UserRole) => void;
  allStudentScores: StudentScoreRecord[];
  recordScore: (score: Omit<StudentScoreRecord, 'id' | 'completedAt'>) => void;
  announcements: TeacherAnnouncement[];
  addAnnouncement: (title: string, content: string, targetMateriId?: string) => void;
  deleteAnnouncement: (id: string) => void;
}

const STORAGE_KEY_CURRENT_USER = 'cerdas_cermat_user_v3';
const STORAGE_KEY_IS_LOGGED_IN = 'cerdas_cermat_is_logged_in_v3';
const STORAGE_KEY_CLASS_SCORES = 'cerdas_cermat_class_scores_v3';
const STORAGE_KEY_ANNOUNCEMENTS = 'cerdas_cermat_announcements_v3';
const STORAGE_KEY_STUDENT_NAME = 'cerdas_cermat_student_name_v1';

export const DEFAULT_SISWA_DEMO: UserProfile = {
  id: 'siswa-demo-1',
  name: 'Budi Pratama',
  role: 'siswa',
  kelas: 'XI MIPA 1',
  nis: '20241101',
  avatarColor: 'bg-emerald-500',
  createdAt: new Date().toISOString(),
};

export const DEFAULT_GURU_DEMO: UserProfile = {
  id: 'guru-demo-1',
  name: 'Ibu Dra. Siti Rahmawati, M.Pd',
  role: 'guru',
  nip: '197805122003122001',
  avatarColor: 'bg-purple-600',
  createdAt: new Date().toISOString(),
};

// Initial realistic class scores for teacher dashboard
const INITIAL_CLASS_SCORES: StudentScoreRecord[] = [
  {
    id: 'sc-1',
    studentId: 'std-1',
    studentName: 'Ahmad Zaki Fauzan',
    kelas: 'XI MIPA 1',
    subMateriId: 'keanekaragaman-hayati',
    subMateriTitle: 'Keanekaragaman Hayati',
    pgScore: 90,
    essayScore: 85,
    totalScore: 89,
    masteryLevel: 'Menguasai',
    completedAt: '2026-10-24T08:30:00Z',
    mode: 'practice',
  },
  {
    id: 'sc-2',
    studentId: 'std-2',
    studentName: 'Clara Anindya Putri',
    kelas: 'XI MIPA 1',
    subMateriId: 'keanekaragaman-hayati',
    subMateriTitle: 'Keanekaragaman Hayati',
    pgScore: 100,
    essayScore: 95,
    totalScore: 99,
    masteryLevel: 'Sangat Menguasai',
    completedAt: '2026-10-24T09:15:00Z',
    mode: 'competition',
  },
  {
    id: 'sc-3',
    studentId: 'std-3',
    studentName: 'Dhimas Arya Bagaskara',
    kelas: 'XI MIPA 2',
    subMateriId: 'ekosistem-dan-pencemaran',
    subMateriTitle: 'Ekosistem dan Pencemaran Lingkungan',
    pgScore: 70,
    essayScore: 65,
    totalScore: 69,
    masteryLevel: 'Cukup',
    completedAt: '2026-10-25T10:00:00Z',
    mode: 'practice',
  },
  {
    id: 'sc-4',
    studentId: 'std-4',
    studentName: 'Fatimah Az-Zahra',
    kelas: 'XI MIPA 2',
    subMateriId: 'sel-dan-jaringan',
    subMateriTitle: 'Sel dan Jaringan',
    pgScore: 90,
    essayScore: 90,
    totalScore: 90,
    masteryLevel: 'Sangat Menguasai',
    completedAt: '2026-10-25T11:20:00Z',
    mode: 'competition',
  },
  {
    id: 'sc-5',
    studentId: 'std-5',
    studentName: 'Gading Prasetyo',
    kelas: 'XI MIPA 1',
    subMateriId: 'sistem-pencernaan',
    subMateriTitle: 'Sistem Pencernaan',
    pgScore: 50,
    essayScore: 55,
    totalScore: 52,
    masteryLevel: 'Belum Menguasai',
    completedAt: '2026-10-25T14:10:00Z',
    mode: 'practice',
  },
];

const INITIAL_ANNOUNCEMENTS: TeacherAnnouncement[] = [
  {
    id: 'ann-1',
    authorName: 'Ibu Dra. Siti Rahmawati, M.Pd (Guru Biologi)',
    title: 'Tugas Mandiri: Selesaikan Latihan Soal Sub Materi 1 & 2',
    content: 'Anak-anak kelas XI MIPA, silakan pelajari materi dan diagram. Kerjakan 15 soal latihannya untuk persiapan penilaian formatif. Nilai otomatis tercatat ke rekap kelas!',
    createdAt: new Date().toLocaleDateString('id-ID', { dateStyle: 'long' }),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      const isLoggedIn = localStorage.getItem(STORAGE_KEY_IS_LOGGED_IN) === 'true';
      if (isLoggedIn && savedUser) {
        return JSON.parse(savedUser);
      }
      return null; // Require login before entering
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [allStudentScores, setAllStudentScores] = useState<StudentScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLASS_SCORES);
      return saved ? JSON.parse(saved) : INITIAL_CLASS_SCORES;
    } catch {
      return INITIAL_CLASS_SCORES;
    }
  });

  const [announcements, setAnnouncements] = useState<TeacherAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
        localStorage.setItem(STORAGE_KEY_IS_LOGGED_IN, 'true');
        // Synchronize student display name for Google Sheets & PDF
        const displayName = currentUser.kelas
          ? `${currentUser.name} (${currentUser.kelas})`
          : currentUser.name;
        localStorage.setItem(STORAGE_KEY_STUDENT_NAME, displayName);
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
        localStorage.setItem(STORAGE_KEY_IS_LOGGED_IN, 'false');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLASS_SCORES, JSON.stringify(allStudentScores));
    } catch (e) {
      console.error(e);
    }
  }, [allStudentScores]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch (e) {
      console.error(e);
    }
  }, [announcements]);

  const loginAsSiswa = (name: string, kelas: string, nis?: string) => {
    const cleanName = name.trim() || 'Siswa Berprestasi';
    const cleanKelas = kelas.trim() || 'XI MIPA 1';
    const newUser: UserProfile = {
      id: `siswa-${Date.now()}`,
      name: cleanName,
      role: 'siswa',
      kelas: cleanKelas,
      nis: nis?.trim() || `2024${Math.floor(1000 + Math.random() * 9000)}`,
      avatarColor: 'bg-emerald-500',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    // Explicitly sync student name for Google Sheet & PDF
    localStorage.setItem(STORAGE_KEY_STUDENT_NAME, `${cleanName} (${cleanKelas})`);
  };

  const loginAsGuru = (name: string, nip?: string) => {
    const cleanName = name.trim() || 'Guru Biologi SMA';
    const newGuru: UserProfile = {
      id: `guru-${Date.now()}`,
      name: cleanName,
      role: 'guru',
      nip: nip?.trim() || '198501012010011005',
      avatarColor: 'bg-purple-600',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newGuru);
    localStorage.setItem(STORAGE_KEY_STUDENT_NAME, cleanName);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.setItem(STORAGE_KEY_IS_LOGGED_IN, 'false');
  };

  const switchRoleQuick = (targetRole: UserRole) => {
    if (targetRole === 'guru') {
      loginAsGuru(DEFAULT_GURU_DEMO.name, DEFAULT_GURU_DEMO.nip);
    } else {
      loginAsSiswa(DEFAULT_SISWA_DEMO.name, DEFAULT_SISWA_DEMO.kelas || 'XI MIPA 1', DEFAULT_SISWA_DEMO.nis);
    }
  };

  const recordScore = (scoreData: Omit<StudentScoreRecord, 'id' | 'completedAt'>) => {
    const newRecord: StudentScoreRecord = {
      ...scoreData,
      id: `sc-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };

    setAllStudentScores((prev) => [newRecord, ...prev]);
  };

  const addAnnouncement = (title: string, content: string, targetMateriId?: string) => {
    const author = currentUser ? currentUser.name : 'Guru Biologi';
    const newAnn: TeacherAnnouncement = {
      id: `ann-${Date.now()}`,
      authorName: author,
      title,
      content,
      targetMateriId,
      createdAt: new Date().toLocaleDateString('id-ID', { dateStyle: 'long' }),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isLoggedIn: Boolean(currentUser),
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginAsSiswa,
        loginAsGuru,
        logout,
        switchRoleQuick,
        allStudentScores,
        recordScore,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
