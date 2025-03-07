package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.service.AdminServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminServiceImpl adminService;

    // 유저 검색
    @GetMapping("/users")
    public List<User> adminSearchUsers(@PathVariable String userName,
                                       @PathVariable String userEmail,
                                       @PathVariable String userPhone,
                                       @PathVariable String sortOrderBy,
                                       @PathVariable Boolean isDESC) {

        List<User> usersSearchResults = adminService.adminSearchUsers(userName, userEmail, userPhone, sortOrderBy, isDESC);
        return usersSearchResults;
    }

    // 이력서 검색
    @GetMapping("/resumes")
    public List<Resume> adminSearchResumes(@PathVariable String resumeTitle,
                                           @PathVariable String resumeCategory,
                                           @PathVariable String resumeJobType,
                                           @PathVariable String sortOrderBy,
                                           @PathVariable Boolean isDESC) {
        List<Resume> resumesSearchResults = adminService.adminSearchResumes(resumeTitle, resumeCategory, resumeJobType, sortOrderBy, isDESC);
        return resumesSearchResults;
    }
  
    @GetMapping("/job-applications")
    public List<JobApplication> adminSearchJobApplications(@PathVariable String userName,
                                                           @PathVariable String companyName,
                                                           @PathVariable String jobPostTitle,
                                                           @PathVariable String sortOrderBy,
                                                           @PathVariable Boolean isDESC) {

        List<JobApplication> jobApplicationsSearchResults = adminService.adminSearchJobApplications(userName, companyName, jobPostTitle, sortOrderBy, isDESC);
        return jobApplicationsSearchResults;
    }

    @GetMapping("/companies")
    public List<Company> adminSearchCompanies(@PathVariable String companyName,
                                              @PathVariable String companyOwnerName,
                                              @PathVariable String companyPhone,
                                              @PathVariable String companyRegistrationNumber,
                                              @PathVariable String sortOrderBy,
                                              @PathVariable Boolean isDESC) {

        List<Company> companiesSearchResults = adminService.adminSearchCompanies(companyName, companyOwnerName, companyPhone, companyRegistrationNumber, sortOrderBy, isDESC);
        return companiesSearchResults;

        // 최적화를 생각하면서 다시 짜야하나?
        // SQL 에서 이중으로 JOIN 문 사용과 단순 SELECT 3번 조회와 어느쪽이 더 

    }

    @GetMapping("/job-posts")
    public List<JobPost> adminSearchJobPosts(@PathVariable String companyName,
                                             @PathVariable String jobPostTitle,
                                             @PathVariable String jobPostStatus,
                                             @PathVariable String sortOrderBy,
                                             @PathVariable Boolean isDESC) {

        List<JobPost> jobPostsSearchResults = adminService.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC);
        return jobPostsSearchResults;
    }
}
