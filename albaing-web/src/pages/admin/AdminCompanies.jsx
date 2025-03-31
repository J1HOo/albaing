import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminMain from "./AdminMain";

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [companyOwnerName, setCompanyOwnerName] = useState("");
    const [companyPhone, setCompanyPhone] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);

    useEffect(() => {
        axios.get(`/api/admin/companies`, {
            params: { companyName, companyOwnerName, companyPhone, sortOrderBy, isDESC }
        })
            .then((res) => {
                setCompanies(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [companyName, companyOwnerName, companyPhone, sortOrderBy, isDESC]);

    const onClickDelete = (companyId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        axios.delete(`/api/admin/companies/${companyId}`)
            .then(() => {
                setCompanies(prevCompanies => prevCompanies.filter(company => company.companyId !== companyId));
            })
            .catch(err => console.error("삭제 실패:", err));
    };

    return (
        <div className="flex">

            {/* Left Sidebar */}
            <div className="w-1/4">
                <AdminMain />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto p-6 bg-blue-50 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">기업 관리</h2>

                <ul className="space-y-4">
                    {companies.map((item, index) => (
                        <li
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border border-blue-200"
                        >
                            <div className="text-lg font-semibold text-blue-700">{item.companyName}</div>
                            <div className="text-gray-500">{item.companyEmail}</div>
                            <div className="flex gap-4">
                                <button
                                    className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition"
                                    onClick={() => navigate(`/admin/companies/edit/${item.companyId}`)}
                                >
                                    수정
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-200 text-blue-700 rounded-md hover:bg-blue-300 transition"
                                    onClick={() => onClickDelete(item.companyId)}
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

export default AdminCompanies;
