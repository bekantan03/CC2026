import { getAccessToken } from './googleAuth';
import { SubMateri, QuizAttemptRecord } from '../types/biology';

const STORAGE_KEY_SPREADSHEET_ID = 'cerdas_cermat_spreadsheet_id_v1';

export const getSavedSpreadsheetId = (): string | null => {
  return localStorage.getItem(STORAGE_KEY_SPREADSHEET_ID);
};

export const setSavedSpreadsheetId = (id: string): void => {
  localStorage.setItem(STORAGE_KEY_SPREADSHEET_ID, id);
};

export interface SheetRowRecord {
  timestamp: string;
  studentName: string;
  subMateriTitle: string;
  pgScore: number;
  essayScore: number;
  totalScore: number;
  masteryLevel: string;
}

/**
 * Creates a brand new Google Spreadsheet with headers formatted for student biology quiz grades.
 */
export const createStudentGradeSpreadsheet = async (): Promise<{
  spreadsheetId: string;
  spreadsheetUrl: string;
}> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Token Google OAuth tidak ditemukan. Silakan masuk terlebih dahulu.');

  const title = `Rekap Nilai Siswa - Cerdas Cermat Biologi SMA (${new Date().toLocaleDateString('id-ID')})`;

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: 'Rekap Nilai',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat Google Spreadsheet baru.');
  }

  const data = await res.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl;

  // Insert Header Row
  const headerValues = [
    [
      'Waktu Pengerjaan',
      'Nama Siswa',
      'Sub Materi',
      'Nilai PG (70%)',
      'Nilai Esai (30%)',
      'Nilai Akhir',
      'Kategori Penguasaan',
      'Mode Latihan',
    ],
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Rekap Nilai!A1:H1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: headerValues,
      }),
    }
  );

  setSavedSpreadsheetId(spreadsheetId);
  return { spreadsheetId, spreadsheetUrl };
};

/**
 * Appends a student quiz result to the Google Sheet.
 */
export const appendStudentResultToSheet = async (
  spreadsheetId: string,
  record: {
    studentName: string;
    subMateriTitle: string;
    pgScore: number;
    essayScore: number;
    totalScore: number;
    masteryLevel: string;
    mode: string;
  }
): Promise<{ updatedRows: number; spreadsheetUrl: string }> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Belum masuk akun Google. Silakan Sign In terlebih dahulu.');

  const nowStr = new Date().toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const rowData = [
    [
      nowStr,
      record.studentName,
      record.subMateriTitle,
      record.pgScore,
      record.essayScore,
      record.totalScore,
      record.masteryLevel,
      record.mode === 'competition' ? 'Cerdas Cermat (Timer)' : 'Mode Latihan',
    ],
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Rekap Nilai!A1:H1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rowData,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal menyimpan nilai ke Google Sheet.');
  }

  const result = await res.json();
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return {
    updatedRows: result.updates?.updatedRows || 1,
    spreadsheetUrl,
  };
};

/**
 * Reads existing student records from the Google Sheet for live in-app preview.
 */
export const fetchStudentRecordsFromSheet = async (
  spreadsheetId: string
): Promise<string[][]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Belum masuk akun Google.');

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Rekap Nilai!A1:H100`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.values || [];
};
