import { SubMateri } from '../types/biology';
import { materi1Keanekaragaman } from './materi1_keanekaragaman';
import { materi2Ekosistem } from './materi2_ekosistem';
import { materi3SelJaringan } from './materi3_sel_jaringan';
import { materi4Pencernaan } from './materi4_pencernaan';
import { materi5PernapasanPeredaran } from './materi5_pernapasan_peredaran';

export const allSubMateriList: SubMateri[] = [
  materi1Keanekaragaman,
  materi2Ekosistem,
  materi3SelJaringan,
  materi4Pencernaan,
  materi5PernapasanPeredaran,
];

export const getSubMateriById = (id: string): SubMateri | undefined => {
  return allSubMateriList.find((m) => m.id === id);
};

export const getSubMateriByNumber = (num: number): SubMateri | undefined => {
  return allSubMateriList.find((m) => m.number === num);
};
