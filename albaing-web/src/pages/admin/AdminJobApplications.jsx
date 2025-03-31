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
    }, [userName, companyName, jobPostTitle, sortOrderBy, isDESC]);

    return (
        <div className="flex">

            {/* Left Sidebar */}
            <div className="w-1/4 pr-4">
                <AdminSideBar />
            </div>

            {/* Main Content Area */}
            <div className="w-3/4 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">지원서 관리</h2>

                {/* List to display job application data */}
                <ul className="space-y-4">
                    {jobApplications.map((item, index) => (
                        <li
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border border-gray-200"
                        >
                            <div className="text-lg font-semibold text-gray-700">
                                지원 일자: {item.applicationAt}
                            </div>
                            <div className="text-gray-500">{item.jobPostTitle}</div>
                            <div className="text-gray-500">{item.userName}</div>
                            <div className="text-gray-500">이력서 보기</div>
                            <div className="flex gap-4">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                    onClick={() => navigate(`/admin/job-applications/edit/${item.applicationId}`)}
                                >
                                    수정
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                    onClick={() => onClickDelete(item.applicationId)}
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

export default AdminJobApplications;
