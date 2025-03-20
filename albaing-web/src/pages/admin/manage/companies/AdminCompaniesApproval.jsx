import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, useModal } from '../../../../components';

const AdminCompaniesApproval = () => {
    const [pendingCompanies, setPendingCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const confirmModal = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingCompanies();
    }, []);

    const fetchPendingCompanies = () => {
        setLoading(true);
        axios.get('/api/admin/companies/pending')
            .then(response => {
                setPendingCompanies(response.data);
            })
            .catch(error => {
                console.error('승인 대기 기업 목록 로딩 실패:', error);
                confirmModal.openModal({
                    title: '오류',
                    message: '승인 대기 기업 목록을 불러오는데 실패했습니다.',
                    type: 'error'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleApprove = (companyId) => {
        axios.patch(`/api/admin/companies/${companyId}/status`, { companyApprovalStatus: 'approved' })
            .then(() => {
                setPendingCompanies(prev => prev.filter(company => company.companyId !== companyId));
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

    const handleReject = (companyId) => {
        axios.patch(`/api/admin/companies/${companyId}/status`, { companyApprovalStatus: 'hidden' })
            .then(() => {
                setPendingCompanies(prev => prev.filter(company => company.companyId !== companyId));
                confirmModal.openModal({
                    title: '성공',
                    message: '기업 승인이 거부되었습니다.',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('기업 승인 거부 실패:', error);
                confirmModal.openModal({
                    title: '오류',
                    message: '기업 승인 거부에 실패했습니다.',
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

    const confirmReject = (company) => {
        confirmModal.openModal({
            title: '기업 승인 거부',
            message: `${company.companyName} 기업의 승인을 거부하시겠습니까?`,
            confirmText: '거부',
            cancelText: '취소',
            type: 'warning',
            onConfirm: () => handleReject(company.companyId)
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    if (loading) return <LoadingSpinner message="승인 대기 기업 목록을 불러오는 중..." />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">기업 승인 관리</h2>
                <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm font-medium">
          대기 기업: {pendingCompanies.length}개
        </span>
            </div>

            {pendingCompanies.length === 0 ? (
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="text-lg text-gray-700">현재 승인 대기 중인 기업이 없습니다.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingCompanies.map((company) => (
                        <div key={company.companyId} className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">{company.companyName}</h3>
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  승인대기
                </span>
                            </div>

                            <div className="p-4">
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <dt className="text-gray-500">대표자명</dt>
                                    <dd className="text-gray-900">{company.companyOwnerName}</dd>

                                    <dt className="text-gray-500">사업자등록번호</dt>
                                    <dd className="text-gray-900">{company.companyRegistrationNumber}</dd>

                                    <dt className="text-gray-500">전화번호</dt>
                                    <dd className="text-gray-900">{company.companyPhone}</dd>

                                    <dt className="text-gray-500">이메일</dt>
                                    <dd className="text-gray-900">{company.companyEmail}</dd>

                                    <dt className="text-gray-500">주소</dt>
                                    <dd className="text-gray-900">{company.companyLocalAddress}</dd>

                                    <dt className="text-gray-500">가입일</dt>
                                    <dd className="text-gray-900">{formatDate(company.companyCreatedAt)}</dd>
                                </dl>

                                <div className="mt-4 flex space-x-3">
                                    <button
                                        onClick={() => navigate(`/admin/companies/${company.companyId}`)}
                                        className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        상세 정보
                                    </button>
                                    <button
                                        onClick={() => confirmApprove(company)}
                                        className="flex-1 py-2 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700"
                                    >
                                        승인
                                    </button>
                                    <button
                                        onClick={() => confirmReject(company)}
                                        className="flex-1 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700"
                                    >
                                        거부
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCompaniesApproval;