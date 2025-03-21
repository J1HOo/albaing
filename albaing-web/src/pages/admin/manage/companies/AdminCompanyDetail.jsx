import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {LoadingSpinner, useModal} from '../../../../components';
import {ErrorHandler} from "../../../../components/ErrorHandler";

const AdminCompanyDetail = () => {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const navigate = useNavigate();
    const { handleError, handleSuccess } = ErrorHandler();

    useEffect(() => {
        fetchCompanyDetail();
    }, [companyId]);

    const fetchCompanyDetail = () => {
        setLoading(true);

        axios.get(`/api/admin/companies/${companyId}`)
            .then(response => {
                setCompany(response.data);
                setEditForm({...response.data});
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '기업 정보를 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleStatusChange = (status) => {
        axios.patch(`/api/admin/companies/${companyId}/status`, {
            companyApprovalStatus: status
        })
            .then(() => {
                setCompany(prev => ({...prev, companyApprovalStatus: status}));
                handleSuccess(`기업 상태가 변경되었습니다.`);
            })
            .catch(error => {
                handleError(error, '기업 상태 변경에 실패했습니다.');
                setLoading(false);
            });
    };

    const handleDelete = () => {
        if (!window.confirm(`${company.companyName} 기업을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
            return;
        }

        setLoading(true);

        // 기업 삭제 (관련 데이터는 서버에서 처리)
        axios.delete(`/api/admin/companies/${companyId}`)
            .then(() => {
                handleSuccess('기업이 성공적으로 삭제되었습니다.');
                navigate('/admin/companies');
            })
            .catch(error => {
                handleError(error, '기업 삭제에 실패했습니다.');
                setLoading(false);
            });
    };

    const handleUpdateCompany = () => {
        setLoading(true);

        axios.put(`/api/admin/companies/${companyId}`, editForm)
            .then(() => {
                handleSuccess('기업 정보가 성공적으로 수정되었습니다.');
                setCompany(editForm);
                setIsEditing(false);
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '기업 정보 수정에 실패했습니다.');
                setLoading(false);
            });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
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

    if (loading) return <LoadingSpinner message="기업 정보를 불러오는 중..." />;
    if (!company) return <div>기업 정보를 찾을 수 없습니다.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">기업 상세 정보</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate('/admin/companies')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        목록으로
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* 기업 헤더 */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            {company.companyLogo && (
                                <img
                                    src={company.companyLogo}
                                    alt={`${company.companyName} 로고`}
                                    className="w-16 h-16 mr-4 object-contain"
                                />
                            )}
                            <div>
                                <h3 className="text-xl font-bold">{company.companyName}</h3>
                                <div className="mt-1 text-sm text-gray-600">
                                    {getStatusBadge(company.companyApprovalStatus)}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            {company.companyApprovalStatus === 'approving' && (
                                <button
                                    onClick={() => handleStatusChange('approved')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    승인하기
                                </button>
                            )}

                            {company.companyApprovalStatus === 'approved' && (
                                <button
                                    onClick={() => handleStatusChange('hidden')}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                                >
                                    비공개로 변경
                                </button>
                            )}

                            {company.companyApprovalStatus === 'hidden' && (
                                <button
                                    onClick={() => handleStatusChange('approved')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    공개로 변경
                                </button>
                            )}

                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>

                {/* 기업 상세 정보 */}
                <div className="p-6">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">사업자등록번호</dt>
                            <dd className="mt-1 text-sm text-gray-900">{company.companyRegistrationNumber}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">대표자명</dt>
                            <dd className="mt-1 text-sm text-gray-900">{company.companyOwnerName}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">개업일</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(company.companyOpenDate)}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">이메일</dt>
                            <dd className="mt-1 text-sm text-gray-900">{company.companyEmail}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">전화번호</dt>
                            <dd className="mt-1 text-sm text-gray-900">{company.companyPhone}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">주소</dt>
                            <dd className="mt-1 text-sm text-gray-900">{company.companyLocalAddress}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">가입일</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(company.companyCreatedAt)}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">최근 수정일</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(company.companyUpdatedAt)}</dd>
                        </div>
                    </dl>

                    {company.companyDescription && (
                        <div className="mt-6">
                            <dt className="text-sm font-medium text-gray-500">회사 소개</dt>
                            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{company.companyDescription}</dd>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCompanyDetail;