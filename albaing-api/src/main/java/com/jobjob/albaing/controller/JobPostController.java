package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.dto.ViewJobPost;
import com.jobjob.albaing.service.JobPostService;
import com.jobjob.albaing.service.ResumeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobPostController {

    @Autowired
    private JobPostService jobPostService;

    @Autowired
    private ResumeServiceImpl resumeService;

    // GET /api/jobs
    @GetMapping
    public ResponseEntity<Map<String, Object>> getJobPostList(
            @RequestParam(required = false) String jobCategory,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean onlyActive
    ) {
        List<JobPost> jobPosts = jobPostService.getJobPostList(
                jobCategory, jobType, keyword, page, size, onlyActive);

        int totalCount = jobPostService.getTotalCount(jobCategory, jobType, keyword, onlyActive);

        Map<String, Object> response = new HashMap<>();
        response.put("content", jobPosts);
        response.put("page", page);
        response.put("size", size);
        response.put("totalElements", totalCount);
        response.put("totalPages", (int) Math.ceil((double) totalCount / size));
        response.put("first", page == 1);
        response.put("last", page >= (int) Math.ceil((double) totalCount / size));

        return ResponseEntity.ok(response);
    }

    // 채용공고 상세 조회
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

    // 채용공고 등록
    @PostMapping
    public ResponseEntity<JobPost> createJobPost(@RequestBody JobPost jobPost) {
        JobPost createdPost = jobPostService.createJobPost(jobPost);
        return ResponseEntity.ok(createdPost);
    }

    // 채용공고 상태 변경
    @PatchMapping("/{jobPostId}/status")
    public ResponseEntity<Void> updateJobPostStatus(
            @PathVariable("jobPostId") int jobPostId,
            @RequestParam("status") Boolean status
    ) {
        if (status == null) {
            return ResponseEntity.badRequest().build();
        }
        jobPostService.updateJobPostStatus(jobPostId, status);
        return ResponseEntity.ok().build();
    }

    // 회사별 채용공고 조회
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobPost>> getJobPostsByCompanyId(@PathVariable("companyId") long companyId) {
        List<JobPost> jobPosts = jobPostService.getJobPostsByCompanyId(companyId);
        return ResponseEntity.ok(jobPosts);
    }

    // 채용공고 수정
    @PutMapping("/{jobPostId}")
    public ResponseEntity<JobPost> updateJobPost(
            @PathVariable("jobPostId") long jobPostId,
            @RequestBody JobPost updatedJobPost
    ) {
        JobPost jobPost = jobPostService.updateJobPost(jobPostId, updatedJobPost);
        return ResponseEntity.ok(jobPost);
    }

    // 채용공고 개수 조회
    @GetMapping("/count")
    public ResponseEntity<Integer> getJobPostCount(
            @RequestParam(required = false) String jobCategory,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "true") boolean onlyActive
    ) {
        int count = jobPostService.getTotalCount(jobCategory, jobType, keyword, onlyActive);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/mainPage/imminentPosts")
    public List<JobPost> mainPageJobPostsAlignByDueDateASC() {
        return jobPostService.mainPageJobPostsAlignByDueDateASC();
    }

    @GetMapping("/mainPage/newPosts")
    public List<JobPost> mainPageJobPostsAlignByDueDateDESC() {
        return jobPostService.mainPageJobPostsAlignByDueDateDESC();
    }

    @GetMapping("/mainPage/randomPosts")
    public List<JobPost> mainPageJobPostsRandom() {
        return jobPostService.mainPageJobPostsRandom();
    }

    @GetMapping("/mainPage/adjustedPosts")
    public List<JobPost> mainPageJobPostsAlignByUserResume(@RequestParam int userId) {
        String resumeLocation = resumeService.getResumeByUserId(userId).getResumeLocation();
        String resumeJobDuration = resumeService.getResumeByUserId(userId).getResumeJobDuration();
        return jobPostService.mainPageJobPostsAlignByUserResume(resumeLocation, resumeJobDuration);
    }

    @GetMapping("/mainPage/searchPosts")
    public List<ViewJobPost> mainPageJobPostsSearch(@RequestParam(required = false) String regionSelect,
                                                    @RequestParam(required = false) String jobCategorySelect,
                                                    @RequestParam(required = false) String searchKeyword) {
        return jobPostService.searchJobPosts(regionSelect, jobCategorySelect, searchKeyword);
    }
}