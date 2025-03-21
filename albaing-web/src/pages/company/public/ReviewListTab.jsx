import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/common/Pagination';
import ReviewModal from '../../../components/modals/ReviewModal';
import { formatDate } from '../../../utils/dateUtils';
import apiReviewService from '../../../service/apiReviewService';

const ReviewListTab = ({ reviews, companyId, onReviewAdded }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [commentCounts, setCommentCounts] = useState({});  // 댓글 수 상태
    const itemsPerPage = 5;
    const navigate = useNavigate();

    // 현재 페이지에 보여줄 리뷰 목록
    const currentReviews = reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // 새로운 데이터가 로드될 때 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [reviews]);

    // 리뷰 목록이 변경될 때마다 댓글 수를 가져옴
    useEffect(() => {
        const fetchCommentCounts = async () => {
            const counts = {};
            for (const review of reviews) {
                try {
                    const count = await apiReviewService.getCommentCountByReviewId(review.reviewId);
                    counts[review.reviewId] = count;  // 댓글 수 설정
                } catch (error) {
                    counts[review.reviewId] = 0;  // 오류가 발생하면 기본값 0
                }
            }
            setCommentCounts(counts);  // 댓글 수 상태 업데이트
        };

        if (reviews.length > 0) {
            fetchCommentCounts();
        }
    }, [reviews]);  // 리뷰 목록이 바뀔 때마다 댓글 수를 가져옴

    // 리뷰 상세 페이지로 이동
    const navigateToReviewDetail = (reviewId) => {
        navigate(`/companies/${companyId}/reviews/${reviewId}`);
    };

    // 리뷰 작성 모달 열기
    const handleOpenReviewModal = () => {
        setShowReviewModal(true);
    };

    // 리뷰 작성 후 처리
    const handleReviewAdded = (newReview) => {
        // 리뷰 작성 후 부모 컴포넌트에서 상태 갱신하도록 호출
        onReviewAdded(newReview);
        setShowReviewModal(false); // 모달 닫기
    };

    // 리뷰 작성 완료 후 처리
    const handleReviewSubmit = (reviewData) => {
        // 리뷰 작성 후 리뷰 목록 갱신
        handleReviewAdded(reviewData);
    };

    // 리뷰 목록이 비어있지 않으면 렌더링
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">아직 등록된 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">기업 리뷰</h2>
                <button
                    onClick={handleOpenReviewModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                    리뷰 작성하기
                </button>
            </div>

            <div className="space-y-6">
                {currentReviews.map((review) => (
                    <div
                        key={review.reviewId}
                        onClick={() => navigateToReviewDetail(review.reviewId)}
                        className="border-b border-gray-200 pb-6 last:border-b-0 cursor-pointer hover:bg-gray-50 p-4 rounded-md transition-colors"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {review.reviewTitle}
                                    <span className="ml-2 text-blue-500">
                                        ({commentCounts[review.reviewId] || 0})  {/* 댓글 수 표시 */}
                                    </span>
                                </h3>
                            </div>
                            <span className="text-sm text-gray-500">
                                {formatDate(review.reviewCreatedAt)}
                            </span>
                        </div>
                        <p className="text-gray-700 line-clamp-3">{review.reviewContent}</p>
                        <p className="text-sm text-blue-600 mt-2">자세히 보기 &rarr;</p>
                    </div>
                ))}
                <Pagination
                    totalItems={reviews.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            {/* 리뷰 작성 모달 */}
            {showReviewModal && (
                <ReviewModal
                    companyId={companyId}
                    onClose={() => setShowReviewModal(false)}  // 모달 닫을 때
                    onSubmit={handleReviewSubmit}  // 리뷰 제출 처리
                />
            )}
        </div>
    );
};

export default ReviewListTab;