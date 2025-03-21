import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ConfirmModal, LoadingSpinner, useModal } from '../../../../components';
import { ErrorHandler } from "../../../../components/ErrorHandler";
import AdminDataTable from "../../AdminDataTable";

const AdminReviewManage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [searchParams, setSearchParams] = useState({
        searchTerm: '',
        currentPage: 1,
        rowsPerPage: 10,
        sortField: 'review_created_at',
        sortDirection: 'desc'
    });

    const confirmModal = useModal();
    const { handleError, handleSuccess } = ErrorHandler();
    const navigate = useNavigate();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = () => {
        setLoading(true);

        axios.get('/api/admin/reviews')
            .then(response => {
                const data = response.data;

                // 검색어 필터링
                let filteredData = data;
                if (searchParams.searchTerm) {
                    const term = searchParams.searchTerm.toLowerCase();
                    filteredData = data.filter(review =>
                        (review.reviewTitle || review.review_title || '').toLowerCase().includes(term) ||
                        (review.userName || review.user_name || '').toLowerCase().includes(term) ||
                        (review.companyName || review.company_name || '').toLowerCase().includes(term)
                    );
                }

                // 정렬
                const sortField = searchParams.sortField;
                const sortDirection = searchParams.sortDirection;

                filteredData.sort((a, b) => {
                    const fieldA = getNestedField(a, sortField);
                    const fieldB = getNestedField(b, sortField);

                    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
                    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });

                // 페이지네이션
                setTotalItems(filteredData.length);
                const startIdx = (searchParams.currentPage - 1) * searchParams.rowsPerPage;
                const endIdx = startIdx + searchParams.rowsPerPage;

                setReviews(filteredData.slice(startIdx, endIdx));
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '리뷰 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    // 중첩 필드 값 가져오기 (review_created_at 또는 reviewCreatedAt 처리를 위함)
    const getNestedField = (obj, field) => {
        // 스네이크 케이스와 카멜 케이스 모두 확인
        const camelField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        const snakeField = field;

        return obj[camelField] !== undefined ? obj[camelField] : obj[snakeField];
    };

    const handleDelete = (reviewId) => {
        confirmModal.openModal({
            title: '리뷰 삭제',
            message: "이 리뷰를 삭제하시겠습니까?",
            confirmText: '삭제',
            cancelText: '취소',
            type: 'warning',
            isDestructive: true,
            onConfirm: () => {
                setLoading(true);

                // 먼저 리뷰의 모든 댓글 삭제 후 리뷰 삭제 (Promise 체인)
                axios.delete(`/api/admin/reviews/${reviewId}/comments`)
                    .then(() => {
                        // 리뷰 삭제
                        return axios.delete(`/api/admin/reviews/${reviewId}`);
                    })
                    .then(() => {
                        // 성공 시 리뷰 목록에서 제거
                        setReviews(prev => prev.filter(review =>
                            (review.reviewId || review.review_id) !== reviewId
                        ));
                        handleSuccess('리뷰가 삭제되었습니다.');
                        setLoading(false);
                    })
                    .catch(error => {
                        handleError(error, '리뷰 삭제에 실패했습니다.');
                        setLoading(false);
                    });
            }
        });
    };

    const handleCommentDelete = (reviewId, commentId) => {
        confirmModal.openModal({
            title: '댓글 삭제',
            message: '이 댓글을 삭제하시겠습니까?',
            confirmText: '삭제',
            cancelText: '취소',
            type: 'warning',
            isDestructive: true,
            onConfirm: () => {
                axios.delete(`/api/admin/reviews/${reviewId}/comments/${commentId}`)
                    .then(() => {
                        handleSuccess('댓글이 삭제되었습니다.');

                        // 리뷰 상세 정보 다시 불러오기
                        return axios.get(`/api/admin/reviews/${reviewId}`);
                    })
                    .then(response => {
                        // 리뷰 목록 갱신 (댓글 수가 변경되었을 수 있음)
                        const updatedReview = response.data;
                        setReviews(prev => prev.map(review =>
                            (review.reviewId || review.review_id) === reviewId ? updatedReview : review
                        ));
                    })
                    .catch(error => {
                        handleError(error, '댓글 삭제에 실패했습니다.');
                    });
            }
        });
    };

    const handleSearch = (searchTerm, page = 1, rowsPerPage = searchParams.rowsPerPage) => {
        setSearchParams(prev => ({
            ...prev,
            searchTerm,
            currentPage: page,
            rowsPerPage
        }));

        setTimeout(fetchReviews, 0);
    };

    const handleSort = (field, direction) => {
        // 컬럼 키를 실제 필드명으로 변환
        const fieldMap = {
            'reviewId': 'review_id',
            'reviewTitle': 'review_title',
            'companyName': 'company_name',
            'userName': 'user_name',
            'reviewCreatedAt': 'review_created_at'
        };

        setSearchParams(prev => ({
            ...prev,
            sortField: fieldMap[field] || field,
            sortDirection: direction,
            currentPage: 1
        }));

        setTimeout(fetchReviews, 0);
    };

    const handlePageChange = (page, rowsPerPage = searchParams.rowsPerPage) => {
        setSearchParams(prev => ({
            ...prev,
            currentPage: page,
            rowsPerPage
        }));

        setTimeout(fetchReviews, 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    // 테이블 컬럼 설정
    const columns = [
        {
            key: 'reviewId',
            label: 'ID',
            sortable: true,
            render: (value, row) => value || row.review_id
        },
        {
            key: 'reviewTitle',
            label: '제목',
            sortable: true,
            filterable: true,
            render: (value, row) => value || row.review_title
        },
        {
            key: 'companyName',
            label: '회사명',
            sortable: true,
            filterable: true,
            render: (value, row) => value || row.company_name
        },
        {
            key: 'userName',
            label: '작성자',
            sortable: true,
            filterable: true,
            render: (value, row) => value || row.user_name
        },
        {
            key: 'reviewCreatedAt',
            label: '작성일',
            sortable: true,
            render: (value, row) => formatDate(value || row.review_created_at)
        }
    ];

    // 행 액션 렌더링
    const renderRowActions = (review) => {
        const reviewId = review.reviewId || review.review_id;
        const companyId = review.companyId || review.company_id;

        return (
            <div className="flex space-x-2">
                <button
                    onClick={() => navigate(`/companies/${companyId}/reviews/${reviewId}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                >
                    보기
                </button>
                <button
                    onClick={() => navigate(`/admin/reviews/${reviewId}/edit`)}
                    className="text-blue-600 hover:text-blue-900"
                >
                    수정
                </button>
                <button
                    onClick={() => handleDelete(reviewId)}
                    className="text-red-600 hover:text-red-900"
                >
                    삭제
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">리뷰 관리</h2>
                <button
                    onClick={fetchReviews}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    리뷰 목록 새로고침
                </button>
            </div>

            <AdminDataTable
                title="리뷰 목록"
                data={reviews}
                columns={columns}
                isLoading={loading}
                totalItems={totalItems}
                onSearch={handleSearch}
                onSort={handleSort}
                onPageChange={handlePageChange}
                renderRowActions={renderRowActions}
                selectable={false}
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
                    isDestructive={confirmModal.modalProps.isDestructive}
                />
            )}
        </div>
    );
};

export default AdminReviewManage;