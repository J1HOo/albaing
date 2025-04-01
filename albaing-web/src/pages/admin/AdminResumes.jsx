import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";

const AdminResumes = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [resumeTitle, setResumeTitle] = useState("");
    const [resumeJobType, setResumeJobType] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);
    const [resumeCategory, setResumeCategory] = useState("");

    useEffect(() => {
        axios
            .get(`/api/admin/resumes`, {
                params: { userName, resumeTitle, resumeCategory, resumeJobType, sortOrderBy, isDESC },
            })
            .then((res) => {
                setResumes(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [userName, resumeTitle, resumeCategory, resumeJobType, sortOrderBy, isDESC]);

    return (
        <div className="flex">
            {/* AdminSideBar 왼쪽 고정 */}
            <div className="w-1/4 pr-4">
                <AdminSideBar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
                    이력서 관리
                </h2>

                {/* 검색 기능 영역 */}
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
                        placeholder="이력서 제목"
                        value={resumeTitle}
                        onChange={(e) => setResumeTitle(e.target.value)}
                        className="px-4 py-1.5 border rounded-md w-1/3"
                    />
                    <input
                        type="text"
                        placeholder="구직 형태"
                        value={resumeJobType}
                        onChange={(e) => setResumeJobType(e.target.value)}
                        className="px-4 py-1.5 border rounded-md w-1/3"
                    />
                    <button
                        className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        onClick={() => {}}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        검색
                    </button>
                </div>

                {/* Table to display resume data */}
                <table className="min-w-full table-auto">
                    <thead>
                    <tr className="border-b border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">이름</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">이력서 제목</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">주소</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">구직 형태</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {resumes.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="px-6 py-4 text-gray-700">{item.userName}</td>
                            <td className="px-6 py-4 text-gray-700">{item.resumeTitle}</td>
                            <td className="px-6 py-4 text-gray-500">{item.userAddress}</td>
                            <td className="px-6 py-4 text-gray-500">{item.resumeJobType}</td>

                            <td className="px-6 py-4 text-center">
                                <button
                                    className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => navigate(`/admin/resumes/edit/${item.resumeId}`)}
                                >
                                    수정
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

export default AdminResumes;
