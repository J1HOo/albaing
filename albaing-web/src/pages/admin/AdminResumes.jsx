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
    const [resumeCategory, setResumeCategory] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);

    useEffect(() => {
        axios
            .get(`/api/admin/resumes`, {
                params: { userName, resumeTitle, resumeCategory, sortOrderBy, isDESC },
            })
            .then((res) => {
                setResumes(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [userName, resumeTitle, resumeCategory, sortOrderBy, isDESC]);

    return (
        <div className="flex">
            {/* AdminSideBar 왼쪽 고정 */}
            <div className="w-1/4 pr-4"> {/* border 제거 */}
                <AdminSideBar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    이력서 관리
                </h2>

                <ul className="space-y-4">
                    {resumes.map((item, index) => (
                        <li
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border border-gray-200"
                        >
                            <div className="text-lg font-semibold text-gray-700">
                                {item.resumeTitle}
                            </div>
                            <div className="text-gray-500">{item.userId}</div>
                            <div className="flex gap-4">
                                <button
                                    className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => navigate(`/admin/resumes/edit/${item.resumeId}`)}
                                >
                                    수정
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminResumes;
