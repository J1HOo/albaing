package com.jobjob.albaing.controller;


import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Review;
import com.jobjob.albaing.service.ReviewServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company/detail")
public class ReviewController {

    @Autowired
    private ReviewServiceImpl reviewService;

    //전체 리뷰 보여주기
    @GetMapping("/{companyId}/review")
    public String showReviews(@PathVariable("companyId") long companyId, Model model) {
        List<Review> reviews = reviewService.showReviews(companyId);

        model.addAttribute("reviews", reviews);
        model.addAttribute("companyId", companyId);

        return "companyDetail";
    }

    //리뷰 등록
    @PostMapping("/{companyId}/review")
    public void addReview(@PathVariable long companyId, @RequestBody Review review) {
        review.setCompanyId(companyId);
        reviewService.addReview(review);
    }

    //리뷰 조회
    @GetMapping("/{companyId}/review/{reviewId}")
    public String reviewCheck(@PathVariable("reviewId") long reviewId, Model model, HttpServletRequest request) {
        Review review = reviewService.reviewCheck(reviewId);

        if (review == null) {
            return "redirect:companyDetail";
        }

        model.addAttribute("review", review);

        return "company/reviewDetail";
    }

    //댓글 등록
    @PostMapping("/{companyId}/review/{reviewId}/comment")
    public void addComment(@PathVariable long commentId, @RequestBody Comment comment) {
        comment.setCommentId(commentId);
        reviewService.addComment(comment);
    }

    //리뷰 삭제
    @DeleteMapping("/{companyId}/review/{reviewId}")
    public void deleteReview(@PathVariable long reviewId, @RequestParam long userId) {
        reviewService.deleteReview(reviewId, userId);
    }

    //댓글 삭제
    @DeleteMapping("/{companyId}/review/{reviewId}/comment/{commentId}")
    public void deleteComment(@PathVariable long commentId, @RequestParam long userId) {
        reviewService.deleteComment(commentId, userId);
    }
}