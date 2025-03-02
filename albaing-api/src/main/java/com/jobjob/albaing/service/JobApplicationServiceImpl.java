package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.mapper.JobApplicationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationMapper jobApplicationMapper;

    @Override
    public List<JobApplication> getApplicationsByJobPost(int jobPostId) {
        return jobApplicationMapper.findByJobPostId(jobPostId);
    }

    @Override
    public void updateApplicationStatus(int applicationId, String status) {
        if (!Arrays.asList("approved", "approving", "denied").contains(status)) {
            throw new IllegalArgumentException("Invalid status value");
        }
        jobApplicationMapper.updateStatus(applicationId, status);
    }
}
