package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.mapper.JobApplicationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationMapper jobApplicationMapper;

    @Override
    public List<JobApplication> getApplicationsByJobPost(long jobPostId) {
        return jobApplicationMapper.findByJobPostId(jobPostId);
    }

    @Override
    public void updateApplicationStatus(long applicationId, JobApplication.ApplicationStatus status) {
        jobApplicationMapper.updateStatus(applicationId, status.name());
    }
}