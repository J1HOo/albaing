package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Review;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper

public interface ReviewMapper {

    //특정 회사 전체 리뷰 보여주기
    List<Review> showReviews(long companyId);

    // 리뷰에 속한 댓글 목록 조회
    List<Comment> getCommentsByReviewId(long reviewId);

    //회사 리뷰 등록
    void addReview(Review review);

    //회사 리뷰 조회
    Review reviewCheck(long reviewId);

    //회사 리뷰 수정
    void updateReview(Review review);

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
    int updateReviewByAdmin(Review review);

    // 어드민 리뷰 삭제
    void deleteReviewByAdmin(long reviewId);

    // 어드민 댓글 삭제
    void deleteCommentByAdmin(long commentId);

    // 자회사 리뷰 가져오기
    Review getReviewById(long reviewId);

    // 자회사 리뷰 삭제
    int deleteReviewByCompany(long reviewId, long companyId);

    // 자회사 댓글 삭제
    Integer checkCommentBelongsToCompany(Map<String, Object> params);

    int deleteCommentByCompany(Map<String, Object> params);

    List<Review> getReviewsByUser(long userId);

    List<Comment> getCommentsByUser(long userId);

    void deleteReviewByUser(long reviewId, long userId);

    void deleteCommentByUser(long commentId, long userId);
}
