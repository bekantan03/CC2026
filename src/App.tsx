import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { SubMateriDetail } from './components/SubMateriDetail';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { allSubMateriList, getSubMateriById } from './data/allMateri';
import { exportCompleteCoursePdf } from './utils/pdfExport';
import { BookOpen, Download, Heart, Sparkles, CheckCircle2, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [selectedSubMateriId, setSelectedSubMateriId] = useState<string | null>(null);
  const [initialTab, setInitialTab] = useState<'materi' | 'latihan' | 'hasil'>('materi');

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

  const selectedSub = selectedSubMateriId ? getSubMateriById(selectedSubMateriId) : null;

  const handleSelectSubMateri = (id: string, tab: 'materi' | 'latihan' | 'hasil' = 'materi') => {
    setSelectedSubMateriId(id);
    setInitialTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
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
    setPendingResultToSave(result);
    setIsSheetsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar
        currentSubMateriId={selectedSubMateriId}
        onNavigateHome={handleNavigateHome}
        onSelectSubMateri={(id) => handleSelectSubMateri(id, 'materi')}
        onOpenGoogleSheets={handleOpenGoogleSheets}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {selectedSub ? (
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
          />
        )}
      </main>

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

          <div className="flex items-center gap-4">
            <button
              onClick={handleOpenGoogleSheets}
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Sheets Nilai</span>
            </button>
            <span>•</span>
            <button
              onClick={() => exportCompleteCoursePdf()}
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Materi Lengkap (PDF)</span>
            </button>
            <span>•</span>
            <span>Kurikulum Biologi Nasional</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
