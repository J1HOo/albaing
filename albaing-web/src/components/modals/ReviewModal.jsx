import { useState } from "react";
import axios from "axios";

const ReviewModal = ({ companyId, onClose, onSubmit, onCommentAdded }) => {
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewContent, setReviewContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
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

        axios
            .post(
                `/api/companies/${companyId}/reviews`,
                {
                    companyId: parseInt(companyId, 10),
                    reviewTitle,
                    reviewContent
                },
                { withCredentials: true }
            )
            .then((response) => {
                if (typeof onSubmit === "function") {
                    onSubmit(response.data);
                }
                if (typeof onCommentAdded === "function") {
                    onCommentAdded(); // 댓글 수 증가 처리
                }
                onClose();
            })
            .catch((err) => {
                console.error("리뷰 작성 오류:", err);
                console.error("오류 응답:", err.response);
                if (err.response?.status === 401) {
                    setError("리뷰를 작성하려면 로그인이 필요합니다.");
                } else {
                    setError(err.response?.data?.message || "리뷰 작성 중 오류가 발생했습니다.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">기업 리뷰 작성</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        ✖
                    </button>
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
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                            {loading ? "제출 중..." : "리뷰 등록"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
