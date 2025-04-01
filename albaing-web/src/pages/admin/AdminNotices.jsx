import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";

const AdminNotices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`/api/admin/notices`)
            .then((res) => {
                setNotices(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    const onClickDelete = (noticeId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        axios
            .delete(`/api/admin/notices/${noticeId}`)
            .then(() => {
                setNotices((prevNotices) =>
                    prevNotices.filter((notice) => notice.noticeId !== noticeId)
                );
            })
            .catch((err) => console.error("삭제 실패:", err));
    };

    // 날짜 변환 함수 (YYYY-MM-DD HH:mm 형식)
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toISOString().slice(0, 16).replace("T", " ");
    };

    return (
        <div className="flex">
            {/* AdminSideBar 왼쪽 고정 */}
            <div className="w-1/4 pr-4">
                <AdminSideBar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    공지 관리
                </h2>

                {/* Table to display notices */}
                <table className="min-w-full table-auto">
                    <thead>
                    <tr className="border-b border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">공지 제목</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">작성일</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notices.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="px-6 py-4 text-gray-700">{item.noticeTitle}</td>
                            <td className="px-6 py-4 text-gray-500">{formatDate(item.noticeCreatedAt)}</td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => navigate(`/admin/notices/edit/${item.noticeId}`)}
                                >
                                    수정
                                </button>
                                <button
                                    className="ml-2 px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => onClickDelete(item.noticeId)}
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

export default AdminNotices;
