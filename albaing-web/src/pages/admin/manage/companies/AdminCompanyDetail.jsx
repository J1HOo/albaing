import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { LoadingSpinner, ErrorMessage, ConfirmModal, useModal } from '../../../../components';
import AdminLayout from '../../AdminLayout';

const AdminCompanyDetail = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const deleteModal = useModal();

    useEffect(() => {
        fetchCompanyDetail();
    }, [companyId]);

    const fetchCompanyDetail = () => {
        setLoading(true);
        axios.get(`/api/admin/companies/${companyId}`)
            .then(response => {
                setCompany(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('기업 정보를 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleDeleteCompany = () => {
        setLoading(true);

        axios.delete(`/api/admin/companies/${companyId}`)
            .then(() => {
                navigate('/admin/companies');
            })
            .catch(error => {
                setError('기업 삭제에 실패했습니다.');
                setLoading(false);
            });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'yyyy-MM-dd');
    };

    const getApprovalStatusText = (status) => {
        switch(status) {
            case 'approved': return '승인됨';
            case 'approving': return '대기중';
            case 'hidden': return '숨김';
            default: return status;
        }
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'approved': return 'text-green-600';
            case 'approving': return 'text-yellow-600';
            case 'hidden': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <AdminLayout>
            {loading ? (
                <LoadingSpinner message="기업 정보를 불러오는 중..." />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : company ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h1 className="text-2xl font-bold text-gray-800">기업 상세 정보</h1>
                            <div className="flex space-x-2">
                                <Link
                                    to={`/admin/companies/${companyId}/edit`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    수정
                                </Link>
                                <button
                                    onClick={() => deleteModal.openModal()}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start">
                            <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
                                <div className="relative">
                                    <img
                                        src={company.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.companyName)}&background=2563EB&color=fff&size=150`}
                                        alt={company.companyName}
                                        className="w-36 h-36 rounded object-contain border border-gray-200 shadow-md p-2"
                                    />
                                </div>
                            </div>

                            <div className="md:w-2/3 md:pl-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">회사명</h4>
                                        <p className="text-lg font-medium">{company.companyName}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">사업자등록번호</h4>
                                        <p className="text-lg">{company.companyRegistrationNumber}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">대표자명</h4>
                                        <p className="text-lg">{company.companyOwnerName}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">개업일</h4>
                                        <p className="text-lg">{company.companyOpenDate ? formatDate(company.companyOpenDate) : '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">이메일</h4>
                                        <p className="text-lg">{company.companyEmail}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">전화번호</h4>
                                        <p className="text-lg">{company.companyPhone || '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">지역</h4>
                                        <p className="text-lg">{company.companyLocalAddress || '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">승인 상태</h4>
                                        <p className={`text-lg font-medium ${getStatusClass(company.companyApprovalStatus)}`}>
                                            {getApprovalStatusText(company.companyApprovalStatus)}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">가입일</h4>
                                        <p className="text-lg">{formatDate(company.companyCreatedAt)}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">최근 수정일</h4>
                                        <p className="text-lg">{formatDate(company.companyUpdatedAt)}</p>
                                    </div>
                                </div>

                                {company.companyDescription && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-500">회사 소개</h4>
                                        <p className="text-sm mt-1 bg-gray-50 p-3 rounded whitespace-pre-line">{company.companyDescription}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Link
                                to="/admin/companies"
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-2"
                            >
                                목록으로
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <ErrorMessage message="기업 정보를 찾을 수 없습니다." />
            )}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDeleteCompany}
                title="기업 삭제"
                message={`'${company?.companyName}' 기업을 삭제하시겠습니까? 삭제된 기업 정보와 관련 데이터는 복구할 수 없습니다.`}
                confirmText="삭제"
                cancelText="취소"
                type="danger"
            />
        </AdminLayout>
    );
};

export default AdminCompanyDetail;