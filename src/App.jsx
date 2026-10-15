import { useState } from "react";
import StudentList from "./components/StudentList";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Nguyễn Văn A", class: "D25CQCC01-B", score: 8.5 },
  { id: 2, name: "Trần Thị B", class: "D25CQCC02-B", score: 9 },
  { id: 3, name: "Lê Minh C", class: "D25CQCC01-B", score: 4.5 },
  { id: 4, name: "Nguyễn Thị H", class: "D25CQCC01-B", score: 6.5 },
];

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [score, setScore] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const totalStudents = students.length;

  const averageScore = totalStudents === 0 ? 0
    : students.reduce((total, student) => total + student.score, 0) / totalStudents;

  const filteredStudents = students.filter((student) => {
    if (filter === "good") return student.score >= 8;
    if (filter === "average") return student.score >= 5 && student.score < 8;
    if (filter === "failed") return student.score < 5;
    return true;
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const numericScore = Number(score);
    if (!name.trim() || !studentClass.trim() || score === "") {
      setError("Vui lòng nhập đầy đủ họ tên, điểm số và lớp.");
      return;
    }

    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 10) {
      setError("Điểm số phải nằm trong khoảng từ 0 đến 10.");
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: name.trim(),
      class: studentClass.trim(),
      score: numericScore,
    };

    setStudents((currentStudents) => [...currentStudents, newStudent]);
    setName("");
    setStudentClass("");
    setScore("");
    setError("");
  };

  const handleDelete = (id) => {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== id),
    );
  };

  return (
    <main className="container">
      <header className="page-header">
        <h1>Quản lý điểm sinh viên</h1>
        <p className="subtitle">Theo dõi danh sách và kết quả học tập của lớp.</p>
      </header>

      <section className="stats" aria-label="Thống kê lớp">
        <article className="stat-card">
          <span className="stat-label">Tổng số sinh viên</span>
          <strong>{totalStudents}</strong>
        </article>

        <article className="stat-card">
          <span className="stat-label">Điểm trung bình toàn lớp</span>
          <strong>{averageScore.toFixed(2)}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Thêm sinh viên mới</h2>
          </div>
        </div>

        <form className="student-form" onSubmit={handleSubmit} noValidate>
          <label>
            Họ tên
            <input
              type="text"
              placeholder="Ví dụ: Nguyễn Văn An"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label>
            Lớp
            <input
              type="text"
              placeholder="Ví dụ: D25CQCC01-B"
              value={studentClass}
              onChange={(event) => setStudentClass(event.target.value)}
            />
          </label>

          <label>
            Điểm số
            <input
              type="number"
              placeholder="0 – 10"
              min="0"
              max="10"
              step="0.1"
              value={score}
              onChange={(event) => setScore(event.target.value)}
            />
          </label>

          <button className="primary-button" type="submit">
            Thêm sinh viên
          </button>
        </form>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </section>

      <section className="panel">
        <div className="section-heading list-heading">
          <div>
            <h2>Thông tin sinh viên</h2>
          </div>

          <label className="filter-control">
            Lọc theo
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">Tất cả sinh viên</option>
              <option value="good">Loại Giỏi</option>
              <option value="average">Loại Khá</option>
              <option value="failed">Trượt môn</option>
            </select>
          </label>
        </div>

        <StudentList students={filteredStudents} onDelete={handleDelete} />
      </section>
    </main>
  );
};

export default App;