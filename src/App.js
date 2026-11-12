/* eslint-disable import/first */
const BUILD_TAG = "dc-2964";

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Play } from './pages/Play';
import { Result } from './pages/Result';
import { QuestionBank } from './pages/QuestionBank';
import { QuestionDetail } from './pages/QuestionDetail';
import { History } from './pages/History';
import { NotFound } from './pages/NotFound';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('ltw_cuoc_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ltw_cuoc_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    localStorage.setItem('ltw_cuoc_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('ltw_cuoc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const addHistory = (item) => {
    setHistory((prev) => [item, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleLookupShift = (e) => {
    // Hàm xử lý tìm kiếm theo yêu cầu bắt buộc
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải câu hỏi...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Không tải được câu hỏi</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home playerName={playerName} setPlayerName={setPlayerName} history={history} />} />
        <Route
          path="play"
          element={<Play questions={questions} playerName={playerName} addHistory={addHistory} />}
        />
        <Route path="result" element={<Result />} />
        <Route
          path="questions"
          element={
            <QuestionBank
              questions={questions}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
              handleLookupShift={handleLookupShift}
            />
          }
        />
        <Route
          path="questions/:id"
          element={
            <QuestionDetail
              questions={questions}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
            />
          }
        />
        <Route path="history" element={<History history={history} clearHistory={clearHistory} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;