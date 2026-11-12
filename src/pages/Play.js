import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { START_SCORE, MIN_BET, TIME_PER_QUESTION } from '../data';
import { calcChange, getResult } from '../utils';
import { BetPanel } from '../components/BetPanel';
import { QuestionCard } from '../components/QuestionCard';

export const Play = ({ questions, playerName, addHistory }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [bet, setBet] = useState(0);
  const [status, setStatus] = useState('betting'); // 'betting' | 'answering' | 'revealed'
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [rounds, setRounds] = useState([]);

  // Quyền trợ giúp (mỗi quyền dùng 1 lần trong lượt chơi)
  const [usedPreview, setUsedPreview] = useState(false);
  const [usedInsurance, setUsedInsurance] = useState(false);
  const [usedHint, setUsedHint] = useState(false);

  // Trạng thái trợ giúp trong câu hiện tại
  const [showPreview, setShowPreview] = useState(false);
  const [insured, setInsured] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // 1. Tiêu đề tab động (Hook useEffect)
  useEffect(() => {
    if (!playerName) return;
    const qNum = currentIndex + 1;
    if (status === 'betting') {
      document.title = `Câu ${qNum}/12 – đặt cược`;
    } else if (status === 'answering' || status === 'revealed') {
      document.title = `Câu ${qNum}/12 – cược ${bet}`;
    }

    return () => {
      document.title = 'Đặt cược kiến thức';
    };
  }, [currentIndex, status, bet, playerName]);

  // 2. Xử lý chuyển câu/kết quả sau khi reveal (Hook useEffect)
  useEffect(() => {
    if (!playerName || status !== 'revealed') return;

    const timeoutId = setTimeout(() => {
      const lastRound = rounds[rounds.length - 1];
      const currentScoreAfter = lastRound ? lastRound.scoreAfter : score;

      const isBroke = currentScoreAfter < MIN_BET;
      const isLastQuestion = currentIndex + 1 >= questions.length;

      if (isBroke || isLastQuestion) {
        const correctCount = rounds.filter((r) => r.correct).length;
        const evaluation = getResult(currentScoreAfter);
        const reason = isBroke ? 'broke' : 'completed';

        const historyItem = {
          id: Date.now(),
          name: playerName,
          finalScore: currentScoreAfter,
          correctCount,
          played: rounds.length,
          result: evaluation,
          playedAt: new Date().toLocaleString('vi-VN'),
        };

        addHistory(historyItem);

        navigate('/result', {
          replace: true,
          state: {
            playerName,
            rounds,
            finalScore: currentScoreAfter,
            correctCount,
            totalPlayed: rounds.length,
            evaluation,
            reason,
          },
        });
      } else {
        setCurrentIndex((prev) => prev + 1);
        setStatus('betting');
        setSelectedOption(null);
        setBet(0);
        setTimeLeft(TIME_PER_QUESTION);
        setShowPreview(false);
        setInsured(false);
        setShowHint(false);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [status, rounds, score, currentIndex, questions, playerName, navigate, addHistory]);

  // Kiểm tra điều kiện chuyển hướng SAU KHI tất cả các hooks đã được khai báo xong
  if (!playerName) {
    return <Navigate to="/" replace />;
  }

  const currentQuestion = questions[currentIndex];

  const handleUsePreview = () => {
    if (!usedPreview && status === 'betting') {
      setUsedPreview(true);
      setShowPreview(true);
    }
  };

  const handleUseInsurance = () => {
    if (!usedInsurance) {
      setUsedInsurance(true);
      setInsured(true);
    }
  };

  const handleUseHint = () => {
    if (!usedHint && status === 'answering') {
      setUsedHint(true);
      setShowHint(true);
    }
  };

  const handleAnswer = (optionIndex) => {
    if (status !== 'answering') return;

    setStatus('revealed');
    setSelectedOption(optionIndex);

    const isCorrect = optionIndex === currentQuestion.answer;
    let change = 0;
    if (isCorrect) {
      const multVal = currentQuestion.level === 1 ? 1 : currentQuestion.level === 2 ? 1.5 : 2;
      change = bet * multVal;
    } else {
      change = insured ? 0 : -bet;
    }

    const newScore = Math.max(0, score + change);

    const roundData = {
      id: currentQuestion.id,
      bet,
      correct: isCorrect,
      change,
      scoreAfter: newScore,
      insuredUsed: insured && !isCorrect,
    };

    setRounds((prev) => [...prev, roundData]);
    setScore(newScore);
  };

  const handleTimeout = () => {
    if (status !== 'answering') return;

    setStatus('revealed');
    setSelectedOption(null);

    const change = insured ? 0 : -bet;
    const newScore = Math.max(0, score + change);

    const roundData = {
      id: currentQuestion.id,
      bet,
      correct: false,
      change,
      scoreAfter: newScore,
      insuredUsed: insured,
    };

    setRounds((prev) => [...prev, roundData]);
    setScore(newScore);
  };

  const handlePlaceBet = (betAmount) => {
    setBet(betAmount);
    setStatus('answering');
    setTimeLeft(TIME_PER_QUESTION);
  };

  if (!currentQuestion) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải câu hỏi...</div>;

  const lastRound = rounds[rounds.length - 1];
  const isCorrect = lastRound ? lastRound.correct : false;

  return (
    <div>
      {status === 'betting' && (
        <BetPanel
          currentQuestionIndex={currentIndex}
          totalQuestions={questions.length}
          question={currentQuestion}
          score={score}
          onPlaceBet={handlePlaceBet}
          usedPreview={usedPreview}
          usedInsurance={usedInsurance}
          usedHint={usedHint}
          onUsePreview={handleUsePreview}
          onUseInsurance={handleUseInsurance}
          onUseHint={handleUseHint}
          showPreview={showPreview}
        />
      )}

      {(status === 'answering' || status === 'revealed') && (
        <QuestionCard
          currentQuestionIndex={currentIndex}
          totalQuestions={questions.length}
          question={currentQuestion}
          score={score}
          bet={bet}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          selectedOption={selectedOption}
          revealed={status === 'revealed'}
          onSelectOption={handleAnswer}
          onTimeout={handleTimeout}
          usedPreview={usedPreview}
          usedInsurance={usedInsurance}
          usedHint={usedHint}
          onUsePreview={handleUsePreview}
          onUseInsurance={handleUseInsurance}
          onUseHint={handleUseHint}
          showHint={showHint}
          insured={insured}
          isCorrect={isCorrect}
        />
      )}
    </div>
  );
};