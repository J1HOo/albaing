import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ErrorHandler } from "../../../../components/ErrorHandler";
import AdminDataTable from "../../AdminDataTable";
import adminApiService from '../../../../service/apiAdminService';

const AdminApplicationsManage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [searchParams, setSearchParams] = useState({
        userName: '',
        companyName: '',
        jobPostTitle: '',
        approveStatus: '',
        sortOrderBy: '지원일',
        isDESC: true,
        currentPage: 1,
        rowsPerPage: 10
    });

    const navigate = useNavigate();
    const location = useLocation();
    const { handleError, handleSuccess, confirmAction } = ErrorHandler();

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

    // 정렬 변경시에만 호출
    useEffect(() => {
        if (!location.search) {
            fetchApplications();
        }
    }, [searchParams.sortOrderBy, searchParams.isDESC]);

    const fetchApplications = () => {
        setLoading(true);

        const params = {
            userName: searchParams.userName || undefined,
            companyName: searchParams.companyName || undefined,
            jobPostTitle: searchParams.jobPostTitle || undefined,
            approveStatus: searchParams.approveStatus || undefined,
            sortOrderBy: searchParams.sortOrderBy,
            isDESC: searchParams.isDESC,
            page: searchParams.currentPage,
            limit: searchParams.rowsPerPage
        };

        adminApiService.getApplications(params)
            .then(response => {
                setApplications(response.applications || response);
                setTotalItems(response.total || response.length);
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '지원 내역 로딩 실패');
                setLoading(false);
            });
    };

    const fetchApplicationsWithFilter = (userId, jobPostId) => {
        setLoading(true);

        adminApiService.getFilteredApplications(userId, jobPostId)
            .then(response => {
                setApplications(response.applications || response);
                setTotalItems(response.length);
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '필터링된 지원 내역을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleSearch = (searchTerm, page, rowsPerPage) => {
        setSearchParams(prev => ({
            ...prev,
            userName: searchTerm,
            currentPage: page || 1,
            rowsPerPage: rowsPerPage || prev.rowsPerPage
        }));

        fetchApplications();
    };

    const handleSort = (key, direction) => {
        // 컬럼 키를 API 정렬 필드명으로 변환
        const sortFieldMap = {
            'applicantName': '지원자명',
            'companyName': '법인명',
            'applicationAt': '지원일'
        };

        setSearchParams(prev => ({
            ...prev,
            sortOrderBy: sortFieldMap[key] || key,
            isDESC: direction === 'desc'
        }));

        fetchApplications();
    };

    const handleFilter = (filters) => {
        setSearchParams(prev => ({
            ...prev,
            ...filters,
            currentPage: 1
        }));

        fetchApplications();
    };

    const handlePageChange = (page, rowsPerPage) => {
        setSearchParams(prev => ({
            ...prev,
            currentPage: page,
            rowsPerPage: rowsPerPage || prev.rowsPerPage
        }));

        fetchApplications();
    };

    const handleStatusChange = (applicationId, status) => {
        confirmAction(
            `지원 상태를 "${status === 'approved' ? '승인' : status === 'denied' ? '거절' : '대기'}"로 변경하시겠습니까?`,
            () => {
                adminApiService.updateApplicationStatus(applicationId, status)
                    .then(() => {
                        // 현재 지원내역 목록에서 상태 업데이트
                        setApplications(prev =>
                            prev.map(app =>
                                app.jobApplicationId === applicationId
                                    ? {...app, approveStatus: status}
                                    : app
                            )
                        );
                        handleSuccess(`지원 상태가 변경되었습니다.`);
                    })
                    .catch(error => {
                        handleError(error, '지원 상태 변경에 실패했습니다.');
                    });
            },
            {
                title: '상태 변경',
                confirmText: '변경',
                cancelText: '취소',
                type: 'info'
            }
        );
    };

    const handleViewResume = (resumeId, userId) => {
        navigate(`/resumes/${resumeId}/user/${userId}`);
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

    // 테이블 컬럼 정의
    const columns = [
        {
            key: 'applicantName',
            label: '지원자명',
            sortable: true,
            filterable: true
        },
        {
            key: 'companyName',
            label: '기업명',
            sortable: true,
            filterable: true
        },
        {
            key: 'jobPostTitle',
            label: '공고 제목',
            filterable: true
        },
        {
            key: 'approveStatus',
            label: '상태',
            filterable: true,
            render: (value) => getStatusBadge(value)
        },
        {
            key: 'applicationAt',
            label: '지원일',
            sortable: true,
            render: (value) => formatDate(value)
        }
    ];

    // 행 액션 렌더링
    const renderRowActions = (application) => (
        <div className="flex space-x-2">
            <button
                onClick={() => handleViewResume(application.resumeId, application.userId)}
                className="text-blue-600 hover:text-blue-900"
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
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">지원 내역 관리</h2>
            </div>

            <div className="bg-white p-4 shadow rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">지원자명</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={searchParams.userName}
                            onChange={(e) => setSearchParams({...searchParams, userName: e.target.value})}
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
                            onChange={(e) => setSearchParams({...searchParams, companyName: e.target.value})}
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
                            onChange={(e) => setSearchParams({...searchParams, jobPostTitle: e.target.value})}
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
                            onChange={(e) => setSearchParams({...searchParams, approveStatus: e.target.value})}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">전체</option>
                            <option value="approving">승인 대기</option>
                            <option value="approved">승인됨</option>
                            <option value="denied">거절됨</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={fetchApplications}
                        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        검색
                    </button>
                </div>
            </div>

            <AdminDataTable
                title="지원 내역 목록"
                data={applications}
                columns={columns}
                isLoading={loading}
                totalItems={totalItems}
                onSearch={handleSearch}
                onSort={handleSort}
                onFilter={handleFilter}
                onPageChange={handlePageChange}
                renderRowActions={renderRowActions}
                selectable={false}
                searchable={true}
                exportable={true}
                pagination={true}
            />
        </div>
    );
};

export default AdminApplicationsManage;