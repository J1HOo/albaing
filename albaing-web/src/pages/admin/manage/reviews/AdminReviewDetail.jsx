import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, Link, useSearchParams} from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { LoadingSpinner, ErrorMessage, ConfirmModal, useModal } from '../../../../components';
import AdminLayout from '../../AdminLayout';

const AdminReviewDetail = () => {
    const { reviewId } = useParams();
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get('companyId');
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const deleteModal = useModal();
    const deleteCommentModal = useModal();
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    useEffect(() => {
        if (reviewId && companyId) {
            fetchReviewDetail();
        }
    }, [reviewId, companyId]);


    const fetchReviewDetail = () => {
        setLoading(true);

        axios.get(`/api/companies/${companyId}/reviews/${reviewId}`)
            .then(response => {
                setReview(response.data);
                setComments(response.data.comments || []);
                setLoading(false);
            })
            .catch(error => {
                setError(`리뷰 조회 실패: ${error.message}`);
                setLoading(false);
            });
    };

    const handleDeleteReview = () => {
        setLoading(true);

        axios.delete(`/api/admin/reviews/${reviewId}`)
            .then(() => {
                navigate('/admin/reviews');
            })
            .catch(error => {
                console.error('리뷰 삭제 실패:', error);
                setError('리뷰 삭제에 실패했습니다.');
                setLoading(false);
                deleteModal.closeModal();
            });
    };

    const handleDeleteComment = () => {
        if (!selectedCommentId) return;

        axios.delete(`/api/admin/reviews/${reviewId}/comments/${selectedCommentId}`)
            .then(() => {
                fetchReviewDetail();
                deleteCommentModal.closeModal();
            })
            .catch(error => {
                console.error('댓글 삭제 실패:', error);
                alert('댓글 삭제에 실패했습니다.');
                deleteCommentModal.closeModal();
            });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    };

    if (loading) return (
        <AdminLayout>
            <LoadingSpinner message="리뷰 정보를 불러오는 중..." />
        </AdminLayout>
    );

    if (error) return (
        <AdminLayout>
            <ErrorMessage message={error} />
        </AdminLayout>
    );

    if (!review) return (
        <AdminLayout>
            <ErrorMessage message="리뷰 정보를 찾을 수 없습니다." />
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">리뷰 상세</h1>
                <div className="flex space-x-2">
                    <Link
                        to={`/admin/reviews/${review.reviewId}/edit?companyId=${review.companyId}`}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    >
                        수정
                    </Link>
                    <button
                        onClick={deleteModal.openModal}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        삭제
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{review.reviewTitle}</h2>
                        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                            <div className="mr-4">작성자: {review.userName || '알 수 없음'}</div>
                            <div className="mr-4">기업: {review.companyName || '-'}</div>
                            <div className="mr-4">작성일: {formatDate(review.reviewCreatedAt)}</div>
                            {review.reviewUpdatedAt && review.reviewUpdatedAt !== review.reviewCreatedAt && (
                                <div>수정일: {formatDate(review.reviewUpdatedAt)}</div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                            {review.reviewContent}
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">댓글 ({comments.length})</h3>

                        {comments.length > 0 ? (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.commentId} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between">
                                            <div className="font-medium text-gray-800">{comment.userName || '알 수 없음'}</div>
                                            <button
                                                onClick={() => {
                                                    setSelectedCommentId(comment.commentId);
                                                    deleteCommentModal.openModal();
                                                }}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                        <div className="text-sm text-gray-500 mb-2">
                                            {formatDate(comment.commentCreatedAt)}
                                            {comment.commentUpdatedAt && comment.commentUpdatedAt !== comment.commentCreatedAt &&
                                                ` (수정됨: ${formatDate(comment.commentUpdatedAt)})`}
                                        </div>
                                        <div className="text-gray-700">
                                            {comment.commentContent}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                댓글이 없습니다.
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Link
                            to="/admin/reviews"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                            목록으로
                        </Link>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDeleteReview}
                title="리뷰 삭제"
                message={`'${review.reviewTitle}' 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.`}
                confirmText="삭제"
                cancelText="취소"
                type="danger"
            />

            <ConfirmModal
                isOpen={deleteCommentModal.isOpen}
                onClose={deleteCommentModal.closeModal}
                onConfirm={handleDeleteComment}
                title="댓글 삭제"
                message="이 댓글을 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다."
                confirmText="삭제"
                cancelText="취소"
                type="danger"
            />
        </AdminLayout>
    );
};

export default AdminReviewDetail;