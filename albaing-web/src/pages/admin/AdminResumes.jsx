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
            <div className="w-1/4 pr-4">
                <AdminSideBar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    이력서 관리
                </h2>

                {/* Table to display resume data */}
                <table className="min-w-full table-auto">
                    <thead>
                    <tr className="border-b border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">이름</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">성별</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">주소</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {resumes.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="px-6 py-4 text-gray-700">{item.resumeTitle}</td>
                            <td className="px-6 py-4 text-gray-500">{item.userGender}</td>
                            <td className="px-6 py-4 text-gray-500">{item.userAddress}</td>
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
