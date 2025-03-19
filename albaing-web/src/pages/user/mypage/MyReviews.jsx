import React, { useEffect, useState } from "react";
import apiReviewService from "../../../service/apiReviewService";
import {Link, useParams} from "react-router-dom";
import Pagination from '../../../components/common/Pagination';

const MyReviews = () => {
    const { userId} = useParams();
    const [reviews, setReviews] = useState([]);
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    const handleDeleteReview = (reviewId) => {
        const updatedReviews = reviews.filter(review => review.reviewId !== reviewId);
        setReviews(updatedReviews);

        apiReviewService.removeReview(reviewId, userId)
            .catch(error => {
                console.error("리뷰 삭제 실패", error);
                setReviews(reviews);
            });
    };

    const handleDeleteComment = (commentId) => {
        const updatedComments = comments.filter(comment => comment.commentId !== commentId);
        setComments(updatedComments);

        apiReviewService.removeComment(commentId, userId)
            .catch(error => {
                console.error("댓글 삭제 실패", error);
                setComments(comments);
            });
    };

    // 댓글의 reviewId를 통해 리뷰 제목을 찾는 함수
    const getReviewTitleById = (reviewId) => {
        const review = reviews.find(r => r.reviewId === reviewId);
        return review ? review.reviewTitle : "리뷰 제목 없음";
    };

    // 댓글에 해당하는 회사 ID를 찾는 함수
    const getCompanyIdByReviewId = (reviewId) => {
        const review = reviews.find(r => r.reviewId === reviewId);
        return review ? review.companyId : null;
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // 최신순으로 정렬 (날짜 기준 내림차순)
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.reviewCreatedAt) - new Date(a.reviewCreatedAt));
    const sortedComments = [...comments].sort((a, b) => new Date(b.commentCreatedAt) - new Date(a.commentCreatedAt));

    // 페이지네이션 적용 목록
    const currentReviews = sortedReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const currentComments = sortedComments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <h2>내가 작성한 리뷰</h2>
            {currentReviews.length > 0 ? (
                <ul>
                    {currentReviews.map((review) => (
                        <li key={review.reviewId}>
                            <h3>
                                <Link to={`/companies/${review.companyId}/reviews/${review.reviewId}`}>
                                    {review.reviewTitle}
                                </Link>
                            </h3>
                            <p>작성일: {formatDate(review.reviewCreatedAt)}</p>
                            <button onClick={() => handleDeleteReview(review.reviewId)}>삭제</button>
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

            <h2>내가 작성한 댓글</h2>
            {currentComments.length > 0 ? (
                <ul>
                    {currentComments.map((comment) => {
                        const companyId = getCompanyIdByReviewId(comment.reviewId);
                        return (
                            <li key={comment.commentId}>
                                <h3>
                                    <Link to={`/companies/${companyId}/reviews/${comment.reviewId}`}>
                                        {getReviewTitleById(comment.reviewId)}
                                    </Link>
                                </h3>
                                <p>작성일: {formatDate(comment.commentCreatedAt)}</p>
                                <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
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
