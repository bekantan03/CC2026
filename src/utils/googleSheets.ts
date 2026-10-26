import { getAccessToken } from './googleAuth';
import { StudentScoreRecord } from '../types/auth';

const STORAGE_KEY_SPREADSHEET_ID = 'cerdas_cermat_spreadsheet_id_v1';

export const getSavedSpreadsheetId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_SPREADSHEET_ID);
  } catch {
    return null;
  }
};

export const setSavedSpreadsheetId = (id: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY_SPREADSHEET_ID, id);
  } catch (e) {
    console.error('Failed to save spreadsheet id', e);
  }
};

export interface SheetRowRecord {
  timestamp: string;
  studentName: string;
  kelas?: string;
  subMateriTitle: string;
  pgScore: number;
  essayScore: number;
  totalScore: number;
  masteryLevel: string;
  mode?: string;
}

/**
 * Resolves the appropriate sheet/tab name for the target spreadsheet.
 * Defaults to "'Rekap Nilai'", but inspects existing tabs so custom spreadsheets also work seamlessly.
 */
export const getTargetSheetName = async (spreadsheetId: string, token: string): Promise<string> => {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const sheets = data.sheets || [];
      const titles: string[] = sheets.map((s: any) => s.properties?.title).filter(Boolean);
      if (titles.includes('Rekap Nilai')) return "'Rekap Nilai'";
      if (titles.includes('Rekap_Nilai')) return 'Rekap_Nilai';
      if (titles.length > 0) return `'${titles[0]}'`;
    }
  } catch (e) {
    console.warn('Could not inspect sheet titles, falling back to default:', e);
  }
  return "'Rekap Nilai'";
};

/**
 * Creates a brand new Google Spreadsheet with headers formatted for student biology quiz grades.
 */
export const createStudentGradeSpreadsheet = async (): Promise<{
  spreadsheetId: string;
  spreadsheetUrl: string;
}> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Token Google OAuth tidak ditemukan. Silakan klik "Sign in with Google" terlebih dahulu.');

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
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Insert Header Row with 9 formatted columns
  const headerValues = [
    [
      'Waktu Pengerjaan',
      'Nama Siswa',
      'Kelas',
      'Sub Materi Biologi',
      'Nilai PG (70%)',
      'Nilai Esai (30%)',
      'Nilai Akhir',
      'Kategori Penguasaan',
      'Mode Latihan',
    ],
  ];

  const rangeParam = encodeURIComponent("'Rekap Nilai'!A1:I1");
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${rangeParam}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
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
 * Appends a single student quiz result to the Google Sheet.
 */
export const appendStudentResultToSheet = async (
  spreadsheetId: string,
  record: {
    studentName: string;
    kelas?: string;
    subMateriTitle: string;
    pgScore: number;
    essayScore: number;
    totalScore: number;
    masteryLevel: string;
    mode: string;
  }
): Promise<{ updatedRows: number; spreadsheetUrl: string }> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Belum masuk akun Google. Silakan klik "Sign in with Google" terlebih dahulu.');

  const nowStr = new Date().toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Extract class from studentName if format is "Nama (Kelas)"
  let cleanName = record.studentName;
  let cleanKelas = record.kelas || 'XI MIPA';
  const match = record.studentName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    cleanName = match[1].trim();
    if (!record.kelas) {
      cleanKelas = match[2].trim();
    }
  }

  const rowData = [
    [
      nowStr,
      cleanName,
      cleanKelas,
      record.subMateriTitle,
      record.pgScore,
      record.essayScore,
      record.totalScore,
      record.masteryLevel,
      record.mode === 'competition' ? 'Cerdas Cermat (Timer)' : 'Mode Latihan',
    ],
  ];

  const targetSheet = await getTargetSheetName(spreadsheetId, token);
  const rangeParam = encodeURIComponent(`${targetSheet}!A:I`);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${rangeParam}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
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
 * Appends multiple student quiz records in a single batch to Google Sheet.
 * Used by Guru (Admin) to sync the entire class gradebook at once!
 */
export const appendBatchScoresToSheet = async (
  spreadsheetId: string,
  records: StudentScoreRecord[]
): Promise<{ updatedRows: number; spreadsheetUrl: string }> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Belum masuk akun Google. Silakan Sign in with Google terlebih dahulu.');

  if (records.length === 0) {
    throw new Error('Tidak ada data nilai siswa untuk disinkronkan.');
  }

  const rowsData = records.map((r) => {
    let dateStr = r.completedAt;
    try {
      dateStr = new Date(r.completedAt).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      dateStr = r.completedAt;
    }

    return [
      dateStr,
      r.studentName,
      r.kelas || 'XI MIPA 1',
      r.subMateriTitle,
      r.pgScore,
      r.essayScore,
      r.totalScore,
      r.masteryLevel,
      r.mode === 'competition' ? 'Cerdas Cermat (Timer)' : 'Mode Latihan',
    ];
  });

  const targetSheet = await getTargetSheetName(spreadsheetId, token);
  const rangeParam = encodeURIComponent(`${targetSheet}!A:I`);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${rangeParam}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rowsData,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal mengirim rekap nilai massal ke Google Sheet.');
  }

  const result = await res.json();
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return {
    updatedRows: result.updates?.updatedRows || records.length,
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

  const targetSheet = await getTargetSheetName(spreadsheetId, token);
  const rangeParam = encodeURIComponent(`${targetSheet}!A1:I200`);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${rangeParam}`,
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
