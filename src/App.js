import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, NavLink, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { formatMultiplier, LEVELS, LETTERS, MULTIPLIERS } from './data';

const Layout = () => (
  <>
    <NavBar />
    <main className="app-main">
      <Outlet />
    </main>
  </>
);

const NavBar = () => (
  <nav className="navbar">
    <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
      Trang chủ
    </NavLink>

    <NavLink
      to="/questions"
      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
    >
      Ngân hàng câu hỏi
    </NavLink>

    <NavLink
      to="/history"
      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
    >
      Lịch sử
    </NavLink>
  </nav>
);

const Home = () => <h2>Trang chủ</h2>;

const Placeholder = ({ title }) => <h2>{title}</h2>;

const NotFound = () => (
  <section>
    <h2>404 - Không tìm thấy trang</h2>
    <Link to="/">Về trang chủ</Link>
  </section>
);

const QuestionBank = ({
  questions,
  bookmarks,
  toggleBookmark,
  loading,
  error,
}) => {
  const [selectedLevels, setSelectedLevels] = useState([1, 2, 3]);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [query, setQuery] = useState('');

  const handleLookupShift = (event) => {
    setQuery(event.target.value);
  };

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p className="error-message">Không tải được câu hỏi.</p>;
  }

  const filteredQuestions = questions.filter((question) => {
    const matchesLevel = selectedLevels.includes(question.level);
    const matchesBookmark = !onlyBookmarked || bookmarks.includes(question.id);
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    const matchesQuery = question.question
      .toLocaleLowerCase('vi')
      .includes(normalizedQuery);

    return matchesLevel && matchesBookmark && matchesQuery;
  });

  const handleLevelChange = (level) => {
    setSelectedLevels((currentLevels) => (
      currentLevels.includes(level)
        ? currentLevels.filter((currentLevel) => currentLevel !== level)
        : [...currentLevels, level]
    ));
  };

  return (
    <section>
      <h2>Ngân hàng câu hỏi</h2>

      <div className="filters">
        <fieldset className="level-filters">
          <legend>Mức độ</legend>

          {Object.entries(LEVELS).map(([level, label]) => {
            const numericLevel = Number(level);

            return (
              <label key={level} className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedLevels.includes(numericLevel)}
                  onChange={() => handleLevelChange(numericLevel)}
                />
                {label}
              </label>
            );
          })}
        </fieldset>

        <label className="filter-label">
          <input
            type="checkbox"
            checked={onlyBookmarked}
            onChange={(event) => setOnlyBookmarked(event.target.checked)}
          />
          Chỉ hiện câu đã đánh dấu
        </label>

        <label className="search-label">
          Tìm kiếm theo nội dung câu hỏi
          <input
            type="search"
            value={query}
            onChange={handleLookupShift}
            placeholder="Nhập nội dung cần tìm..."
          />
        </label>
      </div>

      <p>Có {filteredQuestions.length} câu hỏi</p>
      <p>Đã đánh dấu: {bookmarks.length} câu</p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Chủ đề</th>
              <th>Mức độ</th>
              <th>Hệ số</th>
              <th>Câu hỏi</th>
              <th>Đánh dấu</th>
            </tr>
          </thead>

          <tbody>
            {filteredQuestions.map((question, index) => {
              const isBookmarked = bookmarks.includes(question.id);

              return (
                <tr key={question.id}>
                  <td>{index + 1}</td>
                  <td>{question.topic}</td>
                  <td>{LEVELS[question.level]}</td>
                  <td>{formatMultiplier(MULTIPLIERS[question.level])}</td>
                  <td>
                    <Link to={`/questions/${question.id}`}>
                      {question.question}
                    </Link>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="bookmark-button"
                      onClick={() => toggleBookmark(question.id)}
                      aria-label={isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredQuestions.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-row">
                  Không có câu hỏi phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const QuestionDetail = ({
  questions,
  bookmarks,
  toggleBookmark,
  loading,
  error,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p className="error-message">Không tải được câu hỏi.</p>;
  }

  const question = questions.find((item) => item.id === Number(id));

  if (!question) {
    return <p>Không tìm thấy câu hỏi.</p>;
  }

  const isBookmarked = bookmarks.includes(question.id);

  return (
    <section>
      <h2>
        Câu hỏi số {question.id} – {question.topic} · {LEVELS[question.level]} (
        {formatMultiplier(MULTIPLIERS[question.level])})
      </h2>

      <p className="question-text">{question.question}</p>

      <ol className="answer-list">
        {question.options.map((option, index) => {
          const isCorrect = index === question.answer;

          return (
            <li
              key={`${question.id}-${LETTERS[index]}`}
              className={isCorrect ? 'answer-option correct-answer' : 'answer-option'}
            >
              <span>{LETTERS[index]}. {option}</span>
              {isCorrect && <strong> (Đáp án đúng)</strong>}
            </li>
          );
        })}
      </ol>

      <p><strong>Gợi ý:</strong> {question.hint}</p>

      <div className="detail-actions">
        <button type="button" onClick={() => toggleBookmark(question.id)}>
          {isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
        </button>

        <button type="button" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    </section>
  );
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadQuestions = async () => {
      try {
        const response = await axios.get('/data/questions.json', {
          signal: controller.signal,
        });

        setQuestions(response.data);
        setError(false);
      } catch (requestError) {
        if (
          axios.isCancel(requestError)
          || requestError.code === 'ERR_CANCELED'
        ) {
          return;
        }

        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      controller.abort();
    };
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((currentBookmarks) => (
      currentBookmarks.includes(id)
        ? currentBookmarks.filter((bookmarkId) => bookmarkId !== id)
        : [...currentBookmarks, id]
    ));
  };

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="play" element={<Placeholder title="Màn hình chơi" />} />
        <Route path="result" element={<Placeholder title="Kết quả" />} />
        <Route path="history" element={<Placeholder title="Lịch sử" />} />

        <Route
          path="questions"
          element={(
            <QuestionBank
              questions={questions}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
              loading={loading}
              error={error}
            />
          )}
        />

        <Route
          path="questions/:id"
          element={(
            <QuestionDetail
              questions={questions}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
              loading={loading}
              error={error}
            />
          )}
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;