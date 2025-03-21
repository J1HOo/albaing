import { useState } from "react";
import axios from "axios";

const ReviewModal = ({ companyId, onClose, onSubmit, onCommentAdded }) => {
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewContent, setReviewContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reviewTitle.trim()) {
            setError("제목을 입력해주세요.");
            return;
        }
        if (!reviewContent.trim()) {
            setError("내용을 입력해주세요.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`/api/companies/${companyId}/reviews`, {
                companyId: parseInt(companyId),
                reviewTitle,
                reviewContent
            }, {
                withCredentials: true
            });

            const reviewId = response.data.reviewId;
            const newReview = response.data

            if (typeof onSubmit === 'function') {
                await onSubmit(newReview); // 부모 컴포넌트의 상태 갱신 함수 호출
            }

            if (typeof onSubmit === 'function') {
                await onSubmit({
                    companyId: parseInt(companyId),
                    reviewTitle,
                    reviewContent,
                    reviewId
                });
            }

            if (onCommentAdded) {
                onCommentAdded(); // 댓글 수 증가 처리
            }

            onClose(); // 모달 닫기
        } catch (err) {
            if (err.response?.status === 401) {
                setError("리뷰를 작성하려면 로그인이 필요합니다.");
            } else {
                setError(err.response?.data?.message || "리뷰 작성 중 오류가 발생했습니다.");
            }
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">기업 리뷰 작성</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">✖</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="리뷰 제목을 입력하세요"
                        className="w-full p-2 border rounded-md mb-4"
                        required
                    />

                    <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        rows={6}
                        placeholder="리뷰 내용을 입력하세요"
                        className="w-full p-2 border rounded-md"
                        required
                    />

                    <div className="flex justify-end mt-4 space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">취소</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            {loading ? "제출 중..." : "리뷰 등록"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
