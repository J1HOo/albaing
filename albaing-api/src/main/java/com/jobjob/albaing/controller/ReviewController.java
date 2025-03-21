package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.Review;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.ReviewServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewServiceImpl reviewService;

    // 특정 회사 전체 리뷰 보여주기
    @GetMapping("/companies/{companyId}/reviews")
    public ResponseEntity<List<Review>> showReviews(@PathVariable("companyId") long companyId) {
        List<Review> reviews = reviewService.showReviews(companyId);
        return ResponseEntity.ok(reviews);
    }

    // 리뷰 등록 (일반 사용자)
    @PostMapping("/companies/{companyId}/reviews")
    public ResponseEntity<?> addReview(
        @PathVariable("companyId") long companyId,
        @RequestBody Review review,
        HttpSession session
    ) {
        User user = (User) session.getAttribute("userSession");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }

        review.setCompanyId(companyId);
        review.setUserId(user.getUserId());
        reviewService.addReview(review);
        return ResponseEntity.ok(Map.of("reviewId", review.getReviewId()));
    }

    // 리뷰 조회
    @GetMapping("/companies/{companyId}/reviews/{reviewId}")
    public ResponseEntity<?> reviewCheck(
        @PathVariable("companyId") long companyId,
        @PathVariable("reviewId") long reviewId
    ) {
        try {
            Review review = reviewService.reviewCheck(reviewId);
            if (review == null) {
                return ResponseEntity.notFound().build();
            }

            // companyId가 null이면 pathVariable의 companyId 값을 설정
            if (review.getCompanyId() == null) {
                review.setCompanyId(companyId);
            }

            // 댓글 목록도 함께 조회
            List<Comment> comments = reviewService.getCommentsByReviewId(reviewId);

            // 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("reviewId", review.getReviewId());
            response.put("userId", review.getUserId());
            response.put("companyId", review.getCompanyId());
            response.put("reviewTitle", review.getReviewTitle());
            response.put("reviewContent", review.getReviewContent());
            response.put("reviewCreatedAt", review.getReviewCreatedAt());
            response.put("reviewUpdatedAt", review.getReviewUpdatedAt());
            response.put("comments", comments);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "리뷰 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    //리뷰 수정
    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable long reviewId,
            @RequestBody Review review,
            HttpSession session
    ) {
        User user = (User) session.getAttribute("userSession");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }

        review.setReviewId(reviewId);
        reviewService.updateReview(review);

        return ResponseEntity.ok().build();
    }

    // 댓글 등록
    @PostMapping("/companies/{companyId}/reviews/{reviewId}/comments")
    public ResponseEntity<?> addComment(
        @PathVariable("reviewId") long reviewId,
        @RequestBody Comment comment,
        HttpSession session
    ) {
        User user = (User) session.getAttribute("userSession");
        Company company = (Company) session.getAttribute("companySession");

        if (user == null && company == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }

        comment.setReviewId(reviewId);

        // 사용자 또는 회사 계정으로 댓글 작성
        if (user != null) {
            comment.setUserId(user.getUserId());
        } else {
            comment.setUserId(company.getCompanyId());
        }

        reviewService.addComment(comment);
        return ResponseEntity.ok().build();
    }

    // 리뷰 삭제 (일반 사용자)
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable("reviewId") long reviewId,
            HttpSession session
    ) {
        User user = (User) session.getAttribute("userSession");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }

        reviewService.deleteReview(reviewId, user.getUserId());
        return ResponseEntity.ok().build();
    }

    // 리뷰 댓글 수정(일반 사용자)
    @PutMapping("/reviews/{reviewId}/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable long commentId,
            @RequestBody Comment comment,
            HttpSession session
    ) {
        User user = (User) session.getAttribute("userSession");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }

        comment.setCommentId(commentId);
        reviewService.updateComment(comment);
        return ResponseEntity.ok().build();
    }

    // 댓글 삭제 (일반 사용자)
    @DeleteMapping("/reviews/{reviewId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
        @PathVariable("commentId") long commentId,
        HttpSession session
    ) {
        User user = (User) session.getAttribute("userSession");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }

        reviewService.deleteComment(commentId, user.getUserId());
        return ResponseEntity.ok().build();
    }

    // 어드민 - 모든 리뷰 조회
    @GetMapping("/admin/reviews")
    public ResponseEntity<?> getAllReviewsForAdmin(HttpSession session) {
        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<Map<String, Object>> reviews = reviewService.getAllReviewsForAdmin();
        return ResponseEntity.ok(reviews);
    }

    // 어드민 - 리뷰 추가
    @PostMapping("/admin/reviews")
    public ResponseEntity<?> addReviewByAdmin(
        @RequestBody Review review,
        HttpSession session
    ) {
        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        reviewService.addReview(review);
        return ResponseEntity.ok().build();
    }

    // 어드민 - 리뷰 수정
    @PutMapping("/admin/reviews/{reviewId}")
    public ResponseEntity<?> updateReviewByAdmin(
        @PathVariable long reviewId,
        @RequestBody Review review,
        HttpSession session
    ) {
        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        review.setReviewId(reviewId);
        boolean success = reviewService.updateReviewByAdmin(review);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "리뷰가 존재하지 않습니다."));
        }
    }

    // 어드민 - 리뷰 삭제
    @DeleteMapping("/admin/reviews/{reviewId}")
    public ResponseEntity<?> deleteReviewByAdmin(
        @PathVariable long reviewId,
        HttpSession session
    ) {
        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        reviewService.deleteReviewByAdmin(reviewId);
        return ResponseEntity.ok().build();
    }

    // 어드민 - 댓글 추가
    @PostMapping("/admin/reviews/{reviewId}/comments")
    public ResponseEntity<?> addCommentByAdmin(
        @PathVariable long reviewId,
        @RequestBody Comment comment,
        HttpSession session
    ) {
        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        comment.setReviewId(reviewId);
        comment.setUserId(user.getUserId());
        reviewService.addComment(comment);
        return ResponseEntity.ok().build();
    }

    // 어드민 - 댓글 삭제
    @DeleteMapping("/admin/reviews/{reviewId}/comments/{commentId}")
    public ResponseEntity<?> deleteCommentByAdmin(
        @PathVariable long reviewId,
        @PathVariable long commentId,
        HttpSession session
    ) {
        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        reviewService.deleteCommentByAdmin(commentId);
        return ResponseEntity.ok().build();
    }

    // 회사 - 자사 리뷰 목록 조회
    @GetMapping("/companies/{companyId}/my-reviews")
    public ResponseEntity<?> getCompanyReviews(
        @PathVariable long companyId,
        HttpSession session
    ) {
        Company company = (Company) session.getAttribute("companySession");
        if (company == null || !company.getCompanyId().equals(companyId)) {
            return ResponseEntity.status(403).body(Map.of("message", "권한이 없습니다."));
        }

        List<Review> reviews = reviewService.showReviews(companyId);
        return ResponseEntity.ok(reviews);
    }

    // 회사 - 리뷰 삭제
    @DeleteMapping("/companies/{companyId}/reviews/{reviewId}")
    public ResponseEntity<?> deleteReviewByCompany(
        @PathVariable long companyId,
        @PathVariable long reviewId,
        HttpSession session
    ) {
        Company company = (Company) session.getAttribute("companySession");
        if (company == null || !company.getCompanyId().equals(companyId)) {
            return ResponseEntity.status(403).body(Map.of("message", "권한이 없습니다."));
        }

        boolean success = reviewService.deleteReviewByCompany(reviewId, companyId);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "리뷰가 존재하지 않거나 삭제할 권한이 없습니다."));
        }
    }

    // 회사 - 댓글 삭제
    @DeleteMapping("/companies/{companyId}/reviews/{reviewId}/comments/{commentId}")
    public ResponseEntity<?> deleteCommentByCompany(
        @PathVariable long companyId,
        @PathVariable long reviewId,
        @PathVariable long commentId,
        HttpSession session
    ) {
        Company company = (Company) session.getAttribute("companySession");
        if (company == null || !company.getCompanyId().equals(companyId)) {
            return ResponseEntity.status(403).body(Map.of("message", "권한이 없습니다."));
        }

        boolean success = reviewService.deleteCommentByCompany(commentId, reviewId, companyId);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "댓글이 존재하지 않거나 삭제할 권한이 없습니다."));
        }
    }

    // 특정 리뷰에 대한 댓글 수 조회
    @GetMapping("/reviews/{reviewId}/comments/count")
    public ResponseEntity<Long> getCommentsCountByReview(@PathVariable long reviewId) {
        try {
            Long commentCount = reviewService.getCommentsByReview(reviewId);
            if (commentCount == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 리뷰가 없을 경우
            }
            return ResponseEntity.ok(commentCount);  // 댓글 수 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  // 서버 오류 처리
        }
    }
}