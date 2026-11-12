import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  BET_STEP,
  formatMultiplier,
  formatScore,
  LEVELS,
  LETTERS,
  MAX_BET,
  MIN_BET,
  MULTIPLIERS,
  RESULTS,
  START_SCORE,
  TIME_PER_QUESTION,
} from './data';
import { calcChange, getResult, validateBet } from './utils';

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

const Home = ({ playerName, onPlayerNameChange }) => {
  const navigate = useNavigate();
  const validName = playerName.trim().length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validName) {
      navigate('/play');
    }
  };

  return (
    <section>
      <h1>Đặt cược kiến thức</h1>

      <p>
        Bắt đầu với 1.000 điểm và trả lời 12 câu hỏi về HTML, CSS,
        JavaScript và React.
      </p>
      <p>
        Trước mỗi câu, hãy chọn mức cược từ 100 đến 500 điểm.
        Trả lời đúng sẽ được cộng điểm theo hệ số của câu hỏi.
      </p>

      <form className="player-form" onSubmit={handleSubmit}>
        <label htmlFor="player-name">Tên người chơi</label>
        <input
          id="player-name"
          type="text"
          value={playerName}
          onChange={(event) => onPlayerNameChange(event.target.value)}
          placeholder="Nhập tên của bạn"
        />
        <button type="submit" disabled={!validName}>
          Vào chơi
        </button>
      </form>
    </section>
  );
};

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

  const normalizedQuery = query.trim().toLocaleLowerCase('vi');
  const filteredQuestions = questions.filter((question) => {
    const matchesLevel = selectedLevels.includes(question.level);
    const matchesBookmark = !onlyBookmarked || bookmarks.includes(question.id);
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

const BetPanel = ({
  question,
  questionNumber,
  totalQuestions,
  score,
  bet,
  onBetChange,
  onPlaceBet,
}) => {
  const error = validateBet(bet, score);

  return (
    <section className="game-panel">
      <h2>
        Câu {questionNumber}/{totalQuestions} · {question.topic} ·{' '}
        {LEVELS[question.level]} ({formatMultiplier(MULTIPLIERS[question.level])})
      </h2>

      <p>Điểm hiện có: {formatScore(score)}</p>

      <form
        className="bet-form"
        onSubmit={(event) => {
          event.preventDefault();
          onPlaceBet();
        }}
      >
        <label htmlFor="bet-amount">Mức cược</label>
        <input
          id="bet-amount"
          type="number"
          min={MIN_BET}
          max={MAX_BET}
          step={BET_STEP}
          value={bet}
          onChange={(event) => onBetChange(event.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={Boolean(error)}>
          Đặt cược
        </button>
      </form>
    </section>
  );
};

const AnswerButton = ({
  letter,
  option,
  index,
  correctIndex,
  selectedAnswer,
  revealed,
  onClick,
}) => {
  let className = 'answer-button';

  if (revealed && index === correctIndex) {
    className += ' answer-correct';
  } else if (revealed && index === selectedAnswer) {
    className += ' answer-wrong';
  }

  return (
    <button
      type="button"
      className={className}
      disabled={revealed}
      onClick={() => onClick(index)}
    >
      {letter}. {option}
    </button>
  );
};

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  status,
  selectedAnswer,
  onAnswer,
}) => {
  const revealed = status === 'revealed';

  return (
    <section className="game-panel">
      <h2>
        Câu {questionNumber}/{totalQuestions} · {question.topic} ·{' '}
        {LEVELS[question.level]} ({formatMultiplier(MULTIPLIERS[question.level])})
      </h2>

      <p className="question-text">{question.question}</p>

      <div className="answer-grid">
        {question.options.map((option, index) => (
          <AnswerButton
            key={`${question.id}-${LETTERS[index]}`}
            letter={LETTERS[index]}
            option={option}
            index={index}
            correctIndex={question.answer}
            selectedAnswer={selectedAnswer}
            revealed={revealed}
            onClick={onAnswer}
          />
        ))}
      </div>
    </section>
  );
};

const Timer = ({ seconds }) => (
  <p className={seconds <= 5 ? 'timer timer-urgent' : 'timer'}>
    Còn {seconds} giây
  </p>
);

const ScoreInfo = ({ score, bet }) => (
  <div className="score-info">
    <p>Điểm hiện có: {formatScore(score)}</p>
    <p>Đang cược: {formatScore(bet)}</p>
  </div>
);

const Play = ({ playerName, questions, loading, error }) => {
  const navigate = useNavigate();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [bet, setBet] = useState('100');
  const [currentBet, setCurrentBet] = useState(100);
  const [status, setStatus] = useState('betting');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentChange, setCurrentChange] = useState(null);
  const [rounds, setRounds] = useState([]);

  const finishQuestionRef = useRef(null);

  const currentQuestion = questions[questionIndex];

  const finishQuestion = (answerIndex) => {
    if (status !== 'answering' || !currentQuestion) {
      return;
    }

    const correct = answerIndex === currentQuestion.answer;
    const change = calcChange(currentBet, currentQuestion.level, correct);
    const scoreAfter = score + change;

    setSelectedAnswer(answerIndex);
    setCurrentChange(change);
    setScore(scoreAfter);
    setRounds((currentRounds) => [
      ...currentRounds,
      {
        id: currentQuestion.id,
        bet: currentBet,
        correct,
        change,
        scoreAfter,
      },
    ]);
    setStatus('revealed');
  };

  finishQuestionRef.current = finishQuestion;

  useEffect(() => {
    if (status !== 'answering') {
      return undefined;
    }

    let remaining = TIME_PER_QUESTION;

    const intervalId = window.setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);

      if (remaining <= 0) {
        window.clearInterval(intervalId);
        finishQuestionRef.current(null);
      }
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status]);

  useEffect(() => {
    if (status !== 'revealed') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      const isLastQuestion = questionIndex + 1 >= questions.length;
      const isBroke = score < MIN_BET;

      if (isLastQuestion || isBroke) {
        const reason = isBroke ? 'broke' : 'completed';
        const correctCount = rounds.filter((round) => round.correct).length;

        navigate('/result', {
          replace: true,
          state: {
            name: playerName,
            rounds,
            finalScore: score,
            correctCount,
            reason,
          },
        });

        return;
      }

      setQuestionIndex((currentIndex) => currentIndex + 1);
      setBet(String(MIN_BET));
      setCurrentBet(MIN_BET);
      setCurrentChange(null);
      setSelectedAnswer(null);
      setTimeLeft(TIME_PER_QUESTION);
      setStatus('betting');
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [status, questionIndex, questions.length, score, rounds, playerName, navigate]);

  if (!playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p className="error-message">Không tải được câu hỏi.</p>;
  }

  if (questions.length === 0) {
    return <p>Chưa có câu hỏi để chơi.</p>;
  }

  const handlePlaceBet = () => {
    const validationError = validateBet(bet, score);

    if (validationError) {
      return;
    }

    setCurrentBet(Number(bet));
    setTimeLeft(TIME_PER_QUESTION);
    setStatus('answering');
  };

  const changeLabel = currentChange === null
    ? ''
    : `${currentChange >= 0 ? '+' : '−'}${formatScore(Math.abs(currentChange))}`;

  return (
    <section>
      <h1>Xin chào, {playerName.trim()}</h1>

      {status === 'betting' && (
        <BetPanel
          question={currentQuestion}
          questionNumber={questionIndex + 1}
          totalQuestions={questions.length}
          score={score}
          bet={bet}
          onBetChange={setBet}
          onPlaceBet={handlePlaceBet}
        />
      )}

      {(status === 'answering' || status === 'revealed') && (
        <>
          <QuestionCard
            question={currentQuestion}
            questionNumber={questionIndex + 1}
            totalQuestions={questions.length}
            status={status}
            selectedAnswer={selectedAnswer}
            onAnswer={finishQuestion}
          />

          <Timer seconds={timeLeft} />
          <ScoreInfo score={score} bet={currentBet} />

          {status === 'revealed' && (
            <p className={currentChange >= 0 ? 'change-positive' : 'change-negative'}>
              {changeLabel}
            </p>
          )}
        </>
      )}
    </section>
  );
};

const ScoreChart = ({ rounds }) => {
  const highestScore = Math.max(...rounds.map((round) => round.scoreAfter), 0);

  return (
    <div className="score-chart" aria-label="Biểu đồ điểm sau mỗi câu">
      {rounds.map((round, index) => {
        const height = highestScore === 0
          ? 0
          : (round.scoreAfter / highestScore) * 200;

        return (
          <div className="chart-column" key={`${round.id}-${index}`}>
            <span className="chart-score">{formatScore(round.scoreAfter)}</span>
            <div
              className={round.correct ? 'chart-bar chart-correct' : 'chart-bar chart-wrong'}
              style={{ height: `${height}px` }}
              title={`Câu ${index + 1}: ${formatScore(round.scoreAfter)}`}
            />
            <span className="chart-question">Câu {index + 1}</span>
          </div>
        );
      })}
    </div>
  );
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state;

  if (!resultData) {
    return <Navigate to="/" replace />;
  }

  const {
    name,
    rounds,
    finalScore,
    correctCount,
    reason,
  } = resultData;

  const result = getResult(finalScore);

  return (
    <section>
      <h1>{reason === 'broke' ? 'Bạn đã cháy túi!' : 'Bạn đã hoàn thành 12 câu.'}</h1>

      <p>Người chơi: {name}</p>
      <p>
        Số câu trả lời đúng: {correctCount}/{rounds.length}
      </p>
      <p>Điểm cuối: {formatScore(finalScore)}</p>
      <p>Đánh giá: {result.title}</p>

      <ScoreChart rounds={rounds} />

      <div className="result-actions">
        <button type="button" onClick={() => navigate('/play', { replace: true })}>
          Chơi lại
        </button>
        <button type="button" onClick={() => navigate('/', { replace: true })}>
          Về trang chủ
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
  const [playerName, setPlayerName] = useState('');

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
        <Route
          index
          element={(
            <Home
              playerName={playerName}
              onPlayerNameChange={setPlayerName}
            />
          )}
        />

        <Route
          path="play"
          element={(
            <Play
              playerName={playerName}
              questions={questions}
              loading={loading}
              error={error}
            />
          )}
        />

        <Route path="result" element={<Result />} />
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