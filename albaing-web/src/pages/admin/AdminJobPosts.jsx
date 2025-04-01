import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";

const AdminJobPosts = () => {
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [jobPostTitle, setJobPostTitle] = useState("");
    const [jobPostStatus, setJobPostStatus] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);

    useEffect(() => {
        axios.get(`/api/admin/job-posts`, {
            params: { companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC }
        })
            .then((res) => {
                setJobPosts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC]);

    const onClickDelete = (jobPostId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        axios.delete(`/api/admin/job-posts/${jobPostId}`)
            .then(() => {
                setJobPosts(prev => prev.filter(post => post.jobPostId !== jobPostId));
            })
            .catch(err => console.error("삭제 실패:", err));
    };

    // 날짜 변환 함수 (YYYY-MM-DD 형식)
    const formatDate = (isoString) => {
        return new Date(isoString).toISOString().split("T")[0];
    };

    return (
        <div className="flex">
            {/* Left Sidebar */}
            <div className="w-1/4 pr-4">
                <AdminSideBar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">채용 공고 관리</h2>

                {/* Table to display job post data */}
                <table className="min-w-full table-auto">
                    <thead>
                    <tr className="border-b border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">법인명</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">공고 제목</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">공고일</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {jobPosts.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="px-6 py-4 text-gray-700">{item.companyName}</td>
                            <td className="px-6 py-4 text-gray-500">{item.jobPostTitle}</td>
                            <td className="px-6 py-4 text-gray-500">{formatDate(item.jobPostCreatedAt)}</td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => onClickDelete(item.jobPostId)}
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
}

export default AdminJobPosts;
