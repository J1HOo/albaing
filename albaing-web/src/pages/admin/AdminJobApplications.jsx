import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminMain from "./AdminMain";

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
            <div className="w-1/4">
                <AdminMain />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto p-6 bg-blue-50 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">지원서 관리</h2>

                <ul className="space-y-4">
                    {jobApplications.map((item, index) => (
                        <li
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border border-blue-200"
                        >
                            <div className="text-lg font-semibold text-blue-700">
                                지원 ID: {item.jobApplicationId}
                            </div>
                            <div className="text-gray-500">공고 ID: {item.jobPostId}</div>
                            <div className="text-gray-500">이력서 ID: {item.resumeId}</div>
                            <div className="flex gap-4">
                                <button
                                    className="px-4 py-2 bg-blue-200 text-blue-700 rounded-md hover:bg-blue-300 transition">
                                    취소
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminJobApplications;
