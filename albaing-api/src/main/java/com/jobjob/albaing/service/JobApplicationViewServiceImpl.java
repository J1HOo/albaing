package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.ViewJobApplication;
import com.jobjob.albaing.mapper.JobApplicationViewMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationViewServiceImpl implements JobApplicationViewService {
    @Autowired
    private  JobApplicationViewMapper jobApplicationMapper;


    @Override
    public List<ViewJobApplication> getJobSearchApplications(String companyName, String jobPostTitle, String userName) {
        return jobApplicationMapper.getJobSearchApplications(companyName, jobPostTitle, userName);
    }
}
