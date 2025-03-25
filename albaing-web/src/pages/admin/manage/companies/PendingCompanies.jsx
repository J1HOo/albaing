import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { LoadingSpinner, ErrorMessage } from '../../../../components';
import AdminLayout from '../../AdminLayout';
import Pagination from '../../../../components/common/Pagination';

const PendingCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingCompanies();
    }, []);

    const fetchPendingCompanies = () => {
        setLoading(true);
        axios.get('/api/admin/companies')
            .then(response => {
                const pendingCompanies = response.data.filter(company =>
                    company.companyApprovalStatus === 'approving'
                );
                setCompanies(pendingCompanies);
                setTotalItems(pendingCompanies.length);
                setLoading(false);
            })
            .catch(error => {
                setError('승인 대기 기업 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleStatusChange = (company) => {
        setSelectedCompany(company);
        setSelectedStatus(company.companyApprovalStatus || 'approving');
        setShowStatusModal(true);
    };

    const handleUpdateStatus = () => {
        setLoading(true);
        axios.patch(`/api/admin/companies/${selectedCompany.companyId}/approval-status`, { status: selectedStatus })
            .then(() => {
                fetchPendingCompanies();
                setShowStatusModal(false);
            })
            .catch(error => {
                setError('승인 상태 변경에 실패했습니다.');
                setLoading(false);
            });
    };

    const getCurrentCompanies = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return companies.slice(indexOfFirstItem, indexOfLastItem);
    };

    const statusOptions = [
        { value: 'approved', label: '승인', description: '기업 계정을 승인합니다. 모든 기능을 사용할 수 있습니다.' },
        { value: 'approving', label: '대기', description: '승인 대기 상태로 유지합니다. 로그인이 제한됩니다.' },
        { value: 'hidden', label: '숨김', description: '기업 계정을 숨깁니다. 로그인 및 모든 기능이 제한됩니다.' }
    ];

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">승인 대기 기업</h1>
                <p className="text-gray-600 mt-1">승인 대기 중인 기업을 관리합니다.</p>
            </div>

            {error && <ErrorMessage message={error} className="mb-6" />}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading && !showStatusModal ? (
                    <LoadingSpinner message="기업 정보를 불러오는 중..." fullScreen={false} className="py-12" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회사명</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대표자명</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사업자번호</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentCompanies().length > 0 ? (
                                    getCurrentCompanies().map((company) => (
                                        <tr key={company.companyId} className="hover:bg-yellow-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {company.companyId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                                            src={company.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.companyName)}&background=2563EB&color=fff`}
                                                            alt={company.companyName}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {company.companyName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {company.companyOwnerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {company.companyRegistrationNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(company.companyCreatedAt), 'yyyy-MM-dd')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/admin/companies/${company.companyId}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        상세
                                                    </Link>
                                                    <button
                                                        onClick={() => handleStatusChange(company)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        승인관리
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            승인 대기 중인 기업이 없습니다.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* 승인 상태 변경 모달 */}
            {showStatusModal && selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-800">기업 승인 상태 변경</h3>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <p className="font-medium text-gray-800">{selectedCompany.companyName}</p>
                                <p className="text-sm text-gray-600">사업자등록번호: {selectedCompany.companyRegistrationNumber}</p>
                            </div>

                            <div className="space-y-3">
                                {statusOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                            selectedStatus === option.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                        onClick={() => setSelectedStatus(option.value)}
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                    selectedStatus === option.value
                                                        ? 'border-blue-500'
                                                        : 'border-gray-400'
                                                }`}
                                            >
                                                {selectedStatus === option.value && (
                                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                )}
                                            </div>
                                            <span className="ml-2 font-medium">{option.label}</span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600 ml-7">{option.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowStatusModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUpdateStatus}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {loading ? '처리 중...' : '변경'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default PendingCompanies;