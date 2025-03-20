package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminServiceImpl adminService;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private CompanyServiceImpl companyService;

    @Autowired
    private JobPostService jobPostService;

    @Autowired
    private JobApplicationService jobApplicationService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private FileService fileService;

    // 관리자 권한 확인 메소드
    private boolean isAdmin(HttpSession session) {
        User user = (User) session.getAttribute("userSession");
        return user != null && user.getUserIsAdmin() != null && user.getUserIsAdmin();
    }

    // 대시보드 통계 API
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    //---------------------------
    // 회원 관리 API
    //---------------------------

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
        @RequestParam(required = false) String userName,
        @RequestParam(required = false) String userEmail,
        @RequestParam(required = false) String userPhone,
        @RequestParam(required = false) String sortOrderBy,
        @RequestParam(required = false) Boolean isDESC,
        @RequestParam(required = false) Integer limit,
        HttpSession session
    ) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<AdminUser> users = adminService.adminSearchUsers(userName, userEmail, userPhone, sortOrderBy, isDESC, limit);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserDetail(@PathVariable String userId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        User user = adminService.adminUserDetail(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(
        @PathVariable String userId,
        @RequestBody User user,
        HttpSession session
    ) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        try {
            user.setUserId(Long.valueOf(userId));
            adminService.adminUserUpdate(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "사용자 정보 수정 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        try {
            adminService.deleteUserWithRelatedData(userId);
            return ResponseEntity.ok(Map.of("message", "사용자 및 관련 데이터가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "사용자 삭제 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    //---------------------------
    // 이력서 관리 API
    //---------------------------

    @GetMapping("/resumes")
    public ResponseEntity<?> searchResumes(
        @RequestParam(required = false) String userName,
        @RequestParam(required = false) String resumeTitle,
        @RequestParam(required = false) String resumeJobCategory,
        @RequestParam(required = false) String resumeJobType,
        @RequestParam(defaultValue = "이름") String sortOrderBy,
        @RequestParam(required = false) Boolean isDESC,
        @RequestParam(required = false) Integer limit,
        HttpSession session
    ) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<ViewResume> resumes = adminService.adminSearchResumes(
            userName, resumeTitle, resumeJobCategory, resumeJobType, sortOrderBy, isDESC, limit);
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/resumes/{resumeId}")
    public ResponseEntity<?> getResumeDetail(@PathVariable String resumeId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        Resume resume = adminService.adminResumeDetail(resumeId);
        if (resume == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resume);
    }

    //---------------------------
    // 기업 관리 API
    //---------------------------

    @GetMapping("/companies")
    public ResponseEntity<?> getAllCompanies(
        @RequestParam(required = false) String companyName,
        @RequestParam(required = false) String companyOwnerName,
        @RequestParam(required = false) String companyPhone,
        @RequestParam(required = false) String companyRegistrationNumber,
        @RequestParam(required = false) String companyApprovalStatus,
        @RequestParam(required = false) String sortOrderBy,
        @RequestParam(required = false) Boolean isDESC,
        @RequestParam(required = false) Integer limit,
        HttpSession session
    ) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<Company> companies = adminService.adminSearchCompanies(
            companyName, companyOwnerName, companyPhone, companyRegistrationNumber,
            companyApprovalStatus, sortOrderBy, isDESC, limit);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/companies/pending")
    public ResponseEntity<?> getPendingCompanies(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<Company> pendingCompanies = companyService.getPendingCompanies();
        return ResponseEntity.ok(pendingCompanies);
    }

    @GetMapping("/companies/{companyId}")
    public ResponseEntity<?> getCompanyDetail(@PathVariable String companyId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        Company company = adminService.adminCompanyDetail(companyId);
        if (company == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(company);
    }

    @PatchMapping("/companies/{companyId}/status")
    public ResponseEntity<?> updateCompanyStatus(
        @PathVariable String companyId,
        @RequestBody Map<String, String> statusRequest,
        HttpSession session
    ) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        String approvalStatus = statusRequest.get("companyApprovalStatus");
        if (approvalStatus == null || approvalStatus.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "승인 상태가 제공되지 않았습니다."));
        }

        try {
            adminService.updateCompanyStatus(companyId, approvalStatus);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "회사 상태가 성공적으로 업데이트되었습니다."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "회사 상태 업데이트 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @DeleteMapping("/companies/{companyId}")
    public ResponseEntity<?> deleteCompany(@PathVariable String companyId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        try {
            adminService.deleteCompanyWithRelatedData(companyId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "회사가 성공적으로 삭제되었습니다."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "회사 삭제 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    //---------------------------
    // 공고 관리 API
    //---------------------------

    @GetMapping("/job-posts")
    public ResponseEntity<?> getJobPosts(
        @RequestParam(required = false) String companyName,
        @RequestParam(required = false) String jobPostTitle,
        @RequestParam(required = false) String jobPostStatus,
        @RequestParam(defaultValue = "공고 제목") String sortOrderBy,
        @RequestParam(required = false) Boolean isDESC,
        @RequestParam(required = false) Integer limit,
        HttpSession session
    ) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<ViewJobPost> jobPosts = adminService.adminSearchJobPosts(
            companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC, limit);
        return ResponseEntity.ok(jobPosts);
    }

    @GetMapping("/job-posts/{jobPostId}")
    public ResponseEntity<?> getJobPostDetail(@PathVariable String jobPostId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        JobPost jobPost = adminService.adminJobPostDetail(jobPostId);
        if (jobPost == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(jobPost);
    }

    @PatchMapping("/job-posts/{jobPostId}/status")
    public ResponseEntity<?> updateJobPostStatus(
        @PathVariable String jobPostId,
        @RequestBody Map<String, Boolean> statusRequest,
        HttpSession session
    ) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        Boolean status = statusRequest.get("status");
        if (status == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "상태값이 제공되지 않았습니다."));
        }

        try {
            jobPostService.updateJobPostStatus(Long.parseLong(jobPostId), status);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "공고 상태가 성공적으로 업데이트되었습니다."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "공고 상태 업데이트 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @DeleteMapping("/job-posts/{jobPostId}")
    public ResponseEntity<?> deleteJobPost(@PathVariable String jobPostId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        try {
            adminService.adminJobPostDelete(jobPostId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "공고가 성공적으로 삭제되었습니다."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "공고 삭제 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    //---------------------------
    // 지원 내역 관리 API
    //---------------------------

    @GetMapping("/applications")
    public ResponseEntity<?> getApplications(
        @RequestParam(required = false) String userName,
        @RequestParam(required = false) String companyName,
        @RequestParam(required = false) String jobPostTitle,
        @RequestParam(defaultValue = "지원자명") String sortOrderBy,
        @RequestParam(required = false) Boolean isDESC,
        @RequestParam(required = false) Integer limit,
        HttpSession session
    ) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<ViewJobApplication> applications = adminService.adminSearchJobApplications(
            userName, companyName, jobPostTitle, sortOrderBy, isDESC, limit);
        return ResponseEntity.ok(applications);
    }

    //---------------------------
    // 리뷰 관리 API
    //---------------------------

    @GetMapping("/reviews")
    public ResponseEntity<?> getAllReviewsForAdmin(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<Map<String, Object>> reviews = reviewService.getAllReviewsForAdmin();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/reviews/{reviewId}")
    public ResponseEntity<?> getReviewDetail(@PathVariable String reviewId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        try {
            Review review = reviewService.reviewCheck(Long.parseLong(reviewId));
            if (review == null) {
                return ResponseEntity.notFound().build();
            }

            // 댓글 목록도 함께 조회
            List<Comment> comments = reviewService.getCommentsByReviewId(Long.parseLong(reviewId));

            // 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("review", review);
            response.put("comments", comments);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "리뷰 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<?> updateReviewByAdmin(
        @PathVariable long reviewId,
        @RequestBody Review review,
        HttpSession session
    ) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        review.setReviewId(reviewId);
        boolean success = reviewService.updateReviewByAdmin(review);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "리뷰가 존재하지 않습니다."));
        }
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<?> deleteReviewByAdmin(@PathVariable long reviewId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        reviewService.deleteReviewByAdmin(reviewId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/reviews/{reviewId}/comments/{commentId}")
    public ResponseEntity<?> deleteCommentByAdmin(
        @PathVariable long commentId,
        HttpSession session
    ) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        reviewService.deleteCommentByAdmin(commentId);
        return ResponseEntity.ok().build();
    }

    //---------------------------
    // 공지사항 관리 API
    //---------------------------

    @GetMapping("/notices")
    public ResponseEntity<?> getAllNotices(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<Notice> notices = noticeService.getAllNotices();
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/notices/{noticeId}")
    public ResponseEntity<?> getNoticeById(@PathVariable Integer noticeId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        Notice notice = noticeService.getNoticeById(noticeId);
        if (notice == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(notice);
    }

    @PostMapping("/notices")
    public ResponseEntity<?> addNotice(@RequestBody Notice notice, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        noticeService.addNotice(notice);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/notices/{noticeId}")
    public ResponseEntity<?> updateNotice(
        @PathVariable Integer noticeId,
        @RequestBody Notice notice,
        HttpSession session
    ) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        notice.setNoticeId(noticeId);
        noticeService.updateNotice(notice);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/notices/{noticeId}")
    public ResponseEntity<?> deleteNotice(@PathVariable Integer noticeId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        noticeService.deleteNotice(noticeId);
        return ResponseEntity.ok().build();
    }
}