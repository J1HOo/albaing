package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.service.JobApplicationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationServiceImpl jobApplicationService;

    @GetMapping("/{jobPostId}")
    public List<JobApplication> getApplicationsByJobPost(@PathVariable int jobPostId) {
        return jobApplicationService.getApplicationsByJobPost(jobPostId);
    }

    @PutMapping("/{applicationId}/status")
    public void updateApplicationStatus(
            @PathVariable int applicationId,
            @RequestParam String status
    ) {
        jobApplicationService.updateApplicationStatus(applicationId, status);
    }
}