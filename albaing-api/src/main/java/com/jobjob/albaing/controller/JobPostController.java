package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.service.JobPostService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobPostController {

    @Autowired
    private HttpSession httpSession;

    @Autowired
    private JobPostService jobPostService;


    private long getCurrentCompanyId() {
        Long companyId = (Long) httpSession.getAttribute("COMPANY_ID");
        if (companyId == null) {

            throw new IllegalStateException("로그인된 회사 정보를 찾을 수 없습니다.");

        }
        return companyId;
    }

    @PostMapping
    public ResponseEntity<JobPost> createJobPost(@RequestBody JobPost jobPost) {
        // 현재 로그인한 회사 ID 설정
        long companyId = getCurrentCompanyId();
        jobPost.setCompanyId(companyId);

        JobPost createdPost = jobPostService.createJobPost(jobPost);
        return ResponseEntity.ok(createdPost);
    }

    @GetMapping("/{jobPostId}")
    public ResponseEntity<JobPost> getJobPost(@PathVariable long jobPostId) {
        long companyId = getCurrentCompanyId();

        try {
            JobPost jobPost = jobPostService.getJobPost(companyId, jobPostId);
            return ResponseEntity.ok(jobPost);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{jobPostId}")
    public ResponseEntity<JobPost> updateJobPost(
            @PathVariable long jobPostId,
            @RequestBody JobPost jobPost) {

        long companyId = getCurrentCompanyId();
        jobPost.setJobPostId(jobPostId);
        jobPost.setCompanyId(companyId);

        try {
            JobPost updatedPost = jobPostService.updateJobPost(companyId, jobPost);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{jobPostId}/status")
    public ResponseEntity<Void> updateJobPostStatus(
            @PathVariable long jobPostId,
            @RequestParam boolean status) {

        long companyId = getCurrentCompanyId();

        try {
            jobPostService.updateJobPostStatus(companyId, jobPostId, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<JobPost>> getJobPostList(
            @RequestParam(required = false) String jobCategory,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean onlyActive) {

        long companyId = getCurrentCompanyId();

        List<JobPost> jobPosts = jobPostService.getJobPostList(
                companyId, jobCategory, jobType, keyword, page, size, onlyActive);
        return ResponseEntity.ok(jobPosts);
    }
}