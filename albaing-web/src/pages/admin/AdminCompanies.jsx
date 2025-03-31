import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";

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
            params: {companyName, companyOwnerName, companyPhone, sortOrderBy, isDESC}
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
            <div className="w-1/4 pr-4"> {/* border 제거 */}
                <AdminSideBar/>
            </div>

            {/* Main Content Area */}
            <div
                className="flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300"> {/* 오른쪽 영역에만 테두리 추가 */}
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">기업 관리</h2>

                {/* Table to display company data */}
                <table className="min-w-full table-auto">
                    <thead>
                    <tr className="border-b border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">기업명</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">이메일</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">연락처</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {companies.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="px-6 py-4 text-gray-700">{item.companyName}</td>
                            <td className="px-6 py-4 text-gray-500">{item.companyEmail}</td>
                            <td className="px-6 py-4 text-gray-500">{item.companyPhone}</td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => navigate(`/admin/companies/edit/${item.companyId}`)}
                                >
                                    수정
                                </button>
                                <button
                                    className="ml-2 px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                    onClick={() => onClickDelete(item.companyId)}
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

export default AdminCompanies;
