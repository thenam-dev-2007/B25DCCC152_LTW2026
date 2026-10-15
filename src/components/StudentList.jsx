import StudentItem from "./StudentItem";

const StudentList = ({ students, onDelete }) => {
    if (students.length === 0) {
        return <p className="empty-state">Không có sinh viên phù hợp.</p>;
}

return (
    <div className="table-wrapper">
        <table className="student-table">
            <thead>
                <tr>
                    <th>Họ tên</th>
                    <th>Lớp</th>
                    <th>Điểm</th>
                    <th>Kết quả</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    <StudentItem
                    key={student.id}
                    student={student}
                    onDelete={onDelete}
                    />
                ))}
            </tbody>
        </table>
    </div>
);
};

export default StudentList;