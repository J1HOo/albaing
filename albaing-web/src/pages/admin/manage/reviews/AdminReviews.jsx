import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { LoadingSpinner, ErrorMessage, ConfirmModal, useModal } from '../../../../components';
import AdminLayout from '../../AdminLayout';
import Pagination from '../../../../components/common/Pagination';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [selectedReview, setSelectedReview] = useState(null);
    const [filters, setFilters] = useState({
        userName: '',
        companyName: '',
        reviewTitle: ''
    });

    const [sortField, setSortField] = useState('reviewCreatedAt');
    const [sortDirection, setSortDirection] = useState('desc');

    const deleteModal = useModal();

    const convertToCamelCase = (data) => {
        if (!data) return [];

        return data.map(item => ({
            reviewId: item.review_id,
            reviewTitle: item.review_title,
            reviewContent: item.review_content,
            reviewCreatedAt: item.review_created_at,
            reviewUpdatedAt: item.review_updated_at,
            userId: item.user_id,
            userName: item.user_name,
            companyId: item.company_id,
            companyName: item.company_name
        }));
    };

    // 리뷰 목록 가져오기
    const fetchReviews = () => {
        setLoading(true);
        setError(null);

        axios.get('/api/admin/reviews', {
            params: {
                userName: filters.userName,
                companyName: filters.companyName,
                reviewTitle: filters.reviewTitle,
                sortOrderBy: sortField,
                isDESC: sortDirection === 'desc'
            }
        })
            .then(response => {
                const camelCaseData = convertToCamelCase(response.data);
                setReviews(camelCaseData);
                setTotalItems(camelCaseData.length);
                setLoading(false);
            })
            .catch(error => {
                console.error('리뷰 목록 로딩 실패:', error);
                console.error('에러 응답:', error.response);
                setError('리뷰 목록을 불러오는데 실패했습니다: ' +
                    (error.response?.data?.message || error.message));
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchReviews();
    }, [sortField, sortDirection]);

    // 리뷰 삭제
    const handleDeleteReview = () => {
        if (!selectedReview) return;

        setLoading(true);

        axios.delete(`/api/admin/reviews/${selectedReview.reviewId}`)
            .then(() => {
                fetchReviews();
                deleteModal.closeModal();
                setSelectedReview(null);
            })
            .catch(error => {
                console.error('리뷰 삭제 실패:', error);
                setError('리뷰 삭제에 실패했습니다.');
                setLoading(false);
                deleteModal.closeModal();
            });
    };

    const handleOpenDeleteModal = (review) => {
        setSelectedReview(review);
        deleteModal.openModal();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchReviews();
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

    const getCurrentReviews = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return reviews.slice(indexOfFirstItem, indexOfLastItem);
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

    const formatDateSafely = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'yyyy-MM-dd');
        } catch (error) {
            console.warn('Invalid date format:', dateString);
            return '-';
        }
    };

    const summarizeContent = (content, maxLength = 50) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + '...';
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">리뷰 관리</h1>
                <p className="text-gray-600 mt-1">사용자가 작성한 기업 리뷰를 관리할 수 있습니다.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">작성자명</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={filters.userName}
                            onChange={handleFilterChange}
                            placeholder="작성자명 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
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
                        <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-1">리뷰 제목</label>
                        <input
                            type="text"
                            id="reviewTitle"
                            name="reviewTitle"
                            value={filters.reviewTitle}
                            onChange={handleFilterChange}
                            placeholder="리뷰 제목 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
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
                    <LoadingSpinner message="리뷰 정보를 불러오는 중..." fullScreen={false} className="py-12" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('reviewId')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            번호 {sortField === 'reviewId' && renderSortIcon('reviewId')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('userName')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            작성자 {renderSortIcon('userName')}
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
                                            onClick={() => handleSort('reviewTitle')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            리뷰 제목 {renderSortIcon('reviewTitle')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        리뷰 내용
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('reviewCreatedAt')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            작성일 {renderSortIcon('reviewCreatedAt')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        관리
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentReviews().length > 0 ? (
                                    getCurrentReviews().map((review) => (
                                        <tr key={review.reviewId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {review.reviewId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {review.userName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {review.companyName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <Link
                                                    to={`/admin/reviews/${review.reviewId}?companyId=${review.companyId}`}
                                                    className="hover:text-blue-600 hover:underline"
                                                >
                                                    {review.reviewTitle}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {summarizeContent(review.reviewContent)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDateSafely(review.reviewCreatedAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/admin/reviews/${review.reviewId}?companyId=${review.companyId}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        상세
                                                    </Link>
                                                    <Link
                                                        to={`/admin/reviews/${review.reviewId}/edit?companyId=${review.companyId}`}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        수정
                                                    </Link>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(review)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr key="no-results" className="hover:bg-gray-50">
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

            {/* 삭제 확인 모달 */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDeleteReview}
                title="리뷰 삭제"
                message={`'${selectedReview?.reviewTitle}' 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.`}
                confirmText="삭제"
                cancelText="취소"
                type="danger"
            />
        </AdminLayout>
    );
};

export default AdminReviews;