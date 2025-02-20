package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.mapper.JobApplicationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl implements JobApplicationService {
    private final JobApplicationMapper jobApplicationMapper;

    @Override
    public List<JobApplication> getApplicationsByJobPost(Integer jobPostId) {
        return jobApplicationMapper.findByJobPostId(jobPostId);
    }

    @Override
    public JobApplication getApplicationById(Integer id) {
        return jobApplicationMapper.findById(id);
    }

    @Override
    public JobApplication createApplication(JobApplication jobApplication) {
        jobApplicationMapper.save(jobApplication);
        return jobApplication;
    }

    @Override
    public void approveApplication(Integer id) {
        jobApplicationMapper.updateStatus(id, "approved");
    }

    @Override
    public void denyApplication(Integer id) {
        jobApplicationMapper.updateStatus(id, "denied");
    }
}