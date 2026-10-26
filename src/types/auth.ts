export type UserRole = 'siswa' | 'guru';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  kelas?: string; // For siswa: e.g. "XI MIPA 1"
  nis?: string;
  nip?: string;   // For guru
  avatarColor?: string;
  createdAt: string;
}

export interface StudentScoreRecord {
  id: string;
  studentId: string;
  studentName: string;
  kelas: string;
  subMateriId: string;
  subMateriTitle: string;
  pgScore: number;
  essayScore: number;
  totalScore: number;
  masteryLevel: string;
  completedAt: string;
  mode: 'practice' | 'competition';
}

export interface TeacherAnnouncement {
  id: string;
  authorName: string;
  title: string;
  content: string;
  targetMateriId?: string;
  createdAt: string;
}
