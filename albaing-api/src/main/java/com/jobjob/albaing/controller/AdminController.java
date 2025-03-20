package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.service.AdminServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminServiceImpl adminService;


    // 개인 검색
    @GetMapping("/users")
    public List<AdminUser> adminSearchUsers(
        @RequestParam(required = false) String userName,
        @RequestParam(required = false) String userEmail,
        @RequestParam(required = false) String userPhone,
        @RequestParam(required = false) String sortOrderBy,
        @RequestParam(required = false) Boolean isDESC,
        @RequestParam(required = false) Integer limit) {

        if (sortOrderBy == null || sortOrderBy.isEmpty()) {
            sortOrderBy = "이름";
        }

        return adminService.adminSearchUsers(userName, userEmail, userPhone, sortOrderBy, isDESC, limit);
    }

    // 개인 정보 수정
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User user) {
        try {
            user.setUserId(Long.valueOf(userId));
            adminService.adminUserUpdate(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "유저 정보 수정 중 오류가 발생했습니다."));
        }
    }

    // 이력서 검색
    @GetMapping("/resumes")
    public List<ViewResume> adminSearchResumes(@RequestParam(required = false) String userName,
                                               @RequestParam(required = false) String resumeTitle,
                                               @RequestParam(required = false) String resumeCategory,
                                               @RequestParam(required = false) String resumeJobType,
                                               @RequestParam(defaultValue = "이름") String sortOrderBy,
                                               @RequestParam(required = false) Boolean isDESC,
                                               @RequestParam(required = false) Integer limit) {

        return adminService.adminSearchResumes(userName, resumeTitle, resumeCategory, resumeJobType, sortOrderBy, isDESC, limit);
    }

    // 공고지원 검색
    @GetMapping("/job-applications")
    public List<ViewJobApplication> adminSearchJobApplications(@RequestParam(required = false) String userName,
                                                               @RequestParam(required = false) String companyName,
                                                               @RequestParam(required = false) String jobPostTitle,
                                                               @RequestParam(defaultValue = "지원자명") String sortOrderBy,
                                                               @RequestParam(required = false) Boolean isDESC,
                                                               @RequestParam(required = false) Integer limit) {

        return adminService.adminSearchJobApplications(userName, companyName, jobPostTitle, sortOrderBy, isDESC, limit);
    }


    // 공고 검색
    @GetMapping("/job-posts")
    public List<ViewJobPost> adminSearchJobPosts(@RequestParam(required = false) String companyName,
                                                 @RequestParam(required = false) String jobPostTitle,
                                                 @RequestParam(required = false) String jobPostStatus,
                                                 @RequestParam(defaultValue = "공고 제목") String sortOrderBy,
                                                 @RequestParam(required = false) Boolean isDESC,
                                                 @RequestParam(required = false) Integer limit) {

        return adminService.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC, limit);
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


    // 통계
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
