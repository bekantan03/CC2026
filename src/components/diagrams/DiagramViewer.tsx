import React, { useState } from 'react';
import { IllustrationData } from '../../types/biology';
import { Info, Sparkles, CheckCircle2 } from 'lucide-react';

interface DiagramProps {
  illustration: IllustrationData;
}

export const DiagramViewer: React.FC<DiagramProps> = ({ illustration }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [highlightedPart, setHighlightedPart] = useState<string | null>(null);

  switch (illustration.type) {
    case 'biodiversity_levels':
      return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-100 shadow-sm">
          <div className="flex flex-wrap gap-2 mb-4">
            {['1. Tingkat Gen (Satu Jenis)', '2. Tingkat Spesies (Antar Jenis)', '3. Tingkat Ekosistem (Bioma)'].map((label, idx) => (
              <button
                key={label}
                onClick={() => { setActiveTab(idx); setHighlightedPart(null); }}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === idx
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-emerald-950/5 rounded-xl p-4 flex flex-col items-center">
            <svg
              viewBox="0 0 600 320"
              className="w-full max-w-xl h-auto drop-shadow-sm select-none"
              aria-label={illustration.altText}
              role="img"
            >
              <defs>
                <linearGradient id="dnaGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="felidGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="ecoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {activeTab === 0 && (
                <g>
                  {/* Tingkat Gen: Variasi Mangga */}
                  <rect x="20" y="20" width="560" height="280" rx="16" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
                  <text x="300" y="55" textAnchor="middle" className="text-base font-bold fill-emerald-900" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    KEANEKARAGAMAN TINGKAT GEN (Satu Spesies: Mangifera indica)
                  </text>
                  <text x="300" y="78" textAnchor="middle" fill="#047857" style={{ fontSize: '13px' }}>
                    Susunan DNA berbeda menghasilkan variasi rasa, aroma, dan bentuk buah
                  </text>

                  {/* Buah Mangga 1 */}
                  <g className="cursor-pointer" onClick={() => setHighlightedPart('Mangga Golek')}>
                    <rect x="50" y="105" width="140" height="165" rx="12" fill={highlightedPart === 'Mangga Golek' ? '#bbf7d0' : '#ffffff'} stroke="#22c55e" strokeWidth="2" />
                    <ellipse cx="120" cy="165" rx="36" ry="48" fill="#84cc16" stroke="#4d7c0f" strokeWidth="2" />
                    <ellipse cx="128" cy="180" rx="20" ry="28" fill="#eab308" opacity="0.6" />
                    <path d="M120 117 Q123 105 130 102" stroke="#78350f" strokeWidth="3" fill="none" />
                    <text x="120" y="235" textAnchor="middle" fill="#14532d" style={{ fontSize: '14px', fontWeight: 'bold' }}>Mangga Golek</text>
                    <text x="120" y="254" textAnchor="middle" fill="#15803d" style={{ fontSize: '11px' }}>Bentuk lonjong memanjang</text>
                  </g>

                  {/* Buah Mangga 2 */}
                  <g className="cursor-pointer" onClick={() => setHighlightedPart('Mangga Arumanis')}>
                    <rect x="230" y="105" width="140" height="165" rx="12" fill={highlightedPart === 'Mangga Arumanis' ? '#bbf7d0' : '#ffffff'} stroke="#22c55e" strokeWidth="2" />
                    <ellipse cx="300" cy="165" rx="42" ry="46" fill="#65a30d" stroke="#365314" strokeWidth="2" />
                    <ellipse cx="310" cy="165" rx="18" ry="30" fill="#a3e635" opacity="0.5" />
                    <path d="M300 119 Q303 107 312 105" stroke="#78350f" strokeWidth="3" fill="none" />
                    <text x="300" y="235" textAnchor="middle" fill="#14532d" style={{ fontSize: '14px', fontWeight: 'bold' }}>Mangga Arumanis</text>
                    <text x="300" y="254" textAnchor="middle" fill="#15803d" style={{ fontSize: '11px' }}>Harum manis & bulat telur</text>
                  </g>

                  {/* Buah Mangga 3 */}
                  <g className="cursor-pointer" onClick={() => setHighlightedPart('Mangga Manalagi')}>
                    <rect x="410" y="105" width="140" height="165" rx="12" fill={highlightedPart === 'Mangga Manalagi' ? '#bbf7d0' : '#ffffff'} stroke="#22c55e" strokeWidth="2" />
                    <ellipse cx="480" cy="165" rx="38" ry="40" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
                    <ellipse cx="475" cy="160" rx="15" ry="20" fill="#f97316" opacity="0.4" />
                    <path d="M480 125 Q483 113 490 110" stroke="#78350f" strokeWidth="3" fill="none" />
                    <text x="480" y="235" textAnchor="middle" fill="#14532d" style={{ fontSize: '14px', fontWeight: 'bold' }}>Mangga Manalagi</text>
                    <text x="480" y="254" textAnchor="middle" fill="#15803d" style={{ fontSize: '11px' }}>Daging padat manis</text>
                  </g>
                </g>
              )}

              {activeTab === 1 && (
                <g>
                  {/* Tingkat Spesies: Famili Felidae */}
                  <rect x="20" y="20" width="560" height="280" rx="16" fill="#fffbeb" stroke="#fcd34d" strokeWidth="2" />
                  <text x="300" y="55" textAnchor="middle" fill="#78350f" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    KEANEKARAGAMAN TINGKAT SPESIES (Famili Felidae)
                  </text>
                  <text x="300" y="78" textAnchor="middle" fill="#92400e" style={{ fontSize: '13px' }}>
                    Spesies berbeda dalam satu famili kucing-kucingan (nama ilmiah berbeda)
                  </text>

                  {/* Kucing */}
                  <rect x="50" y="105" width="140" height="165" rx="12" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="120" cy="155" r="32" fill="#fdba74" stroke="#c2410c" strokeWidth="2" />
                  <polygon points="100,135 105,115 115,130" fill="#ea580c" />
                  <polygon points="140,135 135,115 125,130" fill="#ea580c" />
                  <circle cx="110" cy="155" r="4" fill="#431407" />
                  <circle cx="130" cy="155" r="4" fill="#431407" />
                  <text x="120" y="225" textAnchor="middle" fill="#78350f" style={{ fontSize: '14px', fontWeight: 'bold' }}>Kucing Rumah</text>
                  <text x="120" y="244" textAnchor="middle" fill="#b45309" style={{ fontSize: '11px', fontStyle: 'italic' }}>Felis catus</text>

                  {/* Harimau */}
                  <rect x="230" y="105" width="140" height="165" rx="12" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="300" cy="155" r="36" fill="#fb923c" stroke="#9a3412" strokeWidth="2" />
                  <path d="M280 140 L290 145 M310 145 L320 140 M280 160 L295 160 M305 160 L320 160" stroke="#431407" strokeWidth="3" />
                  <text x="300" y="225" textAnchor="middle" fill="#78350f" style={{ fontSize: '14px', fontWeight: 'bold' }}>Harimau</text>
                  <text x="300" y="244" textAnchor="middle" fill="#b45309" style={{ fontSize: '11px', fontStyle: 'italic' }}>Panthera tigris</text>

                  {/* Singa */}
                  <rect x="410" y="105" width="140" height="165" rx="12" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="480" cy="155" r="42" fill="#d97706" opacity="0.3" />
                  <circle cx="480" cy="155" r="32" fill="#fde047" stroke="#a16207" strokeWidth="2" />
                  <text x="480" y="225" textAnchor="middle" fill="#78350f" style={{ fontSize: '14px', fontWeight: 'bold' }}>Singa</text>
                  <text x="480" y="244" textAnchor="middle" fill="#b45309" style={{ fontSize: '11px', fontStyle: 'italic' }}>Panthera leo</text>
                </g>
              )}

              {activeTab === 2 && (
                <g>
                  {/* Tingkat Ekosistem */}
                  <rect x="20" y="20" width="560" height="280" rx="16" fill="#ecfeff" stroke="#a5f3fc" strokeWidth="2" />
                  <text x="300" y="55" textAnchor="middle" fill="#164e63" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    KEANEKARAGAMAN TINGKAT EKOSISTEM (Variasi Bioma)
                  </text>
                  <text x="300" y="78" textAnchor="middle" fill="#0e7490" style={{ fontSize: '13px' }}>
                    Perbedaan iklim dan faktor abiotik membentuk komunitas bioma khas
                  </text>

                  {/* Hutan Hujan Tropis */}
                  <rect x="40" y="105" width="155" height="165" rx="12" fill="#ffffff" stroke="#06b6d4" strokeWidth="2" />
                  <rect x="50" y="115" width="135" height="70" rx="8" fill="#15803d" />
                  <circle cx="95" cy="140" r="18" fill="#22c55e" />
                  <circle cx="135" cy="135" r="22" fill="#16a34a" />
                  <text x="117" y="210" textAnchor="middle" fill="#164e63" style={{ fontSize: '13px', fontWeight: 'bold' }}>Hutan Hujan Tropis</text>
                  <text x="117" y="228" textAnchor="middle" fill="#0e7490" style={{ fontSize: '10px' }}>Curah hujan tinggi</text>
                  <text x="117" y="242" textAnchor="middle" fill="#0e7490" style={{ fontSize: '10px' }}>Keanekaragaman tertinggi</text>

                  {/* Sabana / Padang Rumput */}
                  <rect x="222" y="105" width="155" height="165" rx="12" fill="#ffffff" stroke="#06b6d4" strokeWidth="2" />
                  <rect x="232" y="115" width="135" height="70" rx="8" fill="#ca8a04" />
                  <path d="M250 165 L255 140 M280 165 L285 135 M320 165 L325 145" stroke="#713f12" strokeWidth="2" />
                  <text x="299" y="210" textAnchor="middle" fill="#164e63" style={{ fontSize: '13px', fontWeight: 'bold' }}>Ekosistem Sabana</text>
                  <text x="299" y="228" textAnchor="middle" fill="#0e7490" style={{ fontSize: '10px' }}>Padang rumput diselingi</text>
                  <text x="299" y="242" textAnchor="middle" fill="#0e7490" style={{ fontSize: '10px' }}>pohon berkanopi jarang</text>

                  {/* Terumbu Karang */}
                  <rect x="405" y="105" width="155" height="165" rx="12" fill="#ffffff" stroke="#06b6d4" strokeWidth="2" />
                  <rect x="415" y="115" width="135" height="70" rx="8" fill="#0284c7" />
                  <ellipse cx="482" cy="150" rx="20" ry="12" fill="#f43f5e" />
                  <path d="M445 170 Q450 145 460 140 M500 170 Q515 150 510 135" stroke="#fb7185" strokeWidth="3" />
                  <text x="482" y="210" textAnchor="middle" fill="#164e63" style={{ fontSize: '13px', fontWeight: 'bold' }}>Terumbu Karang</text>
                  <text x="482" y="228" textAnchor="middle" fill="#0e7490" style={{ fontSize: '10px' }}>Zona laut dangkal</text>
                  <text x="482" y="242" textAnchor="middle" fill="#0e7490" style={{ fontSize: '10px' }}>Kaya nutrien & biota</text>
                </g>
              )}
            </svg>
          </div>

          <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Keterangan: </span>
              {illustration.caption}
            </div>
          </div>
        </div>
      );

    case 'biogeography_map':
      return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-100 shadow-sm">
          <div className="bg-sky-50 rounded-xl p-4 flex flex-col items-center">
            <svg
              viewBox="0 0 600 320"
              className="w-full max-w-xl h-auto drop-shadow-sm select-none"
              aria-label={illustration.altText}
              role="img"
            >
              {/* Lautan Indonesia */}
              <rect width="600" height="320" rx="14" fill="#e0f2fe" />

              {/* Wilayah Barat: Dangkalan Sunda (Asiatis) */}
              <g className="cursor-pointer" onClick={() => setHighlightedPart('Asiatis')}>
                <path d="M40 90 Q70 110 80 180 Q60 210 45 160 Z" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
                <text x="60" y="150" fill="#14532d" style={{ fontSize: '11px', fontWeight: 'bold' }}>Sumatera</text>

                <path d="M120 70 Q160 55 190 80 Q195 125 155 135 Q125 110 120 70 Z" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
                <text x="155" y="105" fill="#14532d" style={{ fontSize: '11px', fontWeight: 'bold' }}>Kalimantan</text>

                <path d="M90 220 Q160 215 195 225 Q180 238 105 238 Z" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
                <text x="140" y="232" fill="#14532d" style={{ fontSize: '11px', fontWeight: 'bold' }}>Jawa</text>

                <rect x="40" y="20" width="170" height="36" rx="8" fill="#dcfce7" stroke="#22c55e" />
                <text x="125" y="38" textAnchor="middle" fill="#166534" style={{ fontSize: '12px', fontWeight: 'bold' }}>ZONA ASIATIS (BARAT)</text>
                <text x="125" y="50" textAnchor="middle" fill="#15803d" style={{ fontSize: '9px' }}>Orangutan, Harimau, Gajah</text>
              </g>

              {/* Garis Wallace */}
              <line x1="225" y1="20" x2="215" y2="300" stroke="#dc2626" strokeWidth="3" strokeDasharray="6,4" />
              <rect x="210" y="260" width="105" height="42" rx="6" fill="#fee2e2" stroke="#ef4444" />
              <text x="262" y="278" textAnchor="middle" fill="#991b1b" style={{ fontSize: '11px', fontWeight: 'bold' }}>Garis Wallace</text>
              <text x="262" y="292" textAnchor="middle" fill="#b91c1c" style={{ fontSize: '9px' }}>Batas Barat-Tengah</text>

              {/* Wilayah Tengah: Wallacea (Peralihan) */}
              <g className="cursor-pointer" onClick={() => setHighlightedPart('Peralihan')}>
                {/* Sulawesi */}
                <path d="M250 85 Q285 75 280 110 Q265 115 260 145 Q285 160 270 180 Q245 145 250 85 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                <text x="272" y="125" fill="#854d0e" style={{ fontSize: '11px', fontWeight: 'bold' }}>Sulawesi</text>

                {/* Nusa Tenggara */}
                <path d="M210 235 Q280 235 340 240 Q320 250 215 245 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                <text x="275" y="255" fill="#854d0e" style={{ fontSize: '9px', fontWeight: 'bold' }}>Nusa Tenggara (Komodo)</text>

                <rect x="245" y="20" width="150" height="36" rx="8" fill="#fef9c3" stroke="#eab308" />
                <text x="320" y="38" textAnchor="middle" fill="#854d0e" style={{ fontSize: '12px', fontWeight: 'bold' }}>ZONA PERALIHAN</text>
                <text x="320" y="50" textAnchor="middle" fill="#a16207" style={{ fontSize: '9px' }}>Anoa, Babirusa, Komodo</text>
              </g>

              {/* Garis Weber */}
              <line x1="395" y1="20" x2="385" y2="300" stroke="#2563eb" strokeWidth="3" strokeDasharray="6,4" />
              <rect x="345" y="260" width="95" height="42" rx="6" fill="#dbeafe" stroke="#3b82f6" />
              <text x="392" y="278" textAnchor="middle" fill="#1e40af" style={{ fontSize: '11px', fontWeight: 'bold' }}>Garis Weber</text>
              <text x="392" y="292" textAnchor="middle" fill="#2563eb" style={{ fontSize: '9px' }}>Batas Tengah-Timur</text>

              {/* Wilayah Timur: Australis (Sahul) */}
              <g className="cursor-pointer" onClick={() => setHighlightedPart('Australis')}>
                {/* Papua */}
                <path d="M430 110 Q500 70 560 120 Q550 170 510 175 Q470 145 430 110 Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                <text x="495" y="130" fill="#9a3412" style={{ fontSize: '12px', fontWeight: 'bold' }}>Papua</text>

                <rect x="420" y="20" width="160" height="36" rx="8" fill="#ffedd5" stroke="#f97316" />
                <text x="500" y="38" textAnchor="middle" fill="#9a3412" style={{ fontSize: '12px', fontWeight: 'bold' }}>ZONA AUSTRALIS</text>
                <text x="500" y="50" textAnchor="middle" fill="#c2410c" style={{ fontSize: '9px' }}>Cenderawasih, Kasuari</text>
              </g>
            </svg>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Keterangan: </span>
              {illustration.caption}
            </div>
          </div>
        </div>
      );

    case 'energy_pyramid':
      return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-teal-100 shadow-sm">
          <div className="bg-teal-950/5 rounded-xl p-4 flex flex-col items-center">
            <svg
              viewBox="0 0 600 320"
              className="w-full max-w-xl h-auto drop-shadow-sm select-none"
              aria-label={illustration.altText}
              role="img"
            >
              <defs>
                <linearGradient id="t4Grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
                <linearGradient id="t3Grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
                <linearGradient id="t2Grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#facc15" />
                </linearGradient>
                <linearGradient id="t1Grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>

              {/* Trofik 4: Konsumen Tersier / Puncak */}
              <polygon points="250,50 350,50 370,105 230,105" fill="url(#t4Grad)" stroke="#b91c1c" strokeWidth="2" />
              <text x="300" y="78" textAnchor="middle" fill="#ffffff" style={{ fontSize: '13px', fontWeight: 'bold' }}>Trofik IV: Konsumen Puncak (Elang)</text>
              <text x="300" y="96" textAnchor="middle" fill="#fef2f2" style={{ fontSize: '11px' }}>Energi: 10 kkal (0,1%)</text>

              {/* Trofik 3: Konsumen Sekunder */}
              <polygon points="225,110 375,110 405,170 195,170" fill="url(#t3Grad)" stroke="#c2410c" strokeWidth="2" />
              <text x="300" y="138" textAnchor="middle" fill="#ffffff" style={{ fontSize: '13px', fontWeight: 'bold' }}>Trofik III: Konsumen II (Katak/Ular)</text>
              <text x="300" y="156" textAnchor="middle" fill="#fff7ed" style={{ fontSize: '11px' }}>Energi: 100 kkal (1%)</text>

              {/* Trofik 2: Konsumen Primer / Herbivora */}
              <polygon points="190,175 410,175 445,235 155,235" fill="url(#t2Grad)" stroke="#a16207" strokeWidth="2" />
              <text x="300" y="202" textAnchor="middle" fill="#713f12" style={{ fontSize: '13px', fontWeight: 'bold' }}>Trofik II: Konsumen I (Belalang/Ulat)</text>
              <text x="300" y="220" textAnchor="middle" fill="#854d0e" style={{ fontSize: '11px' }}>Energi: 1.000 kkal (10%)</text>

              {/* Trofik 1: Produsen Autotrof */}
              <polygon points="150,240 450,240 490,300 110,300" fill="url(#t1Grad)" stroke="#047857" strokeWidth="2" />
              <text x="300" y="268" textAnchor="middle" fill="#ffffff" style={{ fontSize: '14px', fontWeight: 'bold' }}>Trofik I: Produsen (Rumput / Tumbuhan Hijau)</text>
              <text x="300" y="286" textAnchor="middle" fill="#ecfdf5" style={{ fontSize: '12px' }}>Energi Masuk: 10.000 kkal (100%)</text>

              {/* Label Panah Disipasi Panas 90% */}
              <path d="M470 200 Q540 200 540 160" fill="none" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="545" y="145" fill="#b91c1c" style={{ fontSize: '11px', fontWeight: 'bold' }}>90% Energi Hilang</text>
              <text x="545" y="160" fill="#dc2626" style={{ fontSize: '10px' }}>sebagai panas & respirasi</text>
            </svg>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Keterangan: </span>
              {illustration.caption}
            </div>
          </div>
        </div>
      );

    case 'cell_structure':
      return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-blue-100 shadow-sm">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setActiveTab(0); setHighlightedPart(null); }}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 0 ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-800'
              }`}
            >
              Sel Tumbuhan (Kaku & Berkloroplas)
            </button>
            <button
              onClick={() => { setActiveTab(1); setHighlightedPart(null); }}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-800'
              }`}
            >
              Sel Hewan (Fleksibel & Bersentriol)
            </button>
          </div>

          <div className="bg-blue-950/5 rounded-xl p-4 flex flex-col items-center">
            <svg
              viewBox="0 0 600 320"
              className="w-full max-w-xl h-auto drop-shadow-sm select-none"
              aria-label={illustration.altText}
              role="img"
            >
              {activeTab === 0 ? (
                /* Sel Tumbuhan */
                <g>
                  {/* Dinding Sel Luar Hijau Kaku Segienam */}
                  <polygon points="120,30 480,30 550,160 480,290 120,290 50,160" fill="#dcfce7" stroke="#16a34a" strokeWidth="8" />
                  {/* Membran Plasma Dalam */}
                  <polygon points="125,40 475,40 540,160 475,280 125,280 60,160" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />

                  {/* Vakuola Sentral Besar Biru Air */}
                  <ellipse cx="320" cy="160" rx="140" ry="85" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                  <text x="320" y="165" textAnchor="middle" fill="#0369a1" style={{ fontSize: '13px', fontWeight: 'bold' }}>Vakuola Sentral Besar (90% volume)</text>

                  {/* Nukleus */}
                  <circle cx="150" cy="110" r="35" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
                  <circle cx="150" cy="110" r="14" fill="#4338ca" />
                  <text x="150" y="160" textAnchor="middle" fill="#312e81" style={{ fontSize: '11px', fontWeight: 'bold' }}>Nukleus</text>

                  {/* Kloroplas Hijau Terang */}
                  <g>
                    <ellipse cx="140" cy="225" rx="30" ry="18" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
                    <line x1="125" y1="225" x2="155" y2="225" stroke="#166534" strokeWidth="2" />
                    <text x="140" y="255" textAnchor="middle" fill="#14532d" style={{ fontSize: '10px', fontWeight: 'bold' }}>Kloroplas</text>
                  </g>
                  <g>
                    <ellipse cx="460" cy="90" rx="30" ry="18" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
                    <text x="460" y="120" textAnchor="middle" fill="#14532d" style={{ fontSize: '10px', fontWeight: 'bold' }}>Kloroplas</text>
                  </g>

                  {/* Mitokondria */}
                  <ellipse cx="470" cy="225" rx="28" ry="16" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
                  <path d="M455 225 Q470 218 485 225" stroke="#9a3412" strokeWidth="2" fill="none" />
                  <text x="470" y="255" textAnchor="middle" fill="#7c2d12" style={{ fontSize: '10px', fontWeight: 'bold' }}>Mitokondria</text>

                  {/* Label Dinding Sel */}
                  <text x="50" y="25" fill="#166534" style={{ fontSize: '12px', fontWeight: 'bold' }}>Dinding Sel Selulosa (Tebal & Kaku)</text>
                </g>
              ) : (
                /* Sel Hewan */
                <g>
                  {/* Membran Plasma Berlekuk Bulat Fleksibel */}
                  <ellipse cx="300" cy="160" rx="240" ry="135" fill="#fff1f2" stroke="#f43f5e" strokeWidth="4" />

                  {/* Nukleus di Tengah */}
                  <circle cx="300" cy="160" r="50" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
                  <circle cx="300" cy="160" r="18" fill="#4338ca" />
                  <text x="300" y="225" textAnchor="middle" fill="#312e81" style={{ fontSize: '12px', fontWeight: 'bold' }}>Nukleus & Nukleolus</text>

                  {/* Mitokondria Banyak */}
                  <ellipse cx="160" cy="100" rx="30" ry="18" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
                  <text x="160" y="130" textAnchor="middle" fill="#7c2d12" style={{ fontSize: '10px', fontWeight: 'bold' }}>Mitokondria</text>

                  <ellipse cx="440" cy="210" rx="30" ry="18" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
                  <text x="440" y="240" textAnchor="middle" fill="#7c2d12" style={{ fontSize: '10px', fontWeight: 'bold' }}>Mitokondria</text>

                  {/* Sentriol Sepasang Silinder 90 Derajat */}
                  <g>
                    <rect x="230" y="80" width="16" height="26" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                    <rect x="240" y="90" width="26" height="16" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                    <text x="250" y="70" textAnchor="middle" fill="#92400e" style={{ fontSize: '11px', fontWeight: 'bold' }}>Sentriol (Spindel)</text>
                  </g>

                  {/* Lisosom Penuh Enzim Hidrolitik */}
                  <circle cx="160" cy="220" r="18" fill="#fbcfe8" stroke="#db2777" strokeWidth="2" />
                  <text x="160" y="250" textAnchor="middle" fill="#9d174d" style={{ fontSize: '10px', fontWeight: 'bold' }}>Lisosom</text>

                  {/* Aparatus Golgi */}
                  <g>
                    <path d="M410 110 Q430 100 450 110 M408 120 Q430 110 452 120 M410 130 Q430 120 450 130" stroke="#0284c7" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <text x="430" y="150" textAnchor="middle" fill="#0369a1" style={{ fontSize: '10px', fontWeight: 'bold' }}>Aparatus Golgi</text>
                  </g>

                  <text x="100" y="40" fill="#9f1239" style={{ fontSize: '12px', fontWeight: 'bold' }}>Membran Sel Lentur (Tanpa Dinding Sel)</text>
                </g>
              )}
            </svg>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Keterangan: </span>
              {illustration.caption}
            </div>
          </div>
        </div>
      );

    case 'digestive_organs':
    case 'digestive_pathway':
      return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-amber-100 shadow-sm">
          <div className="bg-amber-950/5 rounded-xl p-4 flex flex-col items-center">
            <svg
              viewBox="0 0 600 340"
              className="w-full max-w-xl h-auto drop-shadow-sm select-none"
              aria-label={illustration.altText}
              role="img"
            >
              {/* Mulut */}
              <circle cx="280" cy="35" r="22" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              <text x="280" y="40" textAnchor="middle" fill="#9a3412" style={{ fontSize: '11px', fontWeight: 'bold' }}>1. Mulut</text>
              <line x1="280" y1="57" x2="280" y2="75" stroke="#78350f" strokeWidth="3" />

              {/* Faring & Kerongkongan */}
              <rect x="272" y="75" width="16" height="55" rx="6" fill="#fcd34d" stroke="#d97706" strokeWidth="2" />
              <text x="350" y="95" fill="#b45309" style={{ fontSize: '11px', fontWeight: 'bold' }}>2. Esofagus (Peristaltik)</text>
              <line x1="288" y1="95" x2="340" y2="95" stroke="#d97706" strokeDasharray="3,2" />

              {/* Lambung */}
              <path d="M265 130 C240 140 230 175 260 190 C300 200 320 180 305 145 Z" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
              <text x="275" y="165" textAnchor="middle" fill="#ffffff" style={{ fontSize: '11px', fontWeight: 'bold' }}>3. Lambung</text>
              <text x="275" y="178" textAnchor="middle" fill="#fee2e2" style={{ fontSize: '9px' }}>HCl & Pepsin</text>

              {/* Hati & Pankreas */}
              <polygon points="170,140 235,145 220,185" fill="#b45309" opacity="0.8" />
              <text x="175" y="160" fill="#451a03" style={{ fontSize: '11px', fontWeight: 'bold' }}>Hati (Empedu)</text>

              <ellipse cx="330" cy="175" rx="25" ry="10" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
              <text x="375" y="175" fill="#854d0e" style={{ fontSize: '10px', fontWeight: 'bold' }}>Pankreas (ALiT)</text>

              {/* Usus Halus Berlipat */}
              <rect x="240" y="200" width="85" height="60" rx="14" fill="#fed7aa" stroke="#f97316" strokeWidth="2" />
              <path d="M250 215 Q280 205 285 225 Q260 235 270 250" stroke="#c2410c" strokeWidth="3" fill="none" />
              <text x="365" y="230" fill="#9a3412" style={{ fontSize: '11px', fontWeight: 'bold' }}>4. Usus Halus (Vili)</text>
              <text x="365" y="244" fill="#c2410c" style={{ fontSize: '9px' }}>Absorpsi sari makanan</text>

              {/* Usus Besar Mengelilingi */}
              <rect x="215" y="190" width="135" height="90" rx="18" fill="none" stroke="#65a30d" strokeWidth="6" />
              <text x="120" y="235" fill="#3f6212" style={{ fontSize: '11px', fontWeight: 'bold' }}>5. Usus Besar (Kolon)</text>
              <text x="120" y="248" fill="#4d7c0f" style={{ fontSize: '9px' }}>Reabsorpsi air & E. coli</text>

              {/* Rektum & Anus */}
              <rect x="273" y="285" width="16" height="30" rx="4" fill="#a8a29e" stroke="#57534e" strokeWidth="2" />
              <text x="280" y="330" textAnchor="middle" fill="#44403c" style={{ fontSize: '11px', fontWeight: 'bold' }}>6. Anus (Defekasi)</text>
            </svg>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Keterangan: </span>
              {illustration.caption}
            </div>
          </div>
        </div>
      );

    case 'respiratory_system':
      return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-rose-100 shadow-sm">
          <div className="bg-rose-950/5 rounded-xl p-4 flex flex-col items-center">
            <svg
              viewBox="0 0 600 320"
              className="w-full max-w-xl h-auto drop-shadow-sm select-none"
              aria-label={illustration.altText}
              role="img"
            >
              {/* Rongga Hidung */}
              <circle cx="260" cy="30" r="16" fill="#fecdd3" stroke="#e11d48" strokeWidth="2" />
              <text x="170" y="35" fill="#9f1239" style={{ fontSize: '11px', fontWeight: 'bold' }}>1. Rongga Hidung (Konka)</text>

              {/* Laring & Trakea */}
              <line x1="260" y1="46" x2="260" y2="120" stroke="#fda4af" strokeWidth="12" />
              {/* Cincin Tulang Rawan Huruf C */}
              <line x1="254" y1="65" x2="266" y2="65" stroke="#9f1239" strokeWidth="2" />
              <line x1="254" y1="80" x2="266" y2="80" stroke="#9f1239" strokeWidth="2" />
              <line x1="254" y1="95" x2="266" y2="95" stroke="#9f1239" strokeWidth="2" />
              <line x1="254" y1="110" x2="266" y2="110" stroke="#9f1239" strokeWidth="2" />
              <text x="320" y="85" fill="#9f1239" style={{ fontSize: '11px', fontWeight: 'bold' }}>2. Trakea (Cincin C)</text>

              {/* Bronkus Bercabang Dua */}
              <line x1="260" y1="120" x2="210" y2="160" stroke="#e11d48" strokeWidth="6" />
              <line x1="260" y1="120" x2="310" y2="160" stroke="#e11d48" strokeWidth="6" />
              <text x="145" y="145" fill="#9f1239" style={{ fontSize: '10px', fontWeight: 'bold' }}>Bronkus Utama</text>

              {/* Paru-paru Kanan (3 lobus) dan Kiri (2 lobus) */}
              <ellipse cx="185" cy="205" rx="65" ry="75" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="2" />
              <text x="185" y="210" textAnchor="middle" fill="#9f1239" style={{ fontSize: '12px', fontWeight: 'bold' }}>Paru Kanan (3 Lobus)</text>

              <ellipse cx="335" cy="205" rx="60" ry="75" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="2" />
              <text x="335" y="210" textAnchor="middle" fill="#9f1239" style={{ fontSize: '12px', fontWeight: 'bold' }}>Paru Kiri (2 Lobus)</text>

              {/* Zoom In Alveolus */}
              <circle cx="490" cy="180" r="48" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" strokeDasharray="4,2" />
              <circle cx="475" cy="175" r="16" fill="#fecdd3" stroke="#e11d48" strokeWidth="1.5" />
              <circle cx="500" cy="165" r="14" fill="#fecdd3" stroke="#e11d48" strokeWidth="1.5" />
              <circle cx="495" cy="195" r="15" fill="#fecdd3" stroke="#e11d48" strokeWidth="1.5" />
              <text x="490" y="245" textAnchor="middle" fill="#9f1239" style={{ fontSize: '11px', fontWeight: 'bold' }}>Alveolus & Kapiler</text>
              <text x="490" y="258" textAnchor="middle" fill="#0284c7" style={{ fontSize: '9px' }}>Pertukaran O2 & CO2</text>

              {/* Garis Diafragma */}
              <path d="M110 290 Q260 255 410 290" stroke="#b91c1c" strokeWidth="5" fill="none" />
              <text x="260" y="310" textAnchor="middle" fill="#991b1b" style={{ fontSize: '11px', fontWeight: 'bold' }}>Diafragma (Mendatar saat Inspirasi)</text>
            </svg>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Keterangan: </span>
              {illustration.caption}
            </div>
          </div>
        </div>
      );

    case 'heart_anatomy':
    case 'blood_circulation':
      return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-rose-100 shadow-sm">
          <div className="bg-rose-950/5 rounded-xl p-4 flex flex-col items-center">
            <svg
              viewBox="0 0 600 330"
              className="w-full max-w-xl h-auto drop-shadow-sm select-none"
              aria-label={illustration.altText}
              role="img"
            >
              {/* Paru-paru di Atas */}
              <rect x="220" y="15" width="160" height="42" rx="10" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="2" />
              <text x="300" y="34" textAnchor="middle" fill="#9f1239" style={{ fontSize: '12px', fontWeight: 'bold' }}>PARU-PARU (PULMO)</text>
              <text x="300" y="48" textAnchor="middle" fill="#e11d48" style={{ fontSize: '9px' }}>Pelepasan CO2 & Pengikatan O2</text>

              {/* Jantung 4 Ruang di Tengah */}
              <g>
                <rect x="180" y="100" width="240" height="135" rx="18" fill="#ffffff" stroke="#991b1b" strokeWidth="3" />
                <line x1="300" y1="100" x2="300" y2="235" stroke="#7f1d1d" strokeWidth="3" />
                <line x1="180" y1="165" x2="420" y2="165" stroke="#7f1d1d" strokeWidth="2" />

                {/* Atrium Kanan (Serambi Kanan - Biru CO2) */}
                <rect x="185" y="105" width="110" height="55" rx="8" fill="#dbeafe" />
                <text x="240" y="128" textAnchor="middle" fill="#1e40af" style={{ fontSize: '11px', fontWeight: 'bold' }}>Atrium Kanan</text>
                <text x="240" y="145" textAnchor="middle" fill="#2563eb" style={{ fontSize: '9px' }}>Darah Kaya CO2</text>

                {/* Atrium Kiri (Serambi Kiri - Merah O2) */}
                <rect x="305" y="105" width="110" height="55" rx="8" fill="#fee2e2" />
                <text x="360" y="128" textAnchor="middle" fill="#991b1b" style={{ fontSize: '11px', fontWeight: 'bold' }}>Atrium Kiri</text>
                <text x="360" y="145" textAnchor="middle" fill="#dc2626" style={{ fontSize: '9px' }}>Darah Kaya O2</text>

                {/* Ventrikel Kanan (Bilik Kanan - Biru) */}
                <rect x="185" y="170" width="110" height="60" rx="8" fill="#bfdbfe" />
                <text x="240" y="196" textAnchor="middle" fill="#1e40af" style={{ fontSize: '11px', fontWeight: 'bold' }}>Ventrikel Kanan</text>
                <text x="240" y="213" textAnchor="middle" fill="#1d4ed8" style={{ fontSize: '9px' }}>Memompa ke Paru</text>

                {/* Ventrikel Kiri (Bilik Kiri - Merah Tua Miokardium Tebal) */}
                <rect x="305" y="170" width="110" height="60" rx="8" fill="#fca5a5" stroke="#b91c1c" strokeWidth="2" />
                <text x="360" y="196" textAnchor="middle" fill="#7f1d1d" style={{ fontSize: '11px', fontWeight: 'bold' }}>Ventrikel Kiri</text>
                <text x="360" y="213" textAnchor="middle" fill="#991b1b" style={{ fontSize: '9px' }}>Memompa ke Aorta (Tebal)</text>
              </g>

              {/* Jaringan Tubuh di Bawah */}
              <rect x="200" y="275" width="200" height="42" rx="10" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
              <text x="300" y="294" textAnchor="middle" fill="#334155" style={{ fontSize: '12px', fontWeight: 'bold' }}>SELURUH JARINGAN TUBUH</text>
              <text x="300" y="308" textAnchor="middle" fill="#475569" style={{ fontSize: '9px' }}>O2 diserap sel, CO2 dibuang ke darah</text>

              {/* Alur Sirkulasi Pulmonalis (Kecil) */}
              <path d="M220 170 Q140 120 220 40" fill="none" stroke="#2563eb" strokeWidth="4" />
              <text x="130" y="80" fill="#1e40af" style={{ fontSize: '10px', fontWeight: 'bold' }}>Arteri Pulmonalis (CO2)</text>

              <path d="M380 40 Q460 100 380 105" fill="none" stroke="#dc2626" strokeWidth="4" />
              <text x="440" y="75" fill="#991b1b" style={{ fontSize: '10px', fontWeight: 'bold' }}>Vena Pulmonalis (O2)</text>

              {/* Alur Sirkulasi Sistemik (Besar) */}
              <path d="M380 230 Q470 260 370 280" fill="none" stroke="#dc2626" strokeWidth="4" />
              <text x="440" y="260" fill="#991b1b" style={{ fontSize: '10px', fontWeight: 'bold' }}>Aorta Sistemik (O2)</text>

              <path d="M230 280 Q130 250 220 160" fill="none" stroke="#2563eb" strokeWidth="4" />
              <text x="110" y="240" fill="#1e40af" style={{ fontSize: '10px', fontWeight: 'bold' }}>Vena Kava (CO2)</text>
            </svg>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Keterangan: </span>
              {illustration.caption}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
          <p className="font-semibold text-slate-700">{illustration.title}</p>
          <p className="text-sm text-slate-500 mt-1">{illustration.caption}</p>
        </div>
      );
  }
};
