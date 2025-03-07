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
        return adminMapper.adminSearchResumes(resumeTitle, resumeJobCategory, resumeJobType);
    }

    @Override
    public List<JobApplication> adminSearchJobApplications(String userName, String companyName, String jobPostTitle, String sortOrderBy, Boolean isDESC) {
        return adminMapper.adminSearchJobApplications(userName, companyName, jobPostTitle);
    }

    @Override
    public List<Company> adminSearchCompanies(String companyName, String companyOwnerName, String companyPhone, String companyRegistrationNumber, String sortOrderBy, Boolean isDESC) {
        return adminMapper.adminSearchCompanies(companyName, companyOwnerName, companyPhone, companyRegistrationNumber);
    }

    @Override
    public List<JobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus, String sortOrderBy, Boolean isDESC) {
        return adminMapper.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus);
    }

    @Override
    public User adminUserDetail(String userId) {
        return adminMapper.adminUserDetail(userId);
    }

    @Override
    public void adminUserDelete(String userId) {
        adminMapper.adminUserDelete(userId);
    }

    @Override
    public Resume adminResumeDetail(String resumeId) {
        return adminMapper.adminResumeDetail(resumeId);
    }

    @Override
    public void adminResumeDelete(String userId) {
        adminMapper.adminResumeDelete(userId);
    }

    @Override
    public Company adminCompanyDetail(String companyId) {
        return adminMapper.adminCompanyDetail(companyId);
    }

    @Override
    public void adminCompanyDelete(String companyId) {
        adminMapper.adminCompanyDelete(companyId);
    }

    @Override
    public JobPost adminJobPostDetail(String jobPostId) {
        return adminMapper.adminJobPostDetail(jobPostId);
    }

    @Override
    public void adminJobPostDelete(String jobPostId) {
        adminMapper.adminJobPostDelete(jobPostId);
    }

    @Override
    public void adminJobPostStatusChange(String CompanyId) {
        adminMapper.adminJobPostStatusChange(CompanyId);
    }
}
