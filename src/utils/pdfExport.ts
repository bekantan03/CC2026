import jsPDF from 'jspdf';
import { SubMateri, EvaluationResult } from '../types/biology';
import { allSubMateriList } from '../data/allMateri';

export const exportCompleteCoursePdf = (onProgress?: (percent: number, msg: string) => void) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 20) {
      doc.addPage();
      cursorY = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    const totalPages = (doc as any).internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    // Header
    doc.text('Cerdas Cermat Biologi SMA - Materi Kurikulum Nasional', margin, 10);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(margin, 12, pageWidth - margin, 12);

    // Footer
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(`Halaman ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    doc.text('Bahan Belajar Mandiri & Bank Soal HOTS', margin, pageHeight - 8);
  };

  // --- 1. COVER PAGE ---
  if (onProgress) onProgress(10, 'Menyiapkan Sampul Dokumen...');
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setFillColor(6, 78, 59); // Dark emerald
  doc.circle(pageWidth / 2, 90, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('BIO', pageWidth / 2, 98, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('CERDAS CERMAT BIOLOGI SMA', pageWidth / 2, 35, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Buku Materi Lengkap, Intisari Konsep & Kumpulan 75 Soal HOTS', pageWidth / 2, 45, { align: 'center' });

  cursorY = 130;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('DAFTAR ISI SUB MATERI KURIKULUM:', margin, cursorY);
  cursorY += 10;

  allSubMateriList.forEach((sub, i) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(5, 150, 105);
    doc.text(`${i + 1}. ${sub.title}`, margin + 4, cursorY);
    cursorY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const splitSummary = doc.splitTextToSize(sub.summary, contentWidth - 10);
    doc.text(splitSummary, margin + 8, cursorY);
    cursorY += splitSummary.length * 4.5 + 4;
  });

  cursorY = pageHeight - 40;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, cursorY, contentWidth, 24, 3, 3, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Disusun secara komprehensif berdasarkan kurikulum SMA terbaru.', margin + 4, cursorY + 8);
  doc.text('Memuat materi esensial, tabel komparasi, alur urutan biologis, dan pembahasan kunci.', margin + 4, cursorY + 16);

  // --- 2. SUB MATERI CONTENT ---
  allSubMateriList.forEach((sub, sIdx) => {
    if (onProgress) onProgress(20 + sIdx * 15, `Menulis Materi ${sIdx + 1}: ${sub.shortTitle}...`);
    doc.addPage();
    cursorY = margin;
    drawHeaderFooter();

    // Section Header
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(margin, cursorY, contentWidth, 22, 3, 3, 'FD');
    doc.setTextColor(4, 120, 87);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`SUB MATERI ${sIdx + 1}: ${sub.title.toUpperCase()}`, margin + 5, cursorY + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(sub.summary, margin + 5, cursorY + 17);
    cursorY += 28;

    // Tujuan Pembelajaran
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('TUJUAN PEMBELAJARAN:', margin, cursorY);
    cursorY += 6;

    sub.learningObjectives.forEach((tp) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(5, 150, 105);
      doc.text(`[${tp.code}] ${tp.title}:`, margin + 3, cursorY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const tpDesc = doc.splitTextToSize(tp.description, contentWidth - 8);
      cursorY += 4.5;
      doc.text(tpDesc, margin + 6, cursorY);
      cursorY += tpDesc.length * 4 + 3;
    });

    cursorY += 4;

    // Sections
    sub.sections.forEach((sec) => {
      checkPageBreak(25);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, cursorY, contentWidth, 8, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(sec.title, margin + 3, cursorY + 5.5);
      cursorY += 12;

      // Intro
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const splitIntro = doc.splitTextToSize(sec.intro, contentWidth);
      doc.text(splitIntro, margin, cursorY);
      cursorY += splitIntro.length * 4.5 + 4;

      // Bullets
      if (sec.bullets) {
        sec.bullets.forEach((b) => {
          checkPageBreak(14);
          doc.setFillColor(5, 150, 105);
          doc.circle(margin + 2, cursorY - 1, 1, 'F');
          const splitB = doc.splitTextToSize(b, contentWidth - 8);
          doc.text(splitB, margin + 6, cursorY);
          cursorY += splitB.length * 4.2 + 3;
        });
      }

      // Organ Table
      if (sec.organTable) {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text(sec.organTableTitle || 'Tabel Organ dan Fungsi Fisiologis:', margin, cursorY);
        cursorY += 5;

        sec.organTable.forEach((row) => {
          checkPageBreak(18);
          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.rect(margin, cursorY, contentWidth, 14, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          doc.text(`• ${row.organ}`, margin + 3, cursorY + 4.5);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          const fText = doc.splitTextToSize(`Fungsi: ${row.function}`, contentWidth - 6);
          doc.text(fText, margin + 3, cursorY + 8.5);
          cursorY += 16;
        });
      }

      // Process Steps
      if (sec.processSteps) {
        checkPageBreak(25);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text(sec.processStepsTitle || 'Alur Urutan Proses Biologis:', margin, cursorY);
        cursorY += 5;

        sec.processSteps.forEach((st) => {
          checkPageBreak(18);
          doc.setFillColor(254, 243, 199);
          doc.setDrawColor(251, 191, 36);
          doc.rect(margin, cursorY, contentWidth, 14, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(180, 83, 9);
          doc.text(`Langkah ${st.stepNumber}: ${st.title} (${st.organ})`, margin + 3, cursorY + 4.5);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(68, 64, 60);
          const sText = doc.splitTextToSize(st.description, contentWidth - 6);
          doc.text(sText, margin + 3, cursorY + 8.5);
          cursorY += 16;
        });
      }

      // Key Concept "Ingat!"
      if (sec.keyConcept) {
        checkPageBreak(22);
        doc.setFillColor(254, 249, 195);
        doc.setDrawColor(234, 179, 8);
        doc.roundedRect(margin, cursorY, contentWidth, 18, 2, 2, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(133, 77, 14);
        doc.text(`INGAT! ${sec.keyConcept.title}`, margin + 4, cursorY + 5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        const splitKc = doc.splitTextToSize(sec.keyConcept.content, contentWidth - 8);
        doc.text(splitKc, margin + 4, cursorY + 9.5);
        cursorY += 22;
      }

      cursorY += 4;
    });

    // Soal & Pembahasan Section for this sub-materi
    checkPageBreak(30);
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(margin, cursorY, contentWidth, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(`BANK SOAL & PEMBAHASAN (${sub.questions.length} SOAL)`, margin + 4, cursorY + 7);
    cursorY += 15;

    sub.questions.forEach((q) => {
      checkPageBreak(32);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      const typeLabel = q.type === 'multiple_choice' ? 'Pilihan Ganda' : 'Esai Singkat';
      doc.text(`Soal No. ${q.number} [${typeLabel} - ${q.difficulty}]`, margin, cursorY);
      cursorY += 4.5;

      if (q.stimulus) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        const stim = doc.splitTextToSize(`Stimulus: "${q.stimulus}"`, contentWidth);
        doc.text(stim, margin, cursorY);
        cursorY += stim.length * 3.8 + 2;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      const qText = doc.splitTextToSize(q.question, contentWidth);
      doc.text(qText, margin, cursorY);
      cursorY += qText.length * 4 + 2;

      if (q.options) {
        q.options.forEach((opt) => {
          checkPageBreak(6);
          const isCorrect = opt.id === q.correctAnswer;
          doc.setFont('helvetica', isCorrect ? 'bold' : 'normal');
          doc.setTextColor(isCorrect ? 4 : 71, isCorrect ? 120 : 85, isCorrect ? 87 : 105);
          doc.text(`  ${opt.id}. ${opt.text}`, margin + 2, cursorY);
          cursorY += 4;
        });
      }

      // Kunci & Pembahasan Box
      checkPageBreak(18);
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.rect(margin, cursorY, contentWidth, 12, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(21, 128, 61);
      const answerKey = q.correctAnswer ? `KUNCI JAWABAN: ${q.correctAnswer}` : 'PANDUAN RUBRIK ESAI';
      doc.text(answerKey, margin + 2, cursorY + 4);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const expText = doc.splitTextToSize(`Pembahasan: ${q.explanation}`, contentWidth - 4);
      doc.text(expText, margin + 2, cursorY + 8);
      cursorY += 16;
    });
  });

  if (onProgress) onProgress(100, 'Menyelesaikan berkas PDF...');
  doc.save('Materi_Lengkap_Cerdas_Cermat_Biologi_SMA.pdf');
};

export const exportSingleSubMateriPdf = (sub: SubMateri) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 20) {
      doc.addPage();
      cursorY = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    const totalPages = (doc as any).internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(`Cerdas Cermat Biologi - Sub Materi ${sub.number}: ${sub.shortTitle}`, margin, 10);
    doc.line(margin, 12, pageWidth - margin, 12);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(`Halaman ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  // Header Box
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`SUB MATERI ${sub.number}: ${sub.title.toUpperCase()}`, pageWidth / 2, 22, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Cerdas Cermat Biologi SMA - Bahan Pembelajaran Mandiri', pageWidth / 2, 30, { align: 'center' });

  cursorY = 50;

  // Tujuan Pembelajaran
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(4, 120, 87);
  doc.text('TUJUAN PEMBELAJARAN:', margin, cursorY);
  cursorY += 6;

  sub.learningObjectives.forEach((tp) => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`• [${tp.code}] ${tp.title}:`, margin + 2, cursorY);
    cursorY += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(tp.description, contentWidth - 4);
    doc.text(splitDesc, margin + 4, cursorY);
    cursorY += splitDesc.length * 4 + 3;
  });

  cursorY += 4;

  // Sections
  sub.sections.forEach((sec) => {
    checkPageBreak(25);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, cursorY, contentWidth, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(sec.title, margin + 3, cursorY + 5.5);
    cursorY += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitIntro = doc.splitTextToSize(sec.intro, contentWidth);
    doc.text(splitIntro, margin, cursorY);
    cursorY += splitIntro.length * 4.2 + 4;

    if (sec.bullets) {
      sec.bullets.forEach((b) => {
        checkPageBreak(12);
        doc.setFillColor(5, 150, 105);
        doc.circle(margin + 2, cursorY - 1, 1, 'F');
        const splitB = doc.splitTextToSize(b, contentWidth - 8);
        doc.text(splitB, margin + 6, cursorY);
        cursorY += splitB.length * 4 + 3;
      });
    }

    if (sec.organTable) {
      checkPageBreak(20);
      sec.organTable.forEach((row) => {
        checkPageBreak(14);
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, cursorY, contentWidth, 12, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(`${row.organ}:`, margin + 2, cursorY + 4);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const fText = doc.splitTextToSize(row.function, contentWidth - 4);
        doc.text(fText, margin + 2, cursorY + 8);
        cursorY += 14;
      });
    }

    if (sec.keyConcept) {
      checkPageBreak(18);
      doc.setFillColor(254, 249, 195);
      doc.roundedRect(margin, cursorY, contentWidth, 16, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(133, 77, 14);
      doc.text(`INGAT! ${sec.keyConcept.title}`, margin + 3, cursorY + 5);
      doc.setFont('helvetica', 'normal');
      const splitKc = doc.splitTextToSize(sec.keyConcept.content, contentWidth - 6);
      doc.text(splitKc, margin + 3, cursorY + 9);
      cursorY += 19;
    }
  });

  // Soal
  checkPageBreak(30);
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, cursorY, contentWidth, 9, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(31, 41, 55);
  doc.text(`KUMPULAN 15 LATIHAN SOAL & PEMBAHASAN`, margin + 4, cursorY + 6);
  cursorY += 14;

  sub.questions.forEach((q) => {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Soal No. ${q.number} (${q.type === 'multiple_choice' ? 'PG' : 'Esai'} - ${q.difficulty}):`, margin, cursorY);
    cursorY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const qText = doc.splitTextToSize(q.question, contentWidth);
    doc.text(qText, margin, cursorY);
    cursorY += qText.length * 3.8 + 2;

    if (q.options) {
      q.options.forEach((opt) => {
        checkPageBreak(5);
        doc.text(`  ${opt.id}. ${opt.text}`, margin + 2, cursorY);
        cursorY += 3.8;
      });
    }

    checkPageBreak(12);
    doc.setFillColor(240, 253, 244);
    doc.rect(margin, cursorY, contentWidth, 10, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(21, 128, 61);
    doc.text(`Kunci: ${q.correctAnswer || 'Rubrik Terlampir'} | Pembahasan:`, margin + 2, cursorY + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const expText = doc.splitTextToSize(q.explanation, contentWidth - 4);
    doc.text(expText, margin + 2, cursorY + 7.5);
    cursorY += 13;
  });

  doc.save(`Materi_${sub.id}.pdf`);
};

export const exportEvaluationReportPdf = (
  subMateri: SubMateri,
  evalResult: EvaluationResult,
  studentName: string = 'Siswa'
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // Header Box
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RAPOR EVALUASI CERDAS CERMAT BIOLOGI SMA', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Sub Materi: ${subMateri.title}`, pageWidth / 2, 26, { align: 'center' });

  cursorY = 46;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Nama Siswa : ${studentName}`, margin, cursorY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tanggal Cetak : ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}`, margin, cursorY + 6);
  cursorY += 16;

  // Score Highlight Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, cursorY, contentWidth, 32, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('SKOR AKHIR KOMBINASI (70% PG + 30% ESAI)', margin + 6, cursorY + 8);

  doc.setFontSize(24);
  doc.setTextColor(5, 150, 105);
  doc.text(`${Math.round(evalResult.totalScore)} / 100`, margin + 6, cursorY + 22);

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(`Kategori: ${evalResult.masteryLevel}`, pageWidth - margin - 60, cursorY + 16, { align: 'right' });
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Nilai PG: ${Math.round(evalResult.pgScore)} | Nilai Esai: ${Math.round(evalResult.essayScore)}`, pageWidth - margin - 60, cursorY + 24, { align: 'right' });

  cursorY += 40;

  // Capaian Per Tujuan Pembelajaran
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('PENGUASAAN PER TUJUAN PEMBELAJARAN (TP):', margin, cursorY);
  cursorY += 8;

  evalResult.objectiveStats.forEach((st) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`[${st.objective.code}] ${st.objective.title}`, margin, cursorY);

    // Progress Bar Background
    const barY = cursorY + 2;
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(margin, barY, contentWidth - 25, 4, 1.5, 1.5, 'F');

    // Progress Bar Fill
    const fillWidth = ((contentWidth - 25) * Math.min(100, Math.max(0, st.scorePercent))) / 100;
    doc.setFillColor(st.scorePercent >= 75 ? 16 : 245, st.scorePercent >= 75 ? 185 : 158, st.scorePercent >= 75 ? 129 : 11);
    if (fillWidth > 0) {
      doc.roundedRect(margin, barY, fillWidth, 4, 1.5, 1.5, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`${Math.round(st.scorePercent)}%`, pageWidth - margin - 15, barY + 3.5);

    cursorY += 14;
  });

  // Rekomendasi Belajar
  cursorY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('REKOMENDASI MATERI YANG PERLU DIPELAJARI KEMBALI:', margin, cursorY);
  cursorY += 8;

  if (evalResult.recommendations.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(5, 150, 105);
    doc.text('Luar biasa! Anda telah menguasai seluruh konsep materi ini dengan sangat baik.', margin, cursorY);
  } else {
    evalResult.recommendations.forEach((rec) => {
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(margin, cursorY, contentWidth, 16, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(153, 27, 27);
      doc.text(`• ${rec.sectionTitle}`, margin + 3, cursorY + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(185, 28, 28);
      doc.text(`Saran: ${rec.reviewTips}`, margin + 5, cursorY + 11);
      cursorY += 19;
    });
  }

  doc.save(`Rapor_Evaluasi_${subMateri.id}.pdf`);
};
