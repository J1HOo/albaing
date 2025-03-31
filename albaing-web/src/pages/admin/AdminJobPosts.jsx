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

    return (
        <div className="flex">
            {/* Left Sidebar */}
            <div className="w-1/4 pr-4"> {/* border 제거 */}
                <AdminSideBar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">채용 공고 관리</h2>

                {/* List to display job post data */}
                <ul className="space-y-4">
                    {jobPosts.map((item, index) => (
                        <li
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border border-gray-200"
                        >
                            <div className="text-lg font-semibold text-gray-700">
                                공고 ID: {item.jobPostId}
                            </div>
                            <div className="text-gray-500">회사 ID: {item.companyId}</div>
                            <div className="text-gray-500">공고 제목: {item.jobPostTitle}</div>
                            <div className="flex gap-4">
                                <button
                                    className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => onClickDelete(item.jobPostId)}
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
}

export default AdminJobPosts;
