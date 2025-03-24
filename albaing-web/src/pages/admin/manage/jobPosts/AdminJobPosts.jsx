import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { LoadingSpinner, ErrorMessage, ConfirmModal, useModal } from '../../../../components';
import AdminLayout from '../../AdminLayout';
import Pagination from '../../../../components/common/Pagination';

// 공고 상세 모달
const JobPostDetailModal = ({ isOpen, onClose, jobPost }) => {
    if (!isOpen || !jobPost) return null;

    // 날짜 포맷 변환
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'yyyy-MM-dd');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h3 className="text-xl font-semibold text-gray-800">채용공고 상세 정보</h3>
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
                    <div className="flex flex-col md:flex-row mb-6">
                        <div className="md:w-1/4 mb-4 md:mb-0">
                            <div className="flex justify-center">
                                <img
                                    src={jobPost.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(jobPost.companyName || 'Company')}&background=2563EB&color=fff&size=150`}
                                    alt={jobPost.companyName}
                                    className="w-32 h-32 object-contain border border-gray-200 rounded-lg p-2"
                                />
                            </div>
                        </div>
                        <div className="md:w-3/4 md:pl-6">
                            <h2 className="text-2xl font-bold text-gray-800">{jobPost.jobPostTitle}</h2>
                            <p className="text-lg text-gray-600 mt-1">{jobPost.companyName}</p>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">마감일</h4>
                                    <p className="text-base">{formatDate(jobPost.jobPostDueDate)}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">공고 상태</h4>
                                    <p className={`text-base font-medium ${jobPost.jobPostStatus ? 'text-green-600' : 'text-red-600'}`}>
                                        {jobPost.jobPostStatus ? '공개' : '비공개'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">채용 정보</h3>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">직무 분류</h4>
                                        <p className="mt-1">{jobPost.jobPostJobCategory || '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">고용 형태</h4>
                                        <p className="mt-1">{jobPost.jobPostJobType || '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">근무 기간</h4>
                                        <p className="mt-1">{jobPost.jobPostWorkingPeriod || '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">근무 요일</h4>
                                        <p className="mt-1">{jobPost.jobWorkSchedule || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">근무 조건</h3>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">근무 시간</h4>
                                        <p className="mt-1">{jobPost.jobPostShiftHours || '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">급여</h4>
                                        <p className="mt-1">{jobPost.jobPostSalary || '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">근무지</h4>
                                        <p className="mt-1">{jobPost.jobPostWorkPlace || '-'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">요구 학력</h4>
                                        <p className="mt-1">{jobPost.jobPostRequiredEducations || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {jobPost.jobPostOptionalImage && (
                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <h3 className="text-lg font-semibold mb-3">추가 정보</h3>
                            <div className="flex justify-center">
                                <img
                                    src={jobPost.jobPostOptionalImage}
                                    alt="추가 정보"
                                    className="max-w-full rounded-lg border border-gray-200"
                                />
                            </div>
                        </div>
                    )}

                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <div className="flex justify-between text-sm text-gray-500">
                            <div>게시일: {formatDate(jobPost.jobPostCreatedAt)}</div>
                            {jobPost.jobPostUpdatedAt && (
                                <div>최근 수정일: {formatDate(jobPost.jobPostUpdatedAt)}</div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 공고 상태 변경 모달
const JobPostStatusModal = ({ isOpen, onClose, jobPost, onUpdateStatus }) => {
    const [status, setStatus] = useState(true);

    useEffect(() => {
        if (jobPost) {
            setStatus(jobPost.jobPostStatus);
        }
    }, [jobPost]);

    if (!isOpen || !jobPost) return null;

    const handleSubmit = () => {
        onUpdateStatus(jobPost.jobPostId, status);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">공고 상태 변경</h3>
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
                        <p className="font-medium text-gray-800">공고: {jobPost.jobPostTitle}</p>
                        <p className="text-sm text-gray-600">기업: {jobPost.companyName}</p>
                    </div>

                    <div className="space-y-3">
                        <div
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                status ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                            }`}
                            onClick={() => setStatus(true)}
                        >
                            <div className="flex items-center">
                                <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                        status ? 'border-green-500' : 'border-gray-400'
                                    }`}
                                >
                                    {status && (
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    )}
                                </div>
                                <span className="ml-2 font-medium">공개</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 ml-7">공고를 구직자에게 공개합니다.</p>
                        </div>

                        <div
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                !status ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'
                            }`}
                            onClick={() => setStatus(false)}
                        >
                            <div className="flex items-center">
                                <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                        !status ? 'border-red-500' : 'border-gray-400'
                                    }`}
                                >
                                    {!status && (
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    )}
                                </div>
                                <span className="ml-2 font-medium">비공개</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 ml-7">공고를 비공개로 전환합니다. 구직자에게 표시되지 않습니다.</p>
                        </div>
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

const AdminJobPosts = () => {
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [selectedJobPost, setSelectedJobPost] = useState(null);
    const [filters, setFilters] = useState({
        companyName: '',
        jobPostTitle: '',
        jobPostStatus: ''
    });
    const [sortField, setSortField] = useState('jobPostCreatedAt');
    const [sortDirection, setSortDirection] = useState('desc');

    // 모달 상태 관리
    const detailModal = useModal();
    const statusModal = useModal();
    const deleteModal = useModal();

    // 공고 목록 가져오기
    const fetchJobPosts = () => {
        setLoading(true);
        setError(null);

        axios.get('/api/admin/job-posts', {
            params: {
                companyName: filters.companyName,
                jobPostTitle: filters.jobPostTitle,
                jobPostStatus: filters.jobPostStatus,
                sortOrderBy: sortField,
                isDESC: sortDirection === 'desc'
            }
        })
            .then(response => {
                setJobPosts(response.data);
                setTotalItems(response.data.length);
                setLoading(false);
            })
            .catch(error => {
                console.error('공고 목록 로딩 실패:', error);
                setError('공고 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchJobPosts();
    }, [sortField, sortDirection]);

    // 공고 삭제
    const handleDeleteJobPost = () => {
        if (!selectedJobPost) return;

        setLoading(true);

        axios.delete(`/api/admin/job-posts/${selectedJobPost.jobPostId}`)
            .then(() => {
                fetchJobPosts();
                deleteModal.closeModal();
                setSelectedJobPost(null);
            })
            .catch(error => {
                console.error('공고 삭제 실패:', error);
                setError('공고 삭제에 실패했습니다.');
                setLoading(false);
            });
    };

    // 공고 상태 변경
    const handleUpdateJobPostStatus = (jobPostId, status) => {
        setLoading(true);

        axios.patch(`/api/admin/job-posts/${jobPostId}/status`, { status })
            .then(() => {
                fetchJobPosts();
                statusModal.closeModal();
                setSelectedJobPost(null);
            })
            .catch(error => {
                console.error('공고 상태 변경 실패:', error);
                setError('공고 상태 변경에 실패했습니다.');
                setLoading(false);
            });
    };

    const downloadCSV = (url, filename) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(e => {
                console.error('CSV 다운로드 실패:', e);
                alert('CSV 파일 다운로드에 실패했습니다.');
            });
    };

    // 공고 상세 보기
    const handleViewJobPost = (jobPost) => {
        setSelectedJobPost(jobPost);
        detailModal.openModal();
    };

    // 공고 상태 변경 모달 열기
    const handleOpenStatusModal = (jobPost) => {
        setSelectedJobPost(jobPost);
        statusModal.openModal();
    };

    // 공고 삭제 모달 열기
    const handleOpenDeleteModal = (jobPost) => {
        setSelectedJobPost(jobPost);
        deleteModal.openModal();
    };

    // 검색 필터 적용
    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobPosts();
    };

    // 필터 변경 핸들러
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 정렬 변경 핸들러
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // 현재 페이지의 공고 목록
    const getCurrentJobPosts = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return jobPosts.slice(indexOfFirstItem, indexOfLastItem);
    };

    // 정렬 아이콘 표시
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

    // 마감일 상태 표시
    const getDueDateStatus = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);

        if (due < today) {
            return <span className="text-red-600">마감됨</span>;
        }

        const diffTime = Math.abs(due - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 3) {
            return <span className="text-amber-600">마감 {diffDays}일 전</span>;
        }

        return <span className="text-gray-600">{format(due, 'yyyy-MM-dd')}</span>;
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => downloadCSV('/api/admin/job-posts/csv', `알바잉_채용공고목록_${format(new Date(), 'yyyyMMdd')}.csv`)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        공고 목록 CSV 다운로드
                    </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">채용공고 관리</h1>
                <p className="text-gray-600 mt-1">기업 채용공고를 관리할 수 있습니다.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">기업명</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={filters.companyName}
                            onChange={handleFilterChange}
                            placeholder="기업명 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="jobPostTitle" className="block text-sm font-medium text-gray-700 mb-1">공고 제목</label>
                        <input
                            type="text"
                            id="jobPostTitle"
                            name="jobPostTitle"
                            value={filters.jobPostTitle}
                            onChange={handleFilterChange}
                            placeholder="공고 제목 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="jobPostStatus" className="block text-sm font-medium text-gray-700 mb-1">공고 상태</label>
                        <select
                            id="jobPostStatus"
                            name="jobPostStatus"
                            value={filters.jobPostStatus}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                        >
                            <option value="">모든 상태</option>
                            <option value="true">공개</option>
                            <option value="false">비공개</option>
                        </select>
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            검색
                        </button>
                    </div>
                </form>
            </div>

            {error && <ErrorMessage message={error} className="mb-6" />}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <LoadingSpinner message="채용공고 정보를 불러오는 중..." fullScreen={false} className="py-12" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('jobPostId')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            번호 {sortField === 'jobPostId' && renderSortIcon('jobPostId')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('companyName')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            기업명 {renderSortIcon('companyName')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('jobPostTitle')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            공고 제목 {renderSortIcon('jobPostTitle')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('jobPostDueDate')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            마감일 {renderSortIcon('jobPostDueDate')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        상태
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('jobPostCreatedAt')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            등록일 {renderSortIcon('jobPostCreatedAt')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        관리
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentJobPosts().length > 0 ? (
                                    getCurrentJobPosts().map((jobPost) => (
                                        <tr key={jobPost.jobPostId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {jobPost.jobPostId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {jobPost.companyName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <button
                                                    onClick={() => handleViewJobPost(jobPost)}
                                                    className="hover:text-blue-600 hover:underline"
                                                >
                                                    {jobPost.jobPostTitle}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {getDueDateStatus(jobPost.jobPostDueDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        jobPost.jobPostStatus
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {jobPost.jobPostStatus ? '공개' : '비공개'}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(jobPost.jobPostCreatedAt), 'yyyy-MM-dd')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewJobPost(jobPost)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        상세
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenStatusModal(jobPost)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        상태변경
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(jobPost)}
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

                        <Pagination
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* 공고 상세 모달 */}
            <JobPostDetailModal
                isOpen={detailModal.isOpen}
                onClose={detailModal.closeModal}
                jobPost={selectedJobPost}
            />

            {/* 공고 상태 변경 모달 */}
            <JobPostStatusModal
                isOpen={statusModal.isOpen}
                onClose={statusModal.closeModal}
                jobPost={selectedJobPost}
                onUpdateStatus={handleUpdateJobPostStatus}
            />

            {/* 삭제 확인 모달 */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDeleteJobPost}
                title="채용공고 삭제"
                message={`'${selectedJobPost?.jobPostTitle}' 공고를 삭제하시겠습니까? 삭제된 공고는 복구할 수 없습니다.`}
                confirmText="삭제"
                cancelText="취소"
                type="danger"
            />
        </AdminLayout>
    );
};

export default AdminJobPosts;