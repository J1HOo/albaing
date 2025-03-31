package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.service.AdminServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminServiceImpl adminService;

    // 개인 검색
    @GetMapping("/users")
    public List<AdminUser> adminSearchUsers(@RequestParam(required = false) String userName,
                                            @RequestParam(required = false) String userEmail,
                                            @RequestParam(required = false) String userPhone,
                                            @RequestParam(required = false) String sortOrderBy,
                                            @RequestParam(required = false) Boolean isDESC) {
        if (Objects.equals(sortOrderBy, "") || sortOrderBy == null) {
            sortOrderBy = "이름";
        }

        return adminService.adminSearchUsers(userName, userEmail, userPhone, sortOrderBy, isDESC);
    }

    // 이력서 검색
    @GetMapping("/resumes")
    public List<ViewResume> adminSearchResumes(@RequestParam(required = false) String userName,
                                               @RequestParam(required = false) String resumeTitle,
                                               @RequestParam(required = false) String resumeCategory,
                                               @RequestParam(required = false) String resumeJobType,
                                               @RequestParam(defaultValue = "이름") String sortOrderBy,
                                               @RequestParam(required = false) Boolean isDESC) {

        return adminService.adminSearchResumes(userName, resumeTitle, resumeCategory, resumeJobType, sortOrderBy, isDESC);
    }

    // 공고지원 검색
    @GetMapping("/job-applications")
    public List<ViewJobApplication> adminSearchJobApplications(@RequestParam(required = false) String userName,
                                                               @RequestParam(required = false) String companyName,
                                                               @RequestParam(required = false) String jobPostTitle,
                                                               @RequestParam(defaultValue = "지원자명") String sortOrderBy,
                                                               @RequestParam(required = false) Boolean isDESC) {

        return adminService.adminSearchJobApplications(userName, companyName, jobPostTitle, sortOrderBy, isDESC);
    }

    // 법인 검색
    @GetMapping("/companies")
    public List<Company> adminSearchCompanies(@RequestParam(required = false) String companyName,
                                              @RequestParam(required = false) String companyOwnerName,
                                              @RequestParam(required = false) String companyPhone,
                                              @RequestParam(required = false) String companyRegistrationNumber,
                                              @RequestParam(defaultValue = "법인명") String sortOrderBy,
                                              @RequestParam(required = false) Boolean isDESC) {

        return adminService.adminSearchCompanies(companyName, companyOwnerName, companyPhone, companyRegistrationNumber, sortOrderBy, isDESC);
    }

    // 공고 검색
    @GetMapping("/job-posts")
    public List<ViewJobPost> adminSearchJobPosts(@RequestParam(required = false) String companyName,
                                                 @RequestParam(required = false) String jobPostTitle,
                                                 @RequestParam(required = false) String jobPostStatus,
                                                 @RequestParam(defaultValue = "공고 제목") String sortOrderBy,
                                                 @RequestParam(required = false) Boolean isDESC) {

        return adminService.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC);
    }

    // 공지 검색
    @GetMapping("/notices")
    public List<Notice> adminSearchNotices() {
        return adminService.adminSearchNotices();
    }

    // 작성글 검색
    @GetMapping("/review")
    public List<ViewReview> adminSearchReviews(@RequestParam(required = false) String reviewTitle,
                                               @RequestParam(required = false) String userName,
                                               @RequestParam(required = false) String companyName,
                                               @RequestParam(defaultValue = "작성일") String sortOrderBy,
                                               @RequestParam(required = false) Boolean isDESC) {
        return adminService.adminSearchReviews(reviewTitle, userName, companyName, sortOrderBy, isDESC);
    }

    // 댓글 검색
    @GetMapping("/comments")
    public List<ViewComment> adminSearchComments(@RequestParam(required = false) String reviewTitle,
                                                 @RequestParam(required = false) String commentContent,
                                                 @RequestParam(required = false) String userName,
                                                 @RequestParam(defaultValue = "작성일") String sortOrderBy,
                                                 @RequestParam(required = false) Boolean isDESC) {
        return adminService.adminSearchComments(reviewTitle, commentContent, userName, sortOrderBy, isDESC);
    }

    // 개인 상세 조회
    @GetMapping("/users/{userId}")
    public User adminUserDetail(@PathVariable String userId) {
        return adminService.adminUserDetail(userId);
    }

    // 개인 유저 삭제 + 이력서 삭제
    @DeleteMapping("/users/{userId}")
    public void adminUserDelete(@PathVariable String userId) {
        adminService.adminUserDelete(userId);
        adminService.adminResumeDelete(userId);
    }

    // 이력서 상세 조회
    @GetMapping("/resumes/{resumeId}")
    public Resume adminResumeDetail(@PathVariable String resumeId) {
        return adminService.adminResumeDetail(resumeId);
    }

    // 회사 상세 조회
    @GetMapping("/companies/{companyId}")
    public Company adminCompanyDetail(@PathVariable String companyId) {
        return adminService.adminCompanyDetail(companyId);
    }

    // 회사 유저 삭제 + 공고 상태 전환
    @DeleteMapping("/companies/{companyId}")
    public void adminCompanyDelete(@PathVariable String companyId) {
        adminService.adminCompanyDelete(companyId);
        // 공고 상태 비공개로 전환
        adminService.adminJobPostStatusChange(companyId);
    }

    // 공고 상세 조회
    @GetMapping("/job-posts/{jobPostId}")
    public JobPost adminJobPostDetail(@PathVariable String jobPostId) {
        return adminService.adminJobPostDetail(jobPostId);
    }

    // 공고 삭제
    @DeleteMapping("/job-posts/{jobPostId}")
    public void adminJobPostDelete(@PathVariable String jobPostId) {
        adminService.adminJobPostDelete(jobPostId);
    }

    // 공지 상세 조회
    @GetMapping("/notices/{noticeId}")
    public Notice adminNoticeDetail(@PathVariable String noticeId) {
        return adminService.adminNoticeDetail(noticeId);
    }

    // 공지 삭제
    @DeleteMapping("/notices/{noticeId}")
    public void adminNoticeDelete(@PathVariable String noticeId) {
        adminService.adminNoticeDelete(noticeId);
    }

    @GetMapping("/review/{reviewId}")
    public ViewReview adminReviewDetail(@PathVariable String reviewId) {
        return adminService.adminReviewDetail(reviewId);
    }

    @DeleteMapping("/review/{reviewId}")
    public void adminReviewDelete(@PathVariable String reviewId) {
        adminService.adminReviewDelete(reviewId);
    }

    @DeleteMapping("/comment/{commentId}")
    public void adminCommentDelete(@PathVariable String commentId) {
        adminService.adminCommentDelete(commentId);
    }


}
