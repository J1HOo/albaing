package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @GetMapping("/{jobPostId}")
    public List<JobApplication> getApplicationsByJobPost(@PathVariable long jobPostId) {
        return jobApplicationService.getApplicationsByJobPost(jobPostId);
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<Void> updateApplicationStatus(
            @PathVariable long applicationId,
            @RequestParam String status
    ) {
        JobApplication.ApplicationStatus applicationStatus = JobApplication.ApplicationStatus.fromString(status); // 변경됨
        jobApplicationService.updateApplicationStatus(applicationId, applicationStatus);
        return ResponseEntity.ok().build();
    }
}