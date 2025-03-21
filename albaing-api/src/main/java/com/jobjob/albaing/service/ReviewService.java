package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Review;

import java.util.List;
import java.util.Map;

public interface ReviewService {

    //특정 회사 전체 리뷰 보여주기
    List<Review> showReviews(long companyId);

    //회사 리뷰 등록
    void addReview(Review review);

    //회사 리뷰 조회
    Review reviewCheck(long reviewId);

    //회사 리뷰 수정
    void updateReview(Review review);

    // 리뷰에 속한 댓글 목록 조회
    List<Comment> getCommentsByReviewId(long reviewId);

    //회사 리뷰 삭제
    void deleteReview(long reviewId, long userId);

    //리뷰 댓글 등록
    void addComment(Comment comment);

    //리뷰 댓글 수정
    void updateComment(Comment comment);

    //리뷰 댓글 삭제
    void deleteComment(long commentId, long userId);


    // 어드민 회사 전체 리스트
    List<Map<String, Object>> getAllReviewsForAdmin();

    // 어드민 리뷰 수정
    boolean updateReviewByAdmin(Review review);

    // 어드민 리뷰 삭제
    void deleteReviewByAdmin(long reviewId);

    // 어드민 댓글 삭제
    void deleteCommentByAdmin(long commentId);

    // 회사 기능
    boolean deleteReviewByCompany(long reviewId, long companyId);
    boolean deleteCommentByCompany(long commentId, long reviewId, long companyId);

    // 내가 작성한 리뷰 목록 조회
    List<Review> getReviewsByUser(long userId);

    // 내가 작성한 댓글 목록 조회
    List<Comment> getCommentsByUser(long userId);

    // 내가 작성한 리뷰 삭제
    void deleteReviewByUser(long reviewId, long userId);

    // 내가 작성한 댓글 삭제
    void deleteCommentByUser(long commentId, long userId);

    // 특정 리뷰글의 댓글 수
    Long getCommentsByReview(long reviewId);

}