const StudentItem = ({ student, onDelete }) => {
    const { id, name, class: studentClass, score } = student;
    const isGood = score >= 8;

    return (
        <tr>
            <td className="student-name">{name}</td>
            <td>{studentClass}</td>
            <td>
                <span className="score-value">{score.toFixed(1)}</span>
            </td>
            <td>
                <span className={`result-badge ${isGood ? "good" : "regular"}`}>
                    {isGood ? "Giỏi" : score < 5 ? "Trượt môn" : "Đạt"}
            </span>
            </td>
            <td>
                <button
                    className="delete-button"
                    type="button"
                    onClick={() => onDelete(id)}
                    aria-label={`Xóa sinh viên ${name}`}
                >
                    Xóa
                </button>
            </td>
        </tr>
    );
};

export default StudentItem;