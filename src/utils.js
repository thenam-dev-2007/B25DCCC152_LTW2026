import { BET_STEP, MIN_BET, MAX_BET, MULTIPLIERS, RESULTS } from './data';

export const validateBet = (bet, score) => {
    const amount = Number(bet);

    if (
        !Number.isInteger(amount)
        || amount < MIN_BET
        || amount > MAX_BET
        || amount % BET_STEP !== 0
        || amount > score
    ) 
    {
        return 'Mức cược phải là bội số của 100, từ 100 đến 500 và không vượt quá số điểm đang có';
    }

    return '';
};

export const calcChange = (bet, level, correct) => (
  correct ? bet * MULTIPLIERS[level] : -bet
);

export const getResult = (score) => (
    RESULTS.find(({ min }) => score >= min) || RESULTS[RESULTS.length - 1]
);