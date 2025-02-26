package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.service.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobPostController {

    @Autowired
    private JobPostService jobPostService;

    @PostMapping
    public ResponseEntity<JobPost> createJobPost(@RequestBody JobPost jobPost) {
        JobPost createdPost = jobPostService.createJobPost(jobPost);
        return ResponseEntity.ok(createdPost);
    }

    @GetMapping("/{jobPostId}")
    public ResponseEntity<JobPost> getJobPost(@PathVariable int jobPostId) {
        JobPost jobPost = jobPostService.getJobPost(jobPostId);
        if (jobPost == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(jobPost);
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
    public String showPosts(@PathVariable("companyId") long companyId, Model model) {
        List<JobPost> jobPosts = jobPostService.showPosts(companyId);

        model.addAttribute("jobPosts", jobPosts);

        return "company/companyDetail";
    }
}
