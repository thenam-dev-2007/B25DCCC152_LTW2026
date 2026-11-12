import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS, formatMultiplier } from '../data';

export const QuestionBank = ({ questions, bookmarks, toggleBookmark, handleLookupShift }) => {
  const [selectedLevels, setSelectedLevels] = useState([1, 2, 3]);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLevelChange = (lvl) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  // Hàm xử lý khi gõ vào ô tìm kiếm theo yêu cầu bắt buộc
  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
    handleLookupShift(e);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchLevel = selectedLevels.includes(q.level);
    const matchBookmark = bookmarkedOnly ? bookmarks.includes(q.id) : true;
    const matchSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchLevel && matchBookmark && matchSearch;
  });

  const bookmarkedCount = questions.filter((q) => bookmarks.includes(q.id)).length;

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>

      <div style={{ marginBottom: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Mức độ: </strong>
          {[1, 2, 3].map((lvl) => (
            <label key={lvl} style={{ marginRight: '15px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedLevels.includes(lvl)}
                onChange={() => handleLevelChange(lvl)}
              />{' '}
              {LEVELS[lvl]}
            </label>
          ))}
          <label style={{ cursor: 'pointer', marginLeft: '10px' }}>
            <input
              type="checkbox"
              checked={bookmarkedOnly}
              onChange={(e) => setBookmarkedOnly(e.target.checked)}
            />{' '}
            Chỉ hiện câu đã đánh dấu
          </label>
        </div>

        <div>
          <label>
            <strong>Tìm kiếm: </strong>
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Nhập nội dung câu hỏi..."
              style={{ padding: '5px', width: '250px', marginLeft: '5px' }}
            />
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        <span>Có {filteredQuestions.length} câu hỏi</span> | <span>Đã đánh dấu: {bookmarkedCount} câu</span>
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>STT</th>
            <th>Chủ đề</th>
            <th>Mức độ</th>
            <th>Hệ số</th>
            <th>Câu hỏi</th>
            <th>Đánh dấu</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q, index) => (
              <tr key={q.id}>
                <td>{index + 1}</td>
                <td>{q.topic}</td>
                <td>{LEVELS[q.level]}</td>
                <td>{formatMultiplier(LEVELS[q.level] === 'Dễ' ? 1 : LEVELS[q.level] === 'Trung bình' ? 1.5 : 2)}</td>
                <td>
                  <Link to={`/questions/${q.id}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                    {q.question}
                  </Link>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                  >
                    {bookmarks.includes(q.id) ? '★' : '☆'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                Không tìm thấy câu hỏi phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};