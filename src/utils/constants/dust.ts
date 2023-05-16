import { GradeType } from '@/types/dust';

export const FINE_DUST = '미세먼지';
export const ULTRA_FINE_DUST = '초미세먼지';

export const DUST_GRADE: { [key: number]: GradeType } = {
  1: 'GOOD',
  2: 'NORMAL',
  3: 'BAD',
  4: 'DANGER',
};

export const DEFAULT_SIDO_DUST_INFO = {
  sidoName: '정보를 불러오지 못했어요',
  fineDustScale: 9999,
  fineDustGrade: 9999,
  ultraFineDustScale: 9999,
  ultraFineDustGrade: 9999,
};
