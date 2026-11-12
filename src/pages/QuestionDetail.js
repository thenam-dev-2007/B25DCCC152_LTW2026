import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS, formatMultiplier } from '../data';

export const QuestionDetail = ({ questions, bookmarks, toggleBookmark }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const questionId = Number(id);
  const question = questions.find((q) => q.id === questionId);

  if (!question) {
    return (
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <h3>Không tìm thấy câu hỏi</h3>
        <button onClick={() => navigate(-1)} style={{ padding: '8px 15px', cursor: 'pointer' }}>
          Quay lại
        </button>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(question.id);
  const multVal = question.level === 1 ? 1 : question.level === 2 ? 1.5 : 2;

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '15px', padding: '5px 10px', cursor: 'pointer' }}>
        &larr; Quay lại
      </button>

      <h3>
        Câu hỏi số {question.id} – {question.topic} · {LEVELS[question.level]} ({formatMultiplier(multVal)})
      </h3>

      <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{question.question}</p>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {question.options.map((opt, index) => {
          const isCorrect = index === question.answer;
          return (
            <li
              key={index}
              style={{
                padding: '10px',
                margin: '8px 0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: isCorrect ? '#e8f5e9' : '#fff',
                borderColor: isCorrect ? '#4caf50' : '#ccc',
              }}
            >
              <strong>{LETTERS[index]}.</strong> {opt}{' '}
              {isCorrect && <span style={{ color: '#2e7d32', fontWeight: 'bold', marginLeft: '10px' }}>(Đáp án đúng)</span>}
            </li>
          );
        })}
      </ul>

      <p style={{ fontStyle: 'italic', marginTop: '15px', color: '#555' }}>
        <strong>Gợi ý:</strong> {question.hint}
      </p>

      <button
        onClick={() => toggleBookmark(question.id)}
        style={{
          marginTop: '15px',
          padding: '8px 15px',
          cursor: 'pointer',
          backgroundColor: isBookmarked ? '#ffc107' : '#e0e0e0',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        {isBookmarked ? '★ Bỏ đánh dấu' : '☆ Đánh dấu'}
      </button>
    </div>
  );
};