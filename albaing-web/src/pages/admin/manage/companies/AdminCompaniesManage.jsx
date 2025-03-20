import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, useModal } from '../../../../components';

const AdminCompaniesManage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    companyName: '',
    companyOwnerName: '',
    companyPhone: '',
    companyRegistrationNumber: '',
    companyApprovalStatus: '',
    sortOrderBy: '법인명',
    isDESC: false
  });

  const confirmModal = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, [searchParams.sortOrderBy, searchParams.isDESC]);

  const fetchCompanies = () => {
    setLoading(true);

    const params = {
      ...searchParams,
      companyName: searchParams.companyName || undefined,
      companyOwnerName: searchParams.companyOwnerName || undefined,
      companyPhone: searchParams.companyPhone || undefined,
      companyRegistrationNumber: searchParams.companyRegistrationNumber || undefined
    };

    axios.get('/api/admin/companies', { params })
        .then(response => {
          setCompanies(response.data);
        })
        .catch(error => {
          console.error('기업 목록 로딩 실패:', error);
          confirmModal.openModal({
            title: '오류',
            message: '기업 목록을 불러오는데 실패했습니다.',
            type: 'error'
          });
        })
        .finally(() => {
          setLoading(false);
        });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSortChange = (field) => {
    setSearchParams(prev => ({
      ...prev,
      sortOrderBy: field,
      isDESC: prev.sortOrderBy === field ? !prev.isDESC : false
    }));
  };


  const confirmDelete = (company) => {
    confirmModal.openModal({
      title: '기업 삭제',
      message: `${company.companyName} 기업을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 해당 기업의 모든 공고가 삭제됩니다.`,
      confirmText: '삭제',
      cancelText: '취소',
      type: 'warning',
      onConfirm: () => handleDelete(company.companyId)
    });
  };

  const handleDelete = (companyId) => {
    axios.delete(`/api/admin/companies/${companyId}`)
        .then(() => {
          setCompanies(companies.filter(company => company.companyId !== companyId));
          confirmModal.openModal({
            title: '성공',
            message: '기업이 삭제되었습니다.',
            type: 'success'
          });
        })
        .catch(error => {
          console.error('기업 삭제 실패:', error);
          confirmModal.openModal({
            title: '오류',
            message: '기업 삭제에 실패했습니다.',
            type: 'error'
          });
        });
  };

  const handleApprove = (companyId) => {
    axios.patch(`/api/admin/companies/${companyId}/status`, { companyApprovalStatus: 'approved' })
        .then(() => {
          setCompanies(prev =>
              prev.map(company =>
                  company.companyId === companyId
                      ? { ...company, companyApprovalStatus: 'approved' }
                      : company
              )
          );

          confirmModal.openModal({
            title: '성공',
            message: '기업이 승인되었습니다.',
            type: 'success'
          });
        })
        .catch(error => {
          console.error('기업 승인 실패:', error);
          confirmModal.openModal({
            title: '오류',
            message: '기업 승인에 실패했습니다.',
            type: 'error'
          });
        });
  };

  const confirmApprove = (company) => {
    confirmModal.openModal({
      title: '기업 승인',
      message: `${company.companyName} 기업을 승인하시겠습니까?`,
      confirmText: '승인',
      cancelText: '취소',
      type: 'info',
      onConfirm: () => handleApprove(company.companyId)
    });
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

  if (loading) return <LoadingSpinner message="기업 목록을 불러오는 중..." />;

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
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

        <div className="mb-6 bg-white p-4 shadow rounded-lg">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">법인명</label>
              <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={searchParams.companyName}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  type="submit"
                  className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                검색
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('법인명')}>
                <div className="flex items-center">
                  법인명
                  {searchParams.sortOrderBy === '법인명' && (
                      <span className="ml-1">{searchParams.isDESC ? '▼' : '▲'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('대표자명')}>
                <div className="flex items-center">
                  대표자명
                  {searchParams.sortOrderBy === '대표자명' && (
                      <span className="ml-1">{searchParams.isDESC ? '▼' : '▲'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사업자등록번호</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전화번호</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {companies.length > 0 ? (
                companies.map((company) => (
                    <tr key={company.companyId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {company.companyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.companyOwnerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.companyRegistrationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.companyPhone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getStatusBadge(company.companyApprovalStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(company.companyCreatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default AdminCompaniesManage;