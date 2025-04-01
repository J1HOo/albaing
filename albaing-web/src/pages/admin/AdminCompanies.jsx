import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [companyRegistrationNumber, setCompanyRegistrationNum] = useState("");
    const [companyPhone, setCompanyPhone] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("companyName"); // 기본 정렬 기준은 기업명
    const [isDESC, setIsDESC] = useState(false);

    const fetchCompanies = () => {
        setLoading(true);
        axios.get(`/api/admin/companies`, {
            params: { companyName, companyRegistrationNumber, companyPhone, sortOrderBy, isDESC }
        })
            .then((res) => {
                setCompanies(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCompanies();
    }, [companyName, companyRegistrationNumber, companyPhone]);

    const onSearch = () => {
        fetchCompanies();
    };

    const onClickDelete = (companyId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        axios.delete(`/api/admin/companies/${companyId}`)
            .then(() => {
                setCompanies(prevCompanies => prevCompanies.filter(company => company.companyId !== companyId));
                alert("삭제되었습니다.");
            })
            .catch(err => console.error("삭제 실패:", err));
    };

    return (
        <div className="flex">

            <div className="w-1/4 pr-4">
                <AdminSideBar />
            </div>

            <div className="flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">기업 관리</h2>

                {/* 검색 기능 영역 (첫 번째 줄) */}
                <div className="mb-12 flex justify-end space-x-4">
                    <input
                        type="text"
                        placeholder="기업명"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="px-4 py-1.5 border rounded-md w-1/3"
                    />
                    <input
                        type="text"
                        placeholder="사업자등록번호"
                        value={companyRegistrationNumber}
                        onChange={(e) => setCompanyRegistrationNum(e.target.value)}
                        className="px-4 py-1.5 border rounded-md w-1/3"
                    />
                    <input
                        type="text"
                        placeholder="연락처"
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                        className="px-4 py-1.5 border rounded-md w-1/3"
                    />
                    <button
                        className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        onClick={onSearch}
                        style={{whiteSpace: 'nowrap'}}
                    >
                        검색
                    </button>
                </div>

                {/* 기업 목록 테이블 */}
                <table className="min-w-full table-auto">
                    <thead>
                    <tr className="border-b border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">기업명</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">사업자등록번호</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">연락처</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {companies.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="px-6 py-4 text-gray-700">{item.companyName}</td>
                            <td className="px-6 py-4 text-gray-500">{item.companyRegistrationNumber}</td>
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
