import React, { useEffect } from 'react';
import { SubMateri, MaterialSection } from '../types/biology';
import { DiagramViewer } from './diagrams/DiagramViewer';
import {
  Lightbulb,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  Info,
  ListOrdered,
  Table as TableIcon,
  Sparkles,
} from 'lucide-react';

interface MateriViewProps {
  subMateri: SubMateri;
  targetSectionId?: string | null;
  onGoToQuiz: () => void;
}

export const MateriView: React.FC<MateriViewProps> = ({
  subMateri,
  targetSectionId,
  onGoToQuiz,
}) => {
  useEffect(() => {
    if (targetSectionId) {
      const el = document.getElementById(targetSectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [targetSectionId]);

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* 1. Banner Tujuan Pembelajaran (Wajib di awal tiap sub materi) */}
      <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 text-emerald-800 font-extrabold text-sm sm:text-base mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span>TUJUAN PEMBELAJARAN (Capaian Kompetensi Siswa):</span>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-4">
          {subMateri.learningObjectives.map((tp) => (
            <div
              key={tp.id}
              className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-emerald-100 flex items-start gap-3 shadow-2xs"
            >
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                {tp.code}
              </span>
              <div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">{tp.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {tp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Visual Diagram Gallery (Minimal 2-3 Ilustrasi per Sub Materi) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-5 bg-teal-600 rounded-full" />
          <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
            Ilustrasi & Bagan Visual Biologi
          </h3>
        </div>

        <div className="space-y-6">
          {subMateri.illustrations.map((illus) => (
            <div key={illus.id} className="space-y-2">
              <DiagramViewer illustration={illus} />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Detailed Material Sections */}
      <div className="space-y-12">
        {subMateri.sections.map((section, idx) => (
          <article
            key={section.id}
            id={section.id}
            className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all ${
              targetSectionId === section.id
                ? 'border-emerald-500 ring-4 ring-emerald-100 shadow-lg'
                : 'border-slate-200/90 shadow-xs'
            }`}
          >
            {/* Section Header */}
            <div className="border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Bagian {idx + 1}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {section.title}
              </h3>
              {section.subTitle && (
                <p className="text-sm font-medium text-slate-500 mt-1">{section.subTitle}</p>
              )}
            </div>

            {/* Intro paragraph */}
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{section.intro}</p>

            {/* Bullet points */}
            {section.bullets && section.bullets.length > 0 && (
              <div className="mt-5 space-y-3">
                {section.bullets.map((bullet, bIdx) => {
                  const parts = bullet.split(':');
                  const hasLabel = parts.length > 1;
                  return (
                    <div key={bIdx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <div>
                        {hasLabel ? (
                          <>
                            <strong className="text-slate-900">{parts[0]}:</strong>
                            <span>{parts.slice(1).join(':')}</span>
                          </>
                        ) : (
                          <span>{bullet}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Comparison Table */}
            {section.comparisonTable && (
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <TableIcon className="w-4 h-4 text-emerald-600" />
                  <span>{section.comparisonTable.title}</span>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        {section.comparisonTable.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3 sm:p-4 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {section.comparisonTable.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 hover:bg-slate-50'}
                        >
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 sm:p-4 text-slate-700 align-top">
                              {cIdx === 0 ? (
                                <strong className="text-slate-900">{cell}</strong>
                              ) : (
                                cell
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Organ Function Table */}
            {section.organTable && section.organTable.length > 0 && (
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <TableIcon className="w-4 h-4 text-emerald-600" />
                  <span>{section.organTableTitle || 'Tabel Organ dan Fungsi Fisiologis'}</span>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-emerald-50 text-emerald-900 font-bold border-b border-emerald-200">
                      <tr>
                        <th className="p-3 sm:p-4">Organ / Bagian</th>
                        <th className="p-3 sm:p-4">Karakteristik & Lokasi</th>
                        <th className="p-3 sm:p-4">Fungsi Fisiologis</th>
                        <th className="p-3 sm:p-4">Enzim / Zat Spesifik</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {section.organTable.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 hover:bg-emerald-50/30'}
                        >
                          <td className="p-3 sm:p-4 font-bold text-slate-900 align-top">
                            {row.organ}
                          </td>
                          <td className="p-3 sm:p-4 text-slate-600 align-top">{row.detail}</td>
                          <td className="p-3 sm:p-4 text-slate-800 align-top font-medium">
                            {row.function}
                          </td>
                          <td className="p-3 sm:p-4 text-emerald-700 align-top font-mono text-xs">
                            {row.enzymesOrSubstances || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Process Flow Steps (Numbered diagram) */}
            {section.processSteps && section.processSteps.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <ListOrdered className="w-4 h-4 text-teal-600" />
                  <span>{section.processStepsTitle || 'Alur Urutan Proses Biologis'}</span>
                </div>
                <div className="space-y-3">
                  {section.processSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="bg-gradient-to-r from-teal-50/70 to-emerald-50/50 border border-teal-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-2xs"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-teal-600 text-white font-extrabold flex items-center justify-center shrink-0 shadow-sm text-sm sm:text-base">
                        {step.stepNumber}
                      </div>
                      <div className="space-y-1 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                            {step.title}
                          </h4>
                          <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200">
                            {step.organ}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">
                          {step.description}
                        </p>
                        {step.chemicalOrMechanical && (
                          <div className="mt-2 text-xs font-semibold text-teal-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            <span>Mekanisme: {step.chemicalOrMechanical}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Concept "Ingat!" Box */}
            {section.keyConcept && (
              <div className="mt-8 bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2.5 text-amber-900 font-extrabold text-sm sm:text-base">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <span>INGAT! — {section.keyConcept.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900 mt-2.5 leading-relaxed font-medium">
                  {section.keyConcept.content}
                </p>
                {section.keyConcept.mnemonic && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-100/90 border border-amber-200 text-xs font-bold text-amber-950 flex items-center gap-2">
                    <Bookmark className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Jembatan Keledai: {section.keyConcept.mnemonic}</span>
                  </div>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Floating / Bottom CTA to Practice */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-700/20">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold">Sudah Paham Materinya?</h3>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Uji pemahaman Anda sekarang melalui 10 Soal Pilihan Ganda dan 5 Soal Esai HOTS!
          </p>
        </div>
        <button
          onClick={onGoToQuiz}
          className="px-6 py-3 rounded-2xl bg-white text-emerald-800 font-extrabold text-sm hover:bg-emerald-50 active:scale-95 transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>Mulai Latihan 15 Soal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
