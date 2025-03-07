package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.ViewJobApplication;
import com.jobjob.albaing.service.JobApplicationViewServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
public class JobApplicationViewController {
    @Autowired
    private JobApplicationViewServiceImpl jobApplicationService;

    @GetMapping
    public List<ViewJobApplication> getJobSearchApplications(
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) String jobPostTitle,
            @RequestParam(required = false) String userName
    ) {
        return jobApplicationService.getJobSearchApplications(companyName, jobPostTitle, userName);
    }
}
