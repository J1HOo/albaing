import {useState} from "react";
import Pagination from "./Pagination";
import ReviewModal from "./ReviewModal";

const ReviewList = ({reviews, currentPage, setCurrentPage, itemsPerPage}) => {
    const [showReviewModal, setShowReviewModal] = useState(false); // 모달 상태 추가
    console.log("reviews.length = ",reviews.length);
    const currentReviews = reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">기업 리뷰</h2>
                <button
                    onClick={() => setShowReviewModal(true)} // 모달 열기
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                    리뷰 작성하기
                </button>
            </div>

            {currentReviews.length ? (
                currentReviews.map(
                    (review) => (
                        <div key={review.reviewId} className="border p-4 mt-4 rounded-md">
                            <p className="text-gray-900">{review.reviewTitle}</p>
                        </div>
                    )
                )
            ) : (
                <div className="text-gray-500 mt-4">
                    등록된 리뷰가 없습니다.
                </div>
            )}

            {/* 페이지네이션 */}
            <Pagination totalItems={reviews.length}   // sql 에서 가져온 총 데이터 개수
                        itemsPerPage={itemsPerPage}     // 페이지 별로 보여줄 데이터 개수
                        currentPage={currentPage}        // 현재 페이지
                        setCurrentPage={setCurrentPage}  // 사용자가 클릭하여 변경될 현재 페이지
            />

            {/* 리뷰 작성 모달 */}
            {showReviewModal && (
                <ReviewModal
                    companyId={reviews.companyId}
                    onClose={() => setShowReviewModal(false)}
                    onSubmit={() => setShowReviewModal(false)} // 작성 후 모달 닫기
                />
            )}
        </div>
    );
};

export default ReviewList;
