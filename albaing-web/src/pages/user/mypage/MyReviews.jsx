import React, { useEffect, useState } from "react";
import apiReviewService from "../../../service/apiReviewService";
import { Link, useParams } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import { FaTrashAlt, FaCheckSquare, FaSquare } from "react-icons/fa"; // FontAwesome 아이콘

const MyReviews = () => {
    const { userId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 선택된 리뷰 및 댓글을 관리하는 배열
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        if (!userId) {
            return;
        }
        apiReviewService.getReviewsByUser(userId, (data) => {
            setReviews(data);
            apiReviewService.getCommentsByUser(userId, (data) => {
                setComments(data);
            });
        });
    }, [userId]);

    // 리뷰 및 댓글 선택 처리
    const handleSelectItem = (itemId, type) => {
        // 이미 선택된 경우 제거, 아니면 추가
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.some(item => item.id === itemId && item.type === type)) {
                return prevSelectedItems.filter(item => item.id !== itemId || item.type !== type);
            } else {
                return [...prevSelectedItems, { id: itemId, type }];
            }
        });
    };

    // 선택된 리뷰와 댓글 삭제
    const handleDeleteSelectedItems = () => {
        selectedItems.forEach(item => {
            if (item.type === "review") {
                // 리뷰 삭제
                apiReviewService.removeReview(item.id, userId)
                    .catch((error) => {
                        console.error("리뷰 삭제 실패", error);
                    });
            } else if (item.type === "comment") {
                // 댓글 삭제
                apiReviewService.removeComment(item.id, userId)
                    .catch((error) => {
                        console.error("댓글 삭제 실패", error);
                    });
            }
        });

        // 삭제 후 선택된 항목 초기화
        setSelectedItems([]);

        // 리뷰와 댓글 목록 업데이트 (삭제된 항목 제거)
        const remainingReviews = reviews.filter((review) =>
            !selectedItems.some(item => item.id === review.reviewId && item.type === "review")
        );
        setReviews(remainingReviews);

        const remainingComments = comments.filter((comment) =>
            !selectedItems.some(item => item.id === comment.commentId && item.type === "comment")
        );
        setComments(remainingComments);
    };

    // 리뷰 제목을 가져오는 함수
    const getReviewTitleById = (reviewId) => {
        const review = reviews.find((r) => r.reviewId === reviewId);
        return review ? review.reviewTitle : "리뷰 제목 없음";
    };

    // 회사 ID를 가져오는 함수
    const getCompanyIdByReviewId = (reviewId) => {
        const review = reviews.find((r) => r.reviewId === reviewId);
        return review ? review.companyId : null;
    };

    // 댓글 수를 계산하는 함수
    const getCommentCountByReviewId = (reviewId) => {
        return comments.filter(comment => comment.reviewId === reviewId).length;
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // 최신순으로 정렬 (날짜 기준 내림차순)
    const sortedReviews = [...reviews].sort(
        (a, b) => new Date(b.reviewCreatedAt) - new Date(a.reviewCreatedAt)
    );
    const sortedComments = [...comments].sort(
        (a, b) => new Date(b.commentCreatedAt) - new Date(a.commentCreatedAt)
    );

    // 페이지네이션 적용 목록
    const currentReviews = sortedReviews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const currentComments = sortedComments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* 내가 작성한 리뷰 헤더 */}
            <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
                내가 작성한 리뷰
                {selectedItems.length > 0 && (
                    <button
                        onClick={handleDeleteSelectedItems}
                        className="text-red-600 hover:text-red-800 flex items-center"
                    >
                        <FaTrashAlt className="mr-2" />
                    </button>
                )}
            </h2>

            {/* 리뷰 목록 */}
            {currentReviews.length > 0 ? (
                <ul className="space-y-4">
                    {currentReviews.map((review) => (
                        <li key={review.reviewId} className="border-b pb-4 flex items-center">
                            <div
                                className="w-6 h-6 border-2 border-gray-500 cursor-pointer mr-4 flex items-center justify-center"
                                onClick={() => handleSelectItem(review.reviewId, "review")}
                            >
                                {selectedItems.some(item => item.id === review.reviewId && item.type === "review") ? (
                                    <FaCheckSquare className="text-blue-600"/>
                                ) : (
                                    <FaSquare className="text-gray-500"/>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-semibold mb-2">
                                    <Link
                                        to={`/companies/${review.companyId}/reviews/${review.reviewId}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        {review.reviewTitle}
                                    </Link>
                                    <span className="ml-2 text-gray-500">
                                        ({getCommentCountByReviewId(review.reviewId)}개 댓글) {/* 댓글 수 표시 */}
                                    </span>
                                </h3>
                                <p className="text-gray-500">
                                    작성일: {formatDate(review.reviewCreatedAt)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>작성한 리뷰가 없습니다.</p>
            )}

            {/* 리뷰 페이지네이션 */}
            <Pagination
                totalItems={reviews.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            {/* 내가 작성한 댓글 헤더 */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">내가 작성한 댓글</h2>

            {/* 댓글 목록 */}
            {currentComments.length > 0 ? (
                <ul className="space-y-4">
                    {currentComments.map((comment) => {
                        const companyId = getCompanyIdByReviewId(comment.reviewId);
                        return (
                            <li key={comment.commentId} className="border-b pb-4 flex items-center">
                                <div
                                    className="w-6 h-6 border-2 border-gray-500 cursor-pointer mr-4 flex items-center justify-center"
                                    onClick={() => handleSelectItem(comment.commentId, "comment")}
                                >
                                    {selectedItems.some(item => item.id === comment.commentId && item.type === "comment") ? (
                                        <FaCheckSquare className="text-blue-600"/>
                                    ) : (
                                        <FaSquare className="text-gray-500"/>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-semibold mb-2">
                                        <Link
                                            to={`/companies/${companyId}/reviews/${comment.reviewId}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {getReviewTitleById(comment.reviewId)}
                                        </Link>
                                    </h3>
                                    <p className="text-gray-500">
                                        작성일: {formatDate(comment.commentCreatedAt)}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>작성한 댓글이 없습니다.</p>
            )}

            {/* 댓글 페이지네이션 */}
            <Pagination
                totalItems={comments.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default MyReviews;
