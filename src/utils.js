import { RESULTS, MIN_BET, MAX_BET } from './data';

export const MAX_BET_DYNAMIC = (score) => Math.min(500, score);

export const validateBet = (bet, score) => {
  if (isNaN(bet) || bet <= 0) return 'Mức cược phải là số lớn hơn 0';
  if (bet < MIN_BET) return `Mức cược tối thiểu là ${MIN_BET}`;
  if (bet > score) return 'Mức cược vượt quá số điểm hiện có';
  if (bet > MAX_BET) return `Mức cược tối đa là ${MAX_BET}`;
  if (bet % 100 !== 0) return 'Mức cược phải là bội số của 100';
  return '';
};

export const calcChange = (bet, level, correct) => {
  const multipliers = { 1: 1, 2: 1.5, 3: 2 };
  const mult = multipliers[level] || 1;
  return correct ? bet * mult : -bet;
};

export const getResult = (score) => {
  const found = RESULTS.find((r) => score >= r.min);
  return found ? found.title : 'Cháy túi';
};