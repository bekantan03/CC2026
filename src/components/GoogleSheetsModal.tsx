import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, initAuth, googleSignIn, logout, getAccessToken } from '../utils/googleAuth';
import {
  createStudentGradeSpreadsheet,
  appendStudentResultToSheet,
  fetchStudentRecordsFromSheet,
  getSavedSpreadsheetId,
  setSavedSpreadsheetId,
} from '../utils/googleSheets';
import {
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Plus,
  RefreshCw,
  LogOut,
  AlertCircle,
  X,
  HelpCircle,
  Table,
} from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingResultToSave?: {
    studentName: string;
    subMateriTitle: string;
    pgScore: number;
    essayScore: number;
    totalScore: number;
    masteryLevel: string;
    mode: string;
  } | null;
  onSaveSuccess?: (url: string) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  pendingResultToSave,
  onSaveSuccess,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => getSavedSpreadsheetId() || '');
  const [inputSheetId, setInputSheetId] = useState('');
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [sheetRecords, setSheetRecords] = useState<string[][]>([]);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Mandatory confirmation dialog state for mutating Google Sheet
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (spreadsheetId && currentUser) {
      loadRecords(spreadsheetId);
    }
  }, [spreadsheetId, currentUser]);

  const loadRecords = async (id: string) => {
    setIsLoadingRecords(true);
    try {
      const records = await fetchStudentRecordsFromSheet(id);
      setSheetRecords(records);
    } catch {
      // ignore
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setStatusMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setStatusMsg({ type: 'success', text: `Berhasil terhubung sebagai ${res.user.displayName || res.user.email}` });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || 'Gagal masuk dengan akun Google.' });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setCurrentUser(null);
    setSheetRecords([]);
    setStatusMsg({ type: 'info', text: 'Anda telah keluar dari akun Google.' });
  };

  const handleCreateNewSheet = async () => {
    setIsCreatingSheet(true);
    setStatusMsg(null);
    try {
      const { spreadsheetId: newId, spreadsheetUrl } = await createStudentGradeSpreadsheet();
      setSpreadsheetId(newId);
      setStatusMsg({
        type: 'success',
        text: 'Google Spreadsheet baru berhasil dibuat dan siap menampung nilai siswa!',
      });
      loadRecords(newId);
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || 'Gagal membuat Google Spreadsheet baru.' });
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleApplyCustomId = () => {
    let cleanId = inputSheetId.trim();
    // Support full URL extraction (e.g. https://docs.google.com/spreadsheets/d/1BxiMVs0XR.../edit)
    const match = cleanId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      cleanId = match[1];
    }

    if (!cleanId) {
      setStatusMsg({ type: 'error', text: 'Masukkan ID atau URL Google Spreadsheet yang valid.' });
      return;
    }

    setSpreadsheetId(cleanId);
    setSavedSpreadsheetId(cleanId);
    setInputSheetId('');
    setStatusMsg({ type: 'success', text: 'ID Spreadsheet berhasil disimpan!' });
    loadRecords(cleanId);
  };

  const executeSaveToSheet = async () => {
    if (!pendingResultToSave || !spreadsheetId) return;
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const { spreadsheetUrl } = await appendStudentResultToSheet(spreadsheetId, pendingResultToSave);
      setStatusMsg({
        type: 'success',
        text: `Nilai siswa "${pendingResultToSave.studentName}" berhasil disimpan ke Google Sheets!`,
      });
      loadRecords(spreadsheetId);
      if (onSaveSuccess) onSaveSuccess(spreadsheetUrl);
      setShowConfirmDialog(false);
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || 'Gagal menulis ke Google Sheet.' });
      setShowConfirmDialog(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Integrasi Google Sheets
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Simpan rekapitulasi nilai dan hasil kerja siswa secara langsung ke Google Drive & Sheets.
            </p>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm flex items-start gap-3 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : statusMsg.type === 'error'
                ? 'bg-rose-50 text-rose-900 border border-rose-200'
                : 'bg-blue-50 text-blue-900 border border-blue-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>{statusMsg.text}</div>
          </div>
        )}

        {/* 1. Account Authentication Section */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status Akun Google:
              </p>
              {currentUser ? (
                <div className="flex items-center gap-2 mt-1">
                  {currentUser.photoURL && (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-7 h-7 rounded-full border border-slate-300"
                    />
                  )}
                  <div>
                    <span className="font-extrabold text-sm text-slate-800">
                      {currentUser.displayName || 'Guru / Siswa'}
                    </span>
                    <span className="text-xs text-slate-500 ml-1.5">({currentUser.email})</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600 mt-1">
                  Belum masuk. Masuk untuk mengizinkan aplikasi menulis ke Google Sheets Anda.
                </p>
              )}
            </div>

            {currentUser ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun</span>
              </button>
            ) : (
              /* Official Google Sign In Button */
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 active:scale-95 shadow-xs font-bold text-xs sm:text-sm text-slate-700 transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>{isSigningIn ? 'Menghubungkan...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Target Spreadsheet Configuration */}
        {currentUser && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Pilih atau Buat Spreadsheet Rekap Nilai:
              </label>
              {spreadsheetId && (
                <a
                  href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  <span>Buka di Google Sheets</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {spreadsheetId ? (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-emerald-950">
                      Spreadsheet Terhubung:
                    </p>
                    <p className="text-xs font-mono text-emerald-800 truncate">
                      ID: {spreadsheetId}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSpreadsheetId('')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shrink-0"
                >
                  Ganti
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleCreateNewSheet}
                  disabled={isCreatingSheet}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {isCreatingSheet
                      ? 'Sedang Membuat Spreadsheet Baru...'
                      : 'Buat Spreadsheet Rekap Nilai Baru Otomatis'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputSheetId}
                    onChange={(e) => setInputSheetId(e.target.value)}
                    placeholder="Atau tempel Link/ID Google Spreadsheet yang sudah ada..."
                    className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    onClick={handleApplyCustomId}
                    className="px-4 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    Pakai ID Ini
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Action to Save Pending Quiz Result */}
        {pendingResultToSave && currentUser && spreadsheetId && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">
                Siap Disimpan ke Google Sheet:
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                Nilai Akhir: {pendingResultToSave.totalScore}
              </span>
            </div>

            <div className="text-xs text-slate-700 space-y-1">
              <p>
                <strong>Siswa:</strong> {pendingResultToSave.studentName}
              </p>
              <p>
                <strong>Materi:</strong> {pendingResultToSave.subMateriTitle}
              </p>
              <p>
                <strong>Rincian:</strong> PG {pendingResultToSave.pgScore} | Esai{' '}
                {pendingResultToSave.essayScore} | Kategori: {pendingResultToSave.masteryLevel}
              </p>
            </div>

            {/* Save Button triggers Mandatory Explicit Confirmation Dialog */}
            <button
              onClick={() => setShowConfirmDialog(true)}
              disabled={isSaving}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Simpan Nilai Ini ke Google Sheet Sekarang</span>
            </button>
          </div>
        )}

        {/* 4. Live Preview of Existing Records in Sheet */}
        {spreadsheetId && currentUser && sheetRecords.length > 0 && (
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Table className="w-4 h-4 text-emerald-600" />
                <span>Pratinjau Data di Spreadsheet ({sheetRecords.length - 1} Baris Data):</span>
              </div>
              <button
                onClick={() => loadRecords(spreadsheetId)}
                disabled={isLoadingRecords}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingRecords ? 'animate-spin' : ''}`} />
                <span>Muat Ulang</span>
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                  <tr>
                    {sheetRecords[0]?.slice(0, 7).map((col, idx) => (
                      <th key={idx} className="p-2 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sheetRecords.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50">
                      {row.slice(0, 7).map((cell, cIdx) => (
                        <td key={cIdx} className="p-2 whitespace-nowrap text-slate-600">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Teacher Explanation / Guidance Box */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
          <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Cara Kerja:</strong> Aplikasi menggunakan Google Sheets API resmi untuk menambahkan satu baris nilai baru setiap kali siswa menyelesaikan latihan. File spreadsheet tersimpan aman langsung di Google Drive Anda sendiri dan dapat diunduh sebagai file Excel (XLSX) atau dibagikan ke siswa lain.
          </p>
        </div>
      </div>

      {/* MANDATORY USER CONFIRMATION DIALOG (FOR MUTATING WORKSPACE DATA) */}
      {showConfirmDialog && pendingResultToSave && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-extrabold text-lg text-slate-900">
                Konfirmasi Penyimpanan ke Google Sheet
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menambahkan 1 baris nilai berikut ke dalam Google Spreadsheet Anda?
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <p>
                <strong>Nama Siswa:</strong> {pendingResultToSave.studentName}
              </p>
              <p>
                <strong>Sub Materi:</strong> {pendingResultToSave.subMateriTitle}
              </p>
              <p>
                <strong>Nilai Akhir:</strong> {pendingResultToSave.totalScore} ({pendingResultToSave.masteryLevel})
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={executeSaveToSheet}
                disabled={isSaving}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan...' : 'Ya, Simpan Nilai'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
