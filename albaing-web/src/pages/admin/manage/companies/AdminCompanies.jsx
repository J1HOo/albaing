import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { LoadingSpinner, ErrorMessage, ConfirmModal, useModal } from '../../../../components';
import AdminLayout from '../../AdminLayout';
import Pagination from '../../../../components/common/Pagination';

// 승인 상태 변경 모달
const ApprovalStatusModal = ({ isOpen, onClose, company, onUpdateStatus }) => {
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        if (company) {
            setSelectedStatus(company.companyApprovalStatus || 'approving');
        }
    }, [company]);

    if (!isOpen || !company) return null;

    const statusOptions = [
        { value: 'approved', label: '승인', description: '기업 계정을 승인합니다. 모든 기능을 사용할 수 있습니다.' },
        { value: 'approving', label: '대기', description: '승인 대기 상태로 유지합니다. 로그인이 제한됩니다.' },
        { value: 'hidden', label: '숨김', description: '기업 계정을 숨깁니다. 로그인 및 모든 기능이 제한됩니다.' }
    ];

    const handleSubmit = () => {
        onUpdateStatus(company.companyId, selectedStatus);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">기업 승인 상태 변경</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <p className="font-medium text-gray-800">{company.companyName}</p>
                        <p className="text-sm text-gray-600">사업자등록번호: {company.companyRegistrationNumber}</p>
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
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            변경
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [filters, setFilters] = useState({
        companyName: '',
        companyOwnerName: '',
        companyPhone: '',
        companyRegistrationNumber: '',
        showPending: false
    });
    const [sortField, setSortField] = useState('companyName');
    const [sortDirection, setSortDirection] = useState('asc');

    const deleteModal = useModal();
    const approveModal = useModal();

    const fetchCompanies = () => {
        setLoading(true);
        setError(null);

        let params = {
            companyName: filters.companyName,
            companyOwnerName: filters.companyOwnerName,
            companyPhone: filters.companyPhone,
            companyRegistrationNumber: filters.companyRegistrationNumber,
            sortOrderBy: mapSortFieldToBackend(sortField),
            isDESC: sortDirection === 'desc'
        };

        axios.get('/api/admin/companies', { params })
            .then(response => {
                let data = response.data;

                // 승인 대기 필터링이 활성화된 경우
                if (filters.showPending) {
                    data = data.filter(company => company.companyApprovalStatus === 'approving');
                }

                setCompanies(data);
                setTotalItems(data.length);
                setLoading(false);
            })
            .catch(error => {
                setError('기업 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const mapSortFieldToBackend = (field) => {
        switch(field) {
            case 'companyName': return '법인명';
            case 'companyOwnerName': return '대표자명';
            case 'companyRegistrationNumber': return '사업자등록번호';
            case 'companyId': return 'companyId';
            case 'createdAt': return '가입일';
            default: return '법인명';
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [sortField, sortDirection, filters.showPending]);

    const handleDeleteCompany = () => {
        if (!selectedCompany) return;
        setLoading(true);

        axios.delete(`/api/admin/companies/${selectedCompany.companyId}`)
            .then(() => {
                fetchCompanies();
                deleteModal.closeModal();
                setSelectedCompany(null);
            })
            .catch(error => {
                setError('기업 삭제에 실패했습니다.');
                setLoading(false);
            });
    };

    const handleUpdateApprovalStatus = (companyId, status) => {
        setLoading(true);

        axios.patch(`/api/admin/companies/${companyId}/approval-status`, { status })
            .then(() => {
                fetchCompanies();
                approveModal.closeModal();
                setSelectedCompany(null);
            })
            .catch(error => {
                console.error('승인 상태 변경 실패:', error);
                setError('승인 상태 변경에 실패했습니다.');
                setLoading(false);
            });
    };

    const togglePendingFilter = () => {
        setFilters(prev => ({
            ...prev,
            showPending: !prev.showPending
        }));
    };

    const handleOpenApprovalModal = (company) => {
        setSelectedCompany(company);
        approveModal.openModal();
    };

    const handleOpenDeleteModal = (company) => {
        setSelectedCompany(company);
        deleteModal.openModal();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCompanies();
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getCurrentCompanies = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return companies.slice(indexOfFirstItem, indexOfLastItem);
    };

    const renderSortIcon = (field) => {
        if (sortField !== field) {
            return (
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }

        return sortDirection === 'asc' ? (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'approving': return 'bg-yellow-100 text-yellow-800';
            case 'hidden': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'approved': return '승인됨';
            case 'approving': return '대기중';
            case 'hidden': return '숨김';
            default: return status;
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">기업 관리</h1>
                    <p className="text-gray-600 mt-1">기업 회원 정보를 관리할 수 있습니다.</p>
                </div>
                <div className="mt-4 lg:mt-0">
                    <button
                        onClick={togglePendingFilter}
                        className={`px-4 py-2 ${filters.showPending ? 'bg-blue-600' : 'bg-yellow-500'} text-white rounded-md hover:${filters.showPending ? 'bg-blue-700' : 'bg-yellow-600'} flex items-center`}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {filters.showPending ? '전체 기업 보기' : '승인 대기 기업만 보기'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={filters.companyName}
                            onChange={handleFilterChange}
                            placeholder="회사명 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="companyOwnerName" className="block text-sm font-medium text-gray-700 mb-1">대표자명</label>
                        <input
                            type="text"
                            id="companyOwnerName"
                            name="companyOwnerName"
                            value={filters.companyOwnerName}
                            onChange={handleFilterChange}
                            placeholder="대표자명 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
                        <input
                            type="text"
                            id="companyRegistrationNumber"
                            name="companyRegistrationNumber"
                            value={filters.companyRegistrationNumber}
                            onChange={handleFilterChange}
                            placeholder="사업자등록번호 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                        <input
                            type="text"
                            id="companyPhone"
                            name="companyPhone"
                            value={filters.companyPhone}
                            onChange={handleFilterChange}
                            placeholder="전화번호 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
                        >
                            검색
                        </button>
                    </div>
                </form>
            </div>

            {error && <ErrorMessage message={error} className="mb-6" />}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <LoadingSpinner message="기업 정보를 불러오는 중..." fullScreen={false} className="py-12" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('companyId')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            번호 {sortField === 'companyId' && renderSortIcon('companyId')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('companyName')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            회사명 {renderSortIcon('companyName')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('companyOwnerName')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            대표자명 {renderSortIcon('companyOwnerName')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('companyRegistrationNumber')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            사업자번호 {renderSortIcon('companyRegistrationNumber')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        상태
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('createdAt')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            가입일 {renderSortIcon('createdAt')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        관리
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentCompanies().length > 0 ? (
                                    getCurrentCompanies().map((company) => (
                                        <tr key={company.companyId} className="hover:bg-gray-50">
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(company.companyApprovalStatus)}`}>
                                                    {getStatusText(company.companyApprovalStatus)}
                                                </span>
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
                                                        onClick={() => handleOpenApprovalModal(company)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        상태변경
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(company)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            {filters.showPending ? '승인 대기 중인 기업이 없습니다.' : '검색 결과가 없습니다.'}
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

            <ApprovalStatusModal
                isOpen={approveModal.isOpen}
                onClose={approveModal.closeModal}
                company={selectedCompany}
                onUpdateStatus={handleUpdateApprovalStatus}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDeleteCompany}
                title="기업 삭제"
                message={`'${selectedCompany?.companyName}' 기업을 삭제하시겠습니까? 삭제된 기업 정보와 관련 데이터는 복구할 수 없습니다.`}
                confirmText="삭제"
                cancelText="취소"
                type="danger"
            />
        </AdminLayout>
    );
};

export default AdminCompanies;