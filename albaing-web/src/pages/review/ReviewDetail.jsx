import {useNavigate, useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";
import {ConfirmModal, ErrorMessage, LoadingSpinner} from "../../components";
import {useModal, AlertModal} from "../../components";
import {useAuth} from "../../contexts/AuthContext";

const ReviewDetail = () => {
    const {companyId, reviewId} = useParams();
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {user} = useAuth(); // 현재 로그인한 사용자 정보 가져오기
    const currentUserId = user?.type === 'personal' ? user?.data?.userId : null;  // 로그인한 사용자의 userId

    const [editReviewId, setEditReviewId] = useState(null);
    const [editReviewContent, setEditReviewContent] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState("");
    const navigate = useNavigate();

    const alertModal = useModal();
    const confirmModal = useModal();

    // 조회한 리뷰 내용 불러오기
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/companies/${companyId}/reviews/${reviewId}`)
            .then((res) => {
                const reviewData = {
                    reviewId: res.data.reviewId,
                    userId: res.data.userId,
                    companyId: res.data.companyId || companyId,
                    reviewTitle: res.data.reviewTitle,
                    reviewContent: res.data.reviewContent,
                    reviewCreatedAt: res.data.reviewCreatedAt,
                    reviewUpdatedAt: res.data.reviewUpdatedAt
                };

                setReview(reviewData);

                if (Array.isArray(res.data.comments)) {
                    setComments(res.data.comments);
                } else {
                    setComments([]);
                }

                setLoading(false);
            })
            .catch((err) => {
                setError("리뷰를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });


    }, [reviewId, companyId]);

    // 댓글 작성
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentInput.trim()) return;

        setLoading(true);
        axios.post(`/api/companies/${companyId}/reviews/${reviewId}/comments`, {
            reviewId: parseInt(reviewId),
            commentContent: commentInput
        }, {
            withCredentials: true
        })
            .then(() => {
                return axios.get(`/api/companies/${companyId}/reviews/${reviewId}`);
            })
            .then((res) => {
                if (Array.isArray(res.data.comments)) {
                    setComments(res.data.comments);
                } else {
                    const newComment = {
                        commentId: Date.now(),
                        commentContent: commentInput,
                        commentCreatedAt: new Date().toISOString()
                    };
                    setComments(prevComments => [...prevComments, newComment]);
                }
                setCommentInput("");
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    alertModal.openModal({
                        title: '로그인 필요',
                        message: '댓글을 작성하려면 로그인이 필요합니다.',
                        type: 'info'
                    });
                } else {
                    alertModal.openModal({
                        title: '오류',
                        message: '댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.',
                        type: 'warning',
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //리뷰 수정
    const handleReviewUpdate = () => {
        if (!editReviewContent.trim()) {
            alertModal.openModal({
                title: '입력 오류',
                message: '리뷰 내용을 입력해주세요.',
                type: 'warning'
            });
            return;
        }

        setLoading(true);
        axios.put(`/api/reviews/${reviewId}`, {
            reviewContent: editReviewContent
        })
            .then(() => {
                return axios.get(`/api/companies/${companyId}/reviews/${reviewId}`);
            })
            .then((res) => {
                const updatedReview = res.data;
                setReview({
                    ...updatedReview,
                    reviewUpdatedAt: updatedReview.reviewUpdatedAt || new Date().toISOString() // 수정된 시간 반영
                });
                setEditReviewId(null);
                setEditReviewContent('');
                alertModal.openModal({
                    title: '수정 완료',
                    message: '리뷰가 성공적으로 수정되었습니다.',
                    type: 'success'
                });
            })
            .catch((err) => {
                alertModal.openModal({
                    title: '오류 발생',
                    message: '리뷰 수정 중 오류가 발생했습니다. 다시 시도해주세요.',
                    type: 'error'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //리뷰 삭제
    const handleReviewDelete = () => {
        confirmModal.openModal({
            title: '리뷰 삭제',
            message: '정말로 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            confirmText: '삭제',
            cancelText: '취소',
            onConfirm: () => {
                setLoading(true);
                axios.delete(`/api/reviews/${reviewId}`, {withCredentials: true})
                    .then(() => {
                        alertModal.openModal({
                            title: '삭제 완료',
                            message: '리뷰가 성공적으로 삭제되었습니다.',
                            type: 'success',
                            onClose: () => navigate(-1)
                        });
                    })
                    .catch((err) => {
                        alertModal.openModal({
                            title: '오류 발생',
                            message: '리뷰 삭제 중 오류가 발생했습니다. 다시 시도해주세요.',
                            type: 'error'
                        });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        });
    };

    //댓글 수정
    const handleCommentEdit = (commentId) => {
        if (!editCommentContent.trim()) {
            alertModal.openModal({
                title: '입력 오류',
                message: '댓글 내용을 입력해주세요.',
                type: 'warning'
            });
            return;
        }

        setLoading(true);
        axios.put(`/api/reviews/${reviewId}/comments/${commentId}`, {
            commentContent: editCommentContent
        })
            .then(() => {
                return axios.get(`/api/companies/${companyId}/reviews/${reviewId}`);
            })
            .then((res) => {
                const updatedComments = res.data.comments;
                setComments(updatedComments);
                setEditCommentId(null);
                setEditCommentContent('');
                alertModal.openModal({
                    title: '수정 완료',
                    message: '댓글이 성공적으로 수정되었습니다.',
                    type: 'success'
                });
            })
            .catch((err) => {
                alertModal.openModal({
                    title: '오류 발생',
                    message: '댓글 수정 중 오류가 발생했습니다. 다시 시도해주세요.',
                    type: 'error'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //댓글 삭제
    const handleCommentDelete = (commentId) => {
        confirmModal.openModal({
            title: '댓글 삭제',
            message: '정말로 이 댓글을 삭제하시겠습니까?',
            confirmText: '삭제',
            cancelText: '취소',
            onConfirm: () => {
                setLoading(true);
                axios.delete(`/api/reviews/${reviewId}/comments/${commentId}`,
                    {withCredentials: true})
                    .then(() => {
                        setComments(comments.filter(comment => comment.commentId !== commentId));
                        alertModal.openModal({
                            title: '삭제 완료',
                            message: '댓글이 성공적으로 삭제되었습니다.',
                            type: 'success'
                        });
                    })
                    .catch((err) => {
                        alertModal.openModal({
                            title: '오류 발생',
                            message: '댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.',
                            type: 'error'
                        });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        });
    };

    if (loading) return <LoadingSpinner message="로딩 중..."/>;
    if (error) return <ErrorMessage message={error}/>;
    if (!review) return <div className="text-center py-10">리뷰를 찾을 수 없습니다.</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* 리뷰 헤더 */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{review.reviewTitle}</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                작성일: {new Date(review.reviewCreatedAt).toLocaleString()} <br/>
                                수정일: {review.reviewUpdatedAt ? new Date(review.reviewUpdatedAt).toLocaleString() : "수정되지 않음"}
                            </p>
                        </div>

                        {currentUserId && review.userId === currentUserId && (
                            <div className="flex space-x-2 self-end sm:self-center">
                                <button
                                    onClick={() => {
                                        setEditReviewId(review.reviewId);
                                        setEditReviewContent(review.reviewContent);
                                    }}
                                    className="flex items-center px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-md transition-colors border border-blue-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span className="font-medium">수정</span>
                                </button>

                                <button
                                    onClick={handleReviewDelete}
                                    className="flex items-center px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-md transition-colors border border-red-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span className="font-medium">삭제</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 리뷰 내용 */}
                <div className="p-6 border-b border-gray-200">
                    {editReviewId === review.reviewId ? (
                        <div className="space-y-4">
                            <textarea
                                value={editReviewContent}
                                onChange={(e) => setEditReviewContent(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="6"
                            ></textarea>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={handleReviewUpdate}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    저장
                                </button>
                                <button
                                    onClick={() => setEditReviewId(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 whitespace-pre-line">{review.reviewContent}</p>
                    )}
                </div>

                {/* 댓글 섹션 */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">댓글 ({comments.length})</h2>

                    {/* 댓글 목록 */}
                    {comments.length > 0 ? (
                        <ul className="space-y-4 mb-6">
                            {comments.map((comment) => (
                                <li key={comment.commentId}
                                    className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            {/* 댓글 작성자 표시 - 회사/어드민/일반 유저 구분 */}
                                            {comment.userId === review.companyId ? (
                                                <span
                                                    className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded mr-2">
                                                        관리자
                                                </span>
                                            ) : (
                                                comment.userId === 1 ? ( // 어드민 ID를 1로 가정, 실제 어드민 ID로 변경 필요
                                                    <span
                                                        className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded mr-2">
                                                            알바잉
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded mr-2">
                                                            사용자
                                                    </span>
                                                )
                                            )}
                                            <span className="text-sm text-gray-500">
                                                {new Date(comment.commentCreatedAt).toLocaleString()}
                                            </span>
                                            {comment.commentUpdatedAt && (
                                                <span className="text-sm text-gray-500">
                                                      (수정됨: {new Date(comment.commentUpdatedAt).toLocaleString()})
                                                </span>
                                            )}
                                        </div>

                                        {/* 내 댓글인 경우만 수정/삭제 버튼 표시 */}
                                        {currentUserId && comment.userId === currentUserId && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditCommentId(comment.commentId);
                                                        setEditCommentContent(comment.commentContent);
                                                    }}
                                                    className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleCommentDelete(comment.commentId)}
                                                    className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* 댓글 내용 - 수정 중 또는 일반 표시 */}
                                    {editCommentId === comment.commentId ? (
                                        <div className="mt-3 space-y-2">
                                            <textarea
                                            value={editCommentContent}
                                            onChange={(e) => setEditCommentContent(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows="3"
                                            ></textarea>
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleCommentEdit(comment.commentId)}
                                                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
                                                >
                                                    저장
                                                </button>
                                                <button
                                                    onClick={() => setEditCommentId(null)}
                                                    className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors"
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-gray-700">{comment.commentContent}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mb-6">아직 댓글이 없습니다.</p>
                    )}

                    {/* 댓글 작성 폼 */}
                    <form onSubmit={handleCommentSubmit} className="mt-4">
                        <div className="flex flex-col space-y-2">
                            <textarea
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                                placeholder="댓글을 작성하세요..."
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                disabled={loading}
                            ></textarea>
                            <button
                                type="submit"
                                className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={loading || !commentInput.trim()}
                            >
                                {loading ? '처리 중...' : '댓글 작성'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 알림 모달 */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={alertModal.closeModal}
                title={alertModal.modalProps.title || '알림'}
                message={alertModal.modalProps.message}
                confirmText="확인"
                type={alertModal.modalProps.type || 'info'}
            />

            {/* 확인 모달 */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.closeModal}
                onConfirm={confirmModal.modalProps.onConfirm}
                title={confirmModal.modalProps.title || '확인'}
                message={confirmModal.modalProps.message}
                confirmText={confirmModal.modalProps.confirmText || '확인'}
                cancelText={confirmModal.modalProps.cancelText || '취소'}
            />
        </div>
    );
};

export default ReviewDetail;