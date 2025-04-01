import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";

const AdminJobApplications = () => {
    const [jobApplications, setJobApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [jobPostTitle, setJobPostTitle] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);

    useEffect(() => {
        axios.get(`/api/admin/job-applications`, {
            params: { userName, companyName, jobPostTitle, sortOrderBy, isDESC }
        })
            .then((res) => {
                setJobApplications(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [userName, companyName, jobPostTitle]);

    const onSearch = () => {
        // Search 버튼 클릭 시 데이터 다시 로딩
        axios.get(`/api/admin/job-applications`, {
            params: { userName, companyName, jobPostTitle, sortOrderBy, isDESC }
        })
            .then((res) => {
                setJobApplications(res.data);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const onClickDelete = (applicationId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        axios.delete(`/api/admin/job-applications/${applicationId}`)
            .then(() => {
                setJobApplications(prev => prev.filter(app => app.applicationId !== applicationId));
            })
            .catch(err => console.error("삭제 실패:", err));
    };

    return (
        <div className="flex">

            {/* Left Sidebar */}
            <div className="w-1/4 pr-4">
                <AdminSideBar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">지원서 관리</h2>

                {/* 검색 기능 영역 (첫 번째 줄) */}
                <div className="mb-12 flex justify-end space-x-4">
                    <input
                        type="text"
                        placeholder="공고 제목"
                        value={jobPostTitle}
                        onChange={(e) => setJobPostTitle(e.target.value)}
                        className="px-4 py-1.5 border rounded-md w-1/3"
                    />
                    <input
                        type="text"
                        placeholder="법인명"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="px-4 py-1.5 border rounded-md w-1/3"
                    />
                    <input
                        type="text"
                        placeholder="지원자"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="px-4 py-1.5 border rounded-md w-1/3"
                    />
                    <button
                        className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        onClick={onSearch}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        검색
                    </button>
                </div>

                {/* 기업 목록 테이블 */}
                <table className="min-w-full table-auto">
                    <thead>
                    <tr className="border-b border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">지원 일자</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">공고 제목</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">법인명</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">지원자</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {jobApplications.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="px-6 py-4 text-gray-700">
                                {item.applicationAt ? item.applicationAt.split("T")[0] : ""}
                            </td>
                            <td className="px-6 py-4 text-gray-500">{item.jobPostTitle}</td>
                            <td className="px-6 py-4 text-gray-500">{item.companyName}</td>
                            <td className="px-6 py-4 text-gray-500">{item.userName}</td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => navigate(`/admin/job-applications/edit/${item.applicationId}`)}
                                >
                                    수정
                                </button>
                                <button
                                    className="ml-2 px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => onClickDelete(item.applicationId)}
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

export default AdminJobApplications;
