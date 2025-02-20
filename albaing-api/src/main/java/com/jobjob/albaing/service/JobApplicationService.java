package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobApplication;

import java.util.List;

public interface JobApplicationService {
    List<JobApplication> getApplicationsByJobPost(Integer jobPostId);
    JobApplication getApplicationById(Integer id);
    JobApplication createApplication(JobApplication jobApplication);
    void approveApplication(Integer id);
    void denyApplication(Integer id);
}