package com.jobjob.albaing.service;


import com.jobjob.albaing.dto.JobApplication;
import java.util.List;

public interface JobApplicationService {
    List<JobApplication> getApplicationsByJobPost(long jobPostId);
    void updateApplicationStatus(long applicationId, JobApplication.ApplicationStatus status);
}