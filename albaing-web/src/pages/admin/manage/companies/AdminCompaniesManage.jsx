import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../../../../components';
import { useErrorHandler } from "../../../../components/ErrorHandler";
import { useModal } from "../../../../components";
import AdminDataTable from "../../AdminDataTable";
import adminApiService from '../../../../service/apiAdminService';

const AdminCompaniesManage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [searchParams, setSearchParams] = useState({
    companyName: '',
    companyOwnerName: '',
    companyPhone: '',
    companyRegistrationNumber: '',
    companyApprovalStatus: '',
    sortOrderBy: '법인명',
    isDESC: false,
    currentPage: 1,
    rowsPerPage: 10
  });

  const confirmModal = useModal();
  const navigate = useNavigate();
  const { handleError, handleSuccess, confirmAction } = useErrorHandler();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    setLoading(true);

    const params = {
      companyName: searchParams.companyName || undefined,
      companyOwnerName: searchParams.companyOwnerName || undefined,
      companyPhone: searchParams.companyPhone || undefined,
      companyRegistrationNumber: searchParams.companyRegistrationNumber || undefined,
      companyApprovalStatus: searchParams.companyApprovalStatus || undefined,
      sortOrderBy: searchParams.sortOrderBy,
      isDESC: searchParams.isDESC,
      page: searchParams.currentPage,
      limit: searchParams.rowsPerPage
    };

    adminApiService.getCompanies(params)
        .then(response => {
          setCompanies(response.companies || response);
          setTotalItems(response.total || response.length);
          setLoading(false);
        })
        .catch(error => {
          handleError(error, '기업 목록을 불러오는데 실패했습니다.');
          setLoading(false);
        });
  };

  const handleSearch = (searchTerm, page, rowsPerPage) => {
    setSearchParams(prev => ({
      ...prev,
      companyName: searchTerm,
      currentPage: page || 1,
      rowsPerPage: rowsPerPage || prev.rowsPerPage
    }));

    fetchCompanies();
  };

  const handleSort = (key, direction) => {
    // 컬럼 키를 API 정렬 필드명으로 변환
    const sortFieldMap = {
      'companyName': '법인명',
      'companyOwnerName': '대표자명',
      'companyRegistrationNumber': '사업자등록번호',
      'companyCreatedAt': '가입일'
    };

    setSearchParams(prev => ({
      ...prev,
      sortOrderBy: sortFieldMap[key] || key,
      isDESC: direction === 'desc'
    }));

    fetchCompanies();
  };

  const handleFilter = (filters) => {
    setSearchParams(prev => ({
      ...prev,
      ...filters,
      currentPage: 1
    }));

    fetchCompanies();
  };

  const handlePageChange = (page, rowsPerPage) => {
    setSearchParams(prev => ({
      ...prev,
      currentPage: page,
      rowsPerPage: rowsPerPage || prev.rowsPerPage
    }));

    fetchCompanies();
  };

  const handleDelete = (companyId) => {
    adminApiService.deleteCompany(companyId)
        .then(() => {
          setCompanies(companies.filter(company => company.companyId !== companyId));
          handleSuccess('기업이 삭제되었습니다.');
        })
        .catch(error => {
          handleError(error, '기업 삭제에 실패했습니다.');
        });
  };

  const handleApprove = (companyId) => {
    adminApiService.updateCompanyStatus(companyId, 'approved')
        .then(() => {
          // 전체 목록 리로드
          fetchCompanies();
          handleSuccess('기업이 승인되었습니다.');
        })
        .catch(error => {
          handleError(error, '기업 승인에 실패했습니다.');
        });
  };

  const confirmApprove = (company) => {
    confirmAction(
        `${company.companyName} 기업을 승인하시겠습니까?`,
        () => handleApprove(company.companyId),
        {
          title: '기업 승인',
          confirmText: '승인',
          cancelText: '취소',
          type: 'info'
        }
    );
  };

  const confirmDelete = (company) => {
    confirmAction(
        `${company.companyName} 기업을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 해당 기업의 모든 공고가 삭제됩니다.`,
        () => handleDelete(company.companyId),
        {
          title: '기업 삭제',
          confirmText: '삭제',
          cancelText: '취소',
          type: 'warning',
          isDestructive: true
        }
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'approved': { text: '승인됨', className: 'bg-green-100 text-green-800' },
      'approving': { text: '승인대기', className: 'bg-yellow-100 text-yellow-800' },
      'hidden': { text: '비공개', className: 'bg-red-100 text-red-800' }
    };

    const statusInfo = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  // 승인 대기 중인 회사 수 계산
  const pendingCompaniesCount = companies.filter(company =>
      company.companyApprovalStatus === 'approving'
  ).length;

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'companyName',
      label: '법인명',
      sortable: true,
      filterable: true
    },
    {
      key: 'companyOwnerName',
      label: '대표자명',
      sortable: true,
      filterable: true
    },
    {
      key: 'companyRegistrationNumber',
      label: '사업자등록번호',
      filterable: true
    },
    {
      key: 'companyPhone',
      label: '전화번호',
      filterable: true
    },
    {
      key: 'companyApprovalStatus',
      label: '상태',
      filterable: true,
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'companyCreatedAt',
      label: '가입일',
      sortable: true,
      render: (value) => formatDate(value)
    }
  ];

  // 테이블 행 액션 정의
  const renderRowActions = (company) => (
      <div className="flex space-x-2">
        <button
            onClick={() => navigate(`/admin/companies/${company.companyId}`)}
            className="text-indigo-600 hover:text-indigo-900"
        >
          상세
        </button>

        {company.companyApprovalStatus === 'approving' && (
            <button
                onClick={() => confirmApprove(company)}
                className="text-green-600 hover:text-green-900"
            >
              승인
            </button>
        )}

        <button
            onClick={() => confirmDelete(company)}
            className="text-red-600 hover:text-red-900"
        >
          삭제
        </button>
      </div>
  );

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">기업 관리</h2>
          <div className="flex items-center space-x-3">
            {pendingCompaniesCount > 0 && (
                <div className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm font-medium">
                  승인 대기 기업: {pendingCompaniesCount}개
                </div>
            )}
            <button
                onClick={() => navigate('/admin/companies/approval')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              기업 승인 관리
            </button>
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">법인명</label>
              <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={searchParams.companyName}
                  onChange={(e) => setSearchParams({...searchParams, companyName: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="법인명 검색"
              />
            </div>

            <div>
              <label htmlFor="companyOwnerName" className="block text-sm font-medium text-gray-700 mb-1">대표자명</label>
              <input
                  type="text"
                  id="companyOwnerName"
                  name="companyOwnerName"
                  value={searchParams.companyOwnerName}
                  onChange={(e) => setSearchParams({...searchParams, companyOwnerName: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="대표자명 검색"
              />
            </div>

            <div>
              <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input
                  type="text"
                  id="companyPhone"
                  name="companyPhone"
                  value={searchParams.companyPhone}
                  onChange={(e) => setSearchParams({...searchParams, companyPhone: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="전화번호 검색"
              />
            </div>

            <div>
              <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
              <input
                  type="text"
                  id="companyRegistrationNumber"
                  name="companyRegistrationNumber"
                  value={searchParams.companyRegistrationNumber}
                  onChange={(e) => setSearchParams({...searchParams, companyRegistrationNumber: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="사업자등록번호 검색 (예: 123-45-67890)"
              />
            </div>

            <div>
              <label htmlFor="companyApprovalStatus" className="block text-sm font-medium text-gray-700 mb-1">상태</label>
              <select
                  id="companyApprovalStatus"
                  name="companyApprovalStatus"
                  value={searchParams.companyApprovalStatus}
                  onChange={(e) => setSearchParams({...searchParams, companyApprovalStatus: e.target.value})}
                  className="w-full p-2 border rounded"
              >
                <option value="">전체</option>
                <option value="approved">승인됨</option>
                <option value="approving">승인대기</option>
                <option value="hidden">비공개</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                  onClick={fetchCompanies}
                  className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                검색
              </button>
            </div>
          </div>
        </div>

        <AdminDataTable
            title="기업 목록"
            data={companies}
            columns={columns}
            isLoading={loading}
            totalItems={totalItems}
            onSearch={handleSearch}
            onSort={handleSort}
            onFilter={handleFilter}
            onPageChange={handlePageChange}
            onView={(company) => navigate(`/admin/companies/${company.companyId}`)}
            onEdit={(company) => navigate(`/admin/companies/${company.companyId}`)}
            onDelete={handleDelete}
            renderRowActions={renderRowActions}
            selectable={true}
            searchable={true}
            exportable={true}
            pagination={true}
        />

        {confirmModal.isOpen && (
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.closeModal}
                onConfirm={confirmModal.modalProps.onConfirm}
                title={confirmModal.modalProps.title}
                message={confirmModal.modalProps.message}
                confirmText={confirmModal.modalProps.confirmText}
                cancelText={confirmModal.modalProps.cancelText}
                type={confirmModal.modalProps.type}
            />
        )}
      </div>
  );
};

export default AdminCompaniesManage;