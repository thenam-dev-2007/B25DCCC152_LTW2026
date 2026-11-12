import React from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { formatScore } from "../data";
import { ScoreChart } from "../components/ScoreChart";

export const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const {
    playerName,
    rounds,
    finalScore,
    correctCount,
    totalPlayed,
    evaluation,
    reason,
  } = state;

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2>Kết quả lượt chơi</h2>
      <h3
        style={{
          color: reason === "broke" ? "#d32f2f" : "#2e7d32",
          margin: "15px 0",
        }}
      >
        {reason === "broke" ? "Bạn đã cháy túi!" : "Bạn đã hoàn thành 12 câu."}
      </h3>

      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "left",
          display: "inline-block",
          width: "100%",
          maxWidth: "500px",
          border: "1px solid #ddd",
        }}
      >
        <p style={{ margin: "8px 0" }}>
          <strong>Người chơi:</strong> {playerName}
        </p>
        <p style={{ margin: "8px 0" }}>
          <strong>Số câu trả lời đúng:</strong> {correctCount}/{totalPlayed}
        </p>
        <p style={{ margin: "8px 0" }}>
          <strong>Điểm cuối:</strong> {formatScore(finalScore)}
        </p>
        <p style={{ margin: "8px 0" }}>
          <strong>Đánh giá:</strong> {evaluation}
        </p>
      </div>

      <ScoreChart rounds={rounds} />

      <div
        style={{
          marginTop: "25px",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <button
          onClick={() => navigate("/play")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Chơi lại
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#757575",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};
