import React from 'react';
import { LEVELS, formatMultiplier } from '../data';
import { AnswerButton } from './AnswerButton';
import { ScoreInfo } from './ScoreInfo';
import { Timer } from './Timer';
import { Supports } from './Supports';

export const QuestionCard = ({
  currentQuestionIndex,
  totalQuestions,
  question,
  score,
  bet,
  timeLeft,
  setTimeLeft,
  selectedOption,
  revealed,
  onSelectOption,
  onTimeout,
  usedPreview,
  usedInsurance,
  usedHint,
  onUsePreview,
  onUseInsurance,
  onUseHint,
  showHint,
  insured,
  isCorrect,
}) => {
  const multVal = question.level === 1 ? 1 : question.level === 2 ? 1.5 : 2;

  return (
    <div style={{ maxWidth: '650px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <span style={{ fontSize: '16px', color: '#444', fontWeight: 'bold' }}>
          Câu {currentQuestionIndex + 1}/{totalQuestions} · {question.topic} · {LEVELS[question.level]} ({formatMultiplier(multVal)})
        </span>
        <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onTimeout={onTimeout} active={!revealed} />
      </div>

      <ScoreInfo score={score} bet={bet} />

      <Supports
        step="answering"
        usedPreview={usedPreview}
        usedInsurance={usedInsurance}
        usedHint={usedHint}
        onUsePreview={onUsePreview}
        onUseInsurance={onUseInsurance}
        onUseHint={onUseHint}
      />

      <h3 style={{ margin: '20px 0', fontSize: '18px' }}>{question.question}</h3>

      {showHint && (
        <p style={{ fontStyle: 'italic', color: '#0288d1', background: '#e1f5fe', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          <strong>Gợi ý:</strong> {question.hint}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {question.options.map((opt, index) => (
          <AnswerButton
            key={index}
            index={index}
            option={opt}
            selectedOption={selectedOption}
            correctOption={question.answer}
            revealed={revealed}
            onClick={() => onSelectOption(index)}
          />
        ))}
      </div>

      {revealed && (
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
          {isCorrect ? (
            <span style={{ color: '#2e7d32' }}>
              +{(bet * multVal).toLocaleString('vi-VN')} điểm
            </span>
          ) : insured ? (
            <span style={{ color: '#9c27b0' }}>
              Bảo hiểm: không bị trừ điểm
            </span>
          ) : (
            <span style={{ color: '#d32f2f' }}>
              -{(bet).toLocaleString('vi-VN')} điểm
            </span>
          )}
        </div>
      )}
    </div>
  );
};