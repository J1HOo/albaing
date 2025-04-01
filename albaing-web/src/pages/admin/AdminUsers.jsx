import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("userName");
    const [isDESC, setIsDESC] = useState(false);

    const fetchUsers = () => {
        setLoading(true);
        axios.get("/api/admin/users", {
            params: { userName, userEmail, userPhone, sortOrderBy, isDESC }
        })
            .then((res) => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, [userName, userEmail, userPhone]);

    const onSearch = () => {
        fetchUsers();
    };

    const onClickDelete = (userId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        axios.delete(`/api/admin/users/${userId}`)
            .then(() => {
                setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
                alert("삭제되었습니다.");
            })
            .catch(err => console.error("삭제 실패:", err));
    };

    return (
        <div className="flex">
            {/* AdminSideBar 왼쪽 고정 */}
            <div className="w-1/4 pr-4">
                <AdminSideBar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">유저 관리</h2>

                {/* 검색 기능 영역 (첫 번째 줄) */}
                <div className="mb-12 flex justify-end space-x-4">
                    <input
                        type="text"
                        placeholder="이름"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="px-4 py-1.5 border rounded-md w-1/3"
                    />
                    <input
                        type="text"
                        placeholder="이메일"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="px-4 py-1.5 border rounded-md w-1/3"
                    />
                    <input
                        type="text"
                        placeholder="연락처"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="px-4 py-1.5 border rounded-md w-1/3"
                    />
                    <button
                        className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        onClick={onSearch}
                        style={{whiteSpace: 'nowrap'}}
                    >
                        검색
                    </button>
                </div>

                {/* 유저 목록 테이블 */}
                <table className="min-w-full table-auto">
                    <thead>
                    <tr className="border-b border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">이름</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">이메일</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">연락처</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="px-6 py-4 text-gray-700">{item.userName}</td>
                            <td className="px-6 py-4 text-gray-500">{item.userEmail}</td>
                            <td className="px-6 py-4 text-gray-500">{item.userPhone}</td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition mr-4"
                                    onClick={() => navigate(`/admin/users/edit/${item.userId}`)}
                                >
                                    수정
                                </button>
                                <button
                                    className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => onClickDelete(item.userId)}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
