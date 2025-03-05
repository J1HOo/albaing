package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.service.JobPostService;
import com.jobjob.albaing.service.JobPostServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobPostController {

    @Autowired
    private JobPostServiceImpl jobPostService;

    @PostMapping
    public ResponseEntity<JobPost> createJobPost(@RequestBody JobPost jobPost) {
        JobPost createdPost = jobPostService.createJobPost(jobPost);
        return ResponseEntity.ok(createdPost);
    }

    @GetMapping("/{jobPostId}")
    public ResponseEntity<JobPost> getJobPost(@PathVariable("jobPostId") String jobPostId) {
        try {
            int id = Integer.parseInt(jobPostId);
            JobPost jobPost = jobPostService.getJobPost(id);
            if (jobPost == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(jobPost);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build(); // 400 에러 반환
        }
    }


    @PatchMapping("/{jobPostId}/status")
    public ResponseEntity<Void> updateJobPostStatus(
        @PathVariable int jobPostId,
        @RequestParam Boolean status
    ) {
        if (status == null) {
            return ResponseEntity.badRequest().build();
        }
        jobPostService.updateJobPostStatus(jobPostId, status);
        return ResponseEntity.ok().build();
    }

    //상세 페이지 기업 채용 공고 출력
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobPost>> getJobPostsByCompanyId(@PathVariable("companyId") long companyId) {
        List<JobPost> jobPosts = jobPostService.getJobPostsByCompanyId(companyId);
        return ResponseEntity.ok(jobPosts);
    }

    @PutMapping("/{jobPostId}")
    public ResponseEntity<JobPost> updateJobPost(
            @PathVariable long jobPostId,
            @RequestBody JobPost updatedJobPost
    ) {
        // 채용공고 수정 로직
        JobPost jobPost = jobPostService.updateJobPost(jobPostId, updatedJobPost);
        return ResponseEntity.ok(jobPost);
    }
}
