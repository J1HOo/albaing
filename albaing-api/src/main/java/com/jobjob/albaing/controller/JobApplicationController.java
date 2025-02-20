package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {
    private final JobApplicationService jobApplicationService;

    @GetMapping("/job/{jobPostId}")
    public ResponseEntity<List<JobApplication>> getApplicationsByJob(@PathVariable Integer jobPostId) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsByJobPost(jobPostId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplication> getApplication(@PathVariable Integer id) {
        return ResponseEntity.ok(jobApplicationService.getApplicationById(id));
    }

    @PostMapping
    public ResponseEntity<JobApplication> createApplication(@RequestBody JobApplication jobApplication) {
        return ResponseEntity.ok(jobApplicationService.createApplication(jobApplication));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Void> approveApplication(@PathVariable Integer id) {
        jobApplicationService.approveApplication(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/deny")
    public ResponseEntity<Void> denyApplication(@PathVariable Integer id) {
        jobApplicationService.denyApplication(id);
        return ResponseEntity.ok().build();
    }
}