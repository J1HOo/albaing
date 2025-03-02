package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobApplication;

import java.util.List;

public interface JobApplicationService {

    List<JobApplication> getApplicationsByJobPost(int jobPostId);
    void updateApplicationStatus(int applicationId, String status);
}
