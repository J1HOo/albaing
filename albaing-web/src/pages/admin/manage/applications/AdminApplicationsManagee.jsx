import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, useModal } from '../../../../components';

const AdminApplicationsManage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        userName: '',
        companyName: '',
        jobPostTitle: '',
        approveStatus: '',
        sortOrderBy: '지원일',
        isDESC: true
    });

    const confirmModal = useModal();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userId = queryParams.get('userId');
        const jobPostId = queryParams.get('jobPostId');

        if (userId || jobPostId) {
            fetchApplicationsWithFilter(userId, jobPostId);
        } else {
            fetchApplications();
        }
    }, [location.search]);

    useEffect(() => {
        if (!location.search) {
            fetchApplications();
        }
    }, [searchParams.sortOrderBy, searchParams.isDESC]);

    const fetchApplications = () => {
        setLoading(true);

        const params = {
            ...searchParams,
            userName: searchParams.userName || undefined,
            companyName: searchParams.companyName || undefined,
            jobPostTitle: searchParams.jobPostTitle || undefined,
            approveStatus: searchParams.approveStatus || undefined
        };

        axios.get('/api/admin/job-applications', { params })
            .then(response => {
                setApplications(response.data);
            })
            .catch(error => {
                console.error('지원 내역 로딩 실패:', error);
                confirmModal.openModal({
                    title: '오류',
                    message: '지원 내역을 불러오는데 실패했습니다.',
                    type: 'error'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchApplicationsWithFilter = (userId, jobPostId) => {
        setLoading(true);

        let url;
        if (userId) {
            url = `/api/admin/job-applications/user/${userId}`;
        } else if (jobPostId) {
            url = `/api/admin/job-applications/job-post/${jobPostId}`;
        } else {
            fetchApplications();
            return;
        }

        axios.get(url)
            .then(response => {
                setApplications(response.data);
            })
            .catch(error => {
                console.error('필터링된 지원 내역 로딩 실패:', error);
                confirmModal.openModal({
                    title: '오류',
                    message: '지원 내역을 불러오는데 실패했습니다.',
                    type: 'error'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchApplications();
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

    const handleStatusChange = (applicationId, status) => {
        const statusText = {
            'approving': '승인 대기',
            'approved': '승인',
            'denied': '거절'
        }[status];

        confirmModal.openModal({
            title: '상태 변경 확인',
            message: `지원 상태를 '${statusText}'로 변경하시겠습니까?`,
            confirmText: '변경',
            cancelText: '취소',
            type: 'warning',
            onConfirm: () => updateApplicationStatus(applicationId, status)
        });
    };

    const updateApplicationStatus = (applicationId, status) => {
        axios.put(`/api/admin/job-applications/${applicationId}/status`, { approveStatus: status })
            .then(() => {
                setApplications(prev =>
                    prev.map(app =>
                        app.jobApplicationId === applicationId
                            ? { ...app, approveStatus: status }
                            : app
                    )
                );

                confirmModal.openModal({
                    title: '성공',
                    message: '지원 상태가 변경되었습니다.',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('지원 상태 변경 실패:', error);
                confirmModal.openModal({
                    title: '오류',
                    message: '지원 상태 변경에 실패했습니다.',
                    type: 'error'
                });
            });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'approving': { text: '승인 대기', className: 'bg-yellow-100 text-yellow-800' },
            'approved': { text: '승인됨', className: 'bg-green-100 text-green-800' },
            'denied': { text: '거절됨', className: 'bg-red-100 text-red-800' }
        };

        const statusInfo = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
                {statusInfo.text}
            </span>
        );
    };

    if (loading) return <LoadingSpinner message="지원 내역을 불러오는 중..." />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">지원 내역 관리</h2>

            <div className="mb-6 bg-white p-4 shadow rounded-lg">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">지원자명</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={searchParams.userName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="지원자명 검색"
                        />
                    </div>

                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">기업명</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={searchParams.companyName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="기업명 검색"
                        />
                    </div>

                    <div>
                        <label htmlFor="jobPostTitle" className="block text-sm font-medium text-gray-700 mb-1">공고 제목</label>
                        <input
                            type="text"
                            id="jobPostTitle"
                            name="jobPostTitle"
                            value={searchParams.jobPostTitle}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="공고 제목 검색"
                        />
                    </div>

                    <div>
                        <label htmlFor="approveStatus" className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                        <select
                            id="approveStatus"
                            name="approveStatus"
                            value={searchParams.approveStatus}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">전체</option>
                            <option value="approving">승인 대기</option>
                            <option value="approved">승인됨</option>
                            <option value="denied">거절됨</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 flex items-end">
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('지원자명')}>
                            <div className="flex items-center">
                                지원자명
                                {searchParams.sortOrderBy === '지원자명' && (
                                    <span className="ml-1">{searchParams.isDESC ? '▼' : '▲'}</span>
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('법인명')}>
                            <div className="flex items-center">
                                기업명
                                {searchParams.sortOrderBy === '법인명' && (
                                    <span className="ml-1">{searchParams.isDESC ? '▼' : '▲'}</span>
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공고 제목</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('지원일')}>
                            <div className="flex items-center">
                                지원일
                                {searchParams.sortOrderBy === '지원일' && (
                                    <span className="ml-1">{searchParams.isDESC ? '▼' : '▲'}</span>
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length > 0 ? (
                        applications.map((application) => (
                            <tr key={application.jobApplicationId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {application.applicantName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {application.companyName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {application.jobPostTitle}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {getStatusBadge(application.approveStatus)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(application.applicationAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/resumes/${application.resumeId}/user/${application.userId}`)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            이력서 확인
                                        </button>

                                        {application.approveStatus === 'approving' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(application.jobApplicationId, 'approved')}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    승인
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(application.jobApplicationId, 'denied')}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    거절
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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

export default AdminApplicationsManage;