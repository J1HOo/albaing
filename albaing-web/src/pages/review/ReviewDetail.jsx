import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {ErrorMessage, LoadingSpinner} from "../../components/common";
import AlertModal from "../../../../albaing-web/src/components/modals/AlertModal";

const ReviewDetail = () => {
    const {companyId, reviewId} = useParams();
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertModal, setAlertModal] = useState(null);

    // 조회한 리뷰 내용 불러오기
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/companies/${companyId}/reviews/${reviewId}`)
            .then((res) => {
                // 응답 데이터 확인 및 처리
                console.log("리뷰 조회 응답:", res.data);

                // 리뷰 데이터 설정
                const reviewData = {
                    reviewId: res.data.reviewId,
                    userId: res.data.userId,
                    companyId: res.data.companyId || companyId, // companyId가 null이면 URL의 companyId 사용
                    reviewTitle: res.data.reviewTitle,
                    reviewContent: res.data.reviewContent,
                    reviewCreatedAt: res.data.reviewCreatedAt,
                    reviewUpdatedAt: res.data.reviewUpdatedAt
                };

                setReview(reviewData);

                // 댓글 설정
                if (Array.isArray(res.data.comments)) {
                    setComments(res.data.comments);
                } else {
                    setComments([]);
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error("리뷰 데이터를 가져오는 중 오류 발생:", err);
                setError("리뷰를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [reviewId, companyId]);

    // 댓글 작성
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentInput.trim()) return;

        try {
            // 요청 데이터 로깅
            console.log("댓글 작성 요청 데이터:", {
                reviewId: parseInt(reviewId),
                commentContent: commentInput
            });

            // 댓글 작성 API 호출
            await axios.post(`/api/companies/${companyId}/reviews/${reviewId}/comments`, {
                reviewId: parseInt(reviewId),
                commentContent: commentInput
            }, {
                withCredentials: true
            });

            // 성공 메시지 표시
            console.log("댓글이 성공적으로 작성되었습니다.");

            // 댓글 작성 후 리뷰 데이터 다시 불러오기
            const res = await axios.get(`/api/companies/${companyId}/reviews/${reviewId}`);

            // 응답 데이터 확인
            console.log("리뷰 데이터 새로 불러옴:", res.data);

            // 리뷰 데이터 설정
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

            // 댓글 설정
            if (Array.isArray(res.data.comments)) {
                setComments(res.data.comments);
            } else {
                // 새로운 댓글이 있을 경우, 현재 댓글 목록에 추가
                const newComment = {
                    commentId: Date.now(), // 임시 ID
                    commentContent: commentInput,
                    commentCreatedAt: new Date().toISOString()
                };

                setComments(prevComments => [...prevComments, newComment]);
            }

            // 입력 필드 초기화
            setCommentInput("");
        } catch (error) {
            console.error("댓글 작성 중 오류 발생:", error);
            console.error("오류 응답:", error.response);

            if (error.response?.status === 401) {
                setAlertModal({ message: "댓글을 작성하려면 로그인이 필요합니다."});
            } else {
                setAlertModal({ message:"댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요."});
            }
        }
    };

    if (loading) return <LoadingSpinner message="로딩 중..." />
    if (error) return <ErrorMessage message={error} />
    if (!review) return <div className="text-center py-10">리뷰를 찾을 수 없습니다.</div>


    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* 리뷰 헤더 */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">{review.reviewTitle}</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        작성일: {new Date(review.reviewCreatedAt).toLocaleString()}
                    </p>
                </div>

                {/* 리뷰 내용 */}
                <div className="p-6 border-b border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">{review.reviewContent}</p>
                </div>

                {/* 댓글 섹션 */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">댓글 ({comments.length})</h2>

                    {/* 댓글 목록 */}
                    {comments.length > 0 ? (
                        <ul className="space-y-4 mb-6">
                            {comments.map((comment) => (
                                <li key={comment.commentId} className="bg-gray-50 p-4 rounded">
                                    <p className="text-sm text-gray-500">
                                        {new Date(comment.commentCreatedAt).toLocaleString()}
                                    </p>
                                    <p className="mt-2 text-gray-700">{comment.commentContent}</p>
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
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                rows="3"
                                placeholder="댓글을 작성하세요..."
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                            ></textarea>
                            <button
                                type="submit"
                                className="self-end px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                            >
                                댓글 작성
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {alertModal && (
                <AlertModal
                    message={alertModal.message}
                    onClose={() => {
                        if (alertModal.onClose) {
                            alertModal.onClose();
                        } else {
                            setAlertModal(null);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default ReviewDetail;