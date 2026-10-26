import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { SubMateriDetail } from './components/SubMateriDetail';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal } from './components/LoginModal';
import { LoginGatekeeperScreen } from './components/LoginGatekeeperScreen';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { allSubMateriList, getSubMateriById } from './data/allMateri';
import { exportCompleteCoursePdf } from './utils/pdfExport';
import {
  BookOpen,
  Download,
  Heart,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

function MainAppContent() {
  const { currentUser, role, isLoggedIn, isLoginModalOpen, setIsLoginModalOpen, recordScore } = useAuth();

  const [selectedSubMateriId, setSelectedSubMateriId] = useState<string | null>(null);
  const [initialTab, setInitialTab] = useState<'materi' | 'latihan' | 'hasil'>('materi');
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Google Sheets Modal State
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [pendingResultToSave, setPendingResultToSave] = useState<{
    studentName: string;
    subMateriTitle: string;
    pgScore: number;
    essayScore: number;
    totalScore: number;
    masteryLevel: string;
    mode: string;
  } | null>(null);

  // GATEKEEPER CHECK: Jika belum login, tampilkan layar login gerbang utama (Siswa vs Guru)
  if (!isLoggedIn || !currentUser) {
    return <LoginGatekeeperScreen />;
  }

  const selectedSub = selectedSubMateriId ? getSubMateriById(selectedSubMateriId) : null;

  const handleSelectSubMateri = (id: string, tab: 'materi' | 'latihan' | 'hasil' = 'materi') => {
    setIsAdminDashboardOpen(false);
    setSelectedSubMateriId(id);
    setInitialTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setIsAdminDashboardOpen(false);
    setSelectedSubMateriId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGoogleSheets = () => {
    setPendingResultToSave(null);
    setIsSheetsModalOpen(true);
  };

  const handleOpenSheetsToSave = (result: {
    studentName: string;
    subMateriTitle: string;
    pgScore: number;
    essayScore: number;
    totalScore: number;
    masteryLevel: string;
    mode: string;
  }) => {
    // Record into class gradebook automatically
    if (selectedSub && currentUser) {
      recordScore({
        studentId: currentUser.id,
        studentName: currentUser.name,
        kelas: currentUser.kelas || 'XI MIPA 1',
        subMateriId: selectedSub.id,
        subMateriTitle: selectedSub.title,
        pgScore: result.pgScore,
        essayScore: result.essayScore,
        totalScore: result.totalScore,
        masteryLevel: result.masteryLevel,
        mode: result.mode as 'practice' | 'competition',
      });
    }

    setPendingResultToSave(result);
    setIsSheetsModalOpen(true);
  };

  const handleToggleAdminDashboard = () => {
    setIsAdminDashboardOpen((prev) => !prev);
    setSelectedSubMateriId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar
        currentSubMateriId={selectedSubMateriId}
        onNavigateHome={handleNavigateHome}
        onSelectSubMateri={(id) => handleSelectSubMateri(id, 'materi')}
        onOpenGoogleSheets={handleOpenGoogleSheets}
        onOpenAdminDashboard={handleToggleAdminDashboard}
        isAdminViewActive={isAdminDashboardOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isAdminDashboardOpen && role === 'guru' ? (
          <AdminDashboard
            onBackToStudentView={() => setIsAdminDashboardOpen(false)}
            onOpenGoogleSheets={handleOpenGoogleSheets}
          />
        ) : selectedSub ? (
          <SubMateriDetail
            key={selectedSub.id}
            subMateri={selectedSub}
            initialTab={initialTab}
            onBackToHome={handleNavigateHome}
            onSelectSubMateri={handleSelectSubMateri}
            onOpenGoogleSheetsToSave={handleOpenSheetsToSave}
          />
        ) : (
          <HomeView
            onSelectSubMateri={handleSelectSubMateri}
            onOpenGoogleSheets={handleOpenGoogleSheets}
            onOpenAdminDashboard={handleToggleAdminDashboard}
          />
        )}
      </main>

      {/* Role Login Modal (Siswa / Guru) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Google Sheets Management & Saving Modal */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        pendingResultToSave={pendingResultToSave}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              CC
            </div>
            <span className="font-bold text-slate-700">Cerdas Cermat Biologi SMA</span>
            <span>— Bahan Belajar Interaktif & Bank Soal HOTS Mandiri</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-purple-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ganti Akun (Siswa / Guru)</span>
            </button>
            <span>•</span>
            <button
              onClick={handleOpenGoogleSheets}
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Sheets Rekap</span>
            </button>
            <span>•</span>
            <button
              onClick={() => exportCompleteCoursePdf()}
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Materi Lengkap (PDF)</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
