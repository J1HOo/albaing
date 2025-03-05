package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminMapper adminMapper;

    @Override
    public List<User> adminSearchUsers(String userName, String userEmail, String userPhone, String sortOrderBy, Boolean isDESC) {
        List<User> users = new ArrayList<User>();
        users = adminMapper.adminSearchUsers(userName, userEmail, userPhone);
        return users;
    }

    @Override
    public List<Resume> adminSearchResumes(String resumeTitle, String resumeJobCategory, String resumeJobType, String sortOrderBy, Boolean isDESC) {
        List<Resume> resumes = new ArrayList<>();
        resumes = adminMapper.adminSearchResumes(resumeTitle, resumeJobCategory, resumeJobType);
        return resumes;
    }

    @Override
    public List<JobApplication> adminSearchJobApplications(String userName, String companyName, String jobPostTitle, String sortOrderBy, Boolean isDESC) {
        List<JobApplication> adminSearchJobApplications = new ArrayList<>();
        adminSearchJobApplications = adminMapper.adminSearchJobApplications(userName, companyName, jobPostTitle);
        return adminSearchJobApplications;
    }

    @Override
    public List<Company> adminSearchCompanies(String companyName, String companyOwnerName, String companyPhone, String companyRegistrationNumber, String sortOrderBy, Boolean isDESC) {
        List<Company> adminSearchCompanies = new ArrayList<>();
        adminSearchCompanies = adminMapper.adminSearchCompanies(companyName, companyOwnerName, companyPhone, companyRegistrationNumber);
        return adminSearchCompanies;
    }

    @Override
    public List<JobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus, String sortOrderBy, Boolean isDESC) {
        List<JobPost> adminSearchJobPosts = new ArrayList<>();
        adminSearchJobPosts = adminMapper.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus);
        return adminSearchJobPosts;
    }
}
