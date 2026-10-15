const StudentItem = ({ student, onDelete }) => {
    const { id, name, class: studentClass, score } = student;

    let result = "Trượt môn";
    let resultClass = "regular";

    if (score >= 8) {
        result = "Giỏi";
        resultClass = "good";
    } 
    else if (score >= 5) {
        result = "Khá";
        resultClass = "average";
    }

    return (
        <tr>
            <td className="student-name">{name}</td>
            <td>{studentClass}</td>
            <td>
                <span className="score-value">{score.toFixed(1)}</span>
            </td>
            <td>
                <span className={`result-badge ${resultClass}`}>{result}</span>
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