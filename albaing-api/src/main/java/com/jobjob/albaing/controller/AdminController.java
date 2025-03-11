package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.service.AdminServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        return adminService.adminSearchUsers(userName, userEmail, userPhone, sortOrderBy, isDESC);
    }

    // 이력서 검색
    @GetMapping("/resumes")
    public List<ViewResume> adminSearchResumes(@RequestParam(required = false) String userName,
                                               @RequestParam(required = false) String resumeTitle,
                                               @RequestParam(required = false) String resumeCategory,
                                               @RequestParam(required = false) String resumeJobType,
                                               @RequestParam(required = false) String sortOrderBy,
                                               @RequestParam(required = false) Boolean isDESC) {

        return adminService.adminSearchResumes(userName, resumeTitle, resumeCategory, resumeJobType, sortOrderBy, isDESC);
    }

    // 공고지원 검색
    @GetMapping("/job-applications")
    public List<ViewJobApplication> adminSearchJobApplications(@RequestParam(required = false) String userName,
                                                               @RequestParam(required = false) String companyName,
                                                               @RequestParam(required = false) String jobPostTitle,
                                                               @RequestParam(required = false) String sortOrderBy,
                                                               @RequestParam(required = false) Boolean isDESC) {

        return adminService.adminSearchJobApplications(userName, companyName, jobPostTitle, sortOrderBy, isDESC);
    }

    // 법인 검색
    @GetMapping("/companies")
    public List<Company> adminSearchCompanies(@RequestParam(required = false) String companyName,
                                              @RequestParam(required = false) String companyOwnerName,
                                              @RequestParam(required = false) String companyPhone,
                                              @RequestParam(required = false) String companyRegistrationNumber,
                                              @RequestParam(required = false) String sortOrderBy,
                                              @RequestParam(required = false) Boolean isDESC) {

        return adminService.adminSearchCompanies(companyName, companyOwnerName, companyPhone, companyRegistrationNumber, sortOrderBy, isDESC);
    }

    // 공고 검색
    @GetMapping("/job-posts")
    public List<ViewJobPost> adminSearchJobPosts(@RequestParam(required = false) String companyName,
                                                 @RequestParam(required = false) String jobPostTitle,
                                                 @RequestParam(required = false) String jobPostStatus,
                                                 @RequestParam(required = false) String sortOrderBy,
                                                 @RequestParam(required = false) Boolean isDESC) {
        return adminService.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC);
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

}
