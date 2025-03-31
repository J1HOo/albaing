import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminMain from "./AdminMain";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);

    useEffect(() => {
        axios
            .get("/api/admin/users", {
                params: { userName, userEmail, userPhone, sortOrderBy, isDESC },
            })
            .then((res) => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [userName, userEmail, userPhone, sortOrderBy, isDESC]);

    const onClickDelete = (userId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        axios
            .delete(`/api/admin/users/${userId}`)
            .then(() => {
                setUsers((prevUsers) =>
                    prevUsers.filter((user) => user.userId !== userId)
                );
            })
            .catch((err) => console.error("삭제 실패:", err));
    };

    return (
        <div className="flex">
            {/* AdminMain 왼쪽 고정 */}
            <div className="w-1/4">
                <AdminMain />
            </div>

            {/* 나머지 화면 중앙 및 오른쪽 차지 */}
            <div className="w-3/4 max-w-4xl mx-auto p-6 bg-blue-50 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
                    유저 관리
                </h2>

                <ul className="space-y-4">
                    {users.map((item, index) => (
                        <li
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border border-blue-200"
                        >
                            <div className="text-lg font-semibold text-blue-700">{item.userName}</div>
                            <div className="text-gray-500">{item.userEmail}</div>
                            <div className="flex gap-4">
                                <button
                                    className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition"
                                    onClick={() => navigate(`/admin/users/edit/${item.userId}`)}
                                >
                                    수정
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-200 text-blue-700 rounded-md hover:bg-blue-300 transition"
                                    onClick={() => onClickDelete(item.userId)}
                                >
                                    삭제
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminUsers;
