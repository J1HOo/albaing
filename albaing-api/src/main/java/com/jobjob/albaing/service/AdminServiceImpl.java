package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminMapper adminMapper;

    @Override
    public List<AdminUser> adminSearchUsers(String userName, String userEmail, String userPhone, String sortOrderBy, Boolean isDESC) {
        return adminMapper.adminSearchUsers(userName, userEmail, userPhone, sortOrderBy, isDESC);
    }

    @Override
    public List<ViewResume> adminSearchResumes(String userName, String resumeTitle, String resumeJobCategory, String resumeJobType, String sortOrderBy, Boolean isDESC) {
        return adminMapper.adminSearchResumes(userName, resumeTitle, resumeJobCategory, resumeJobType, sortOrderBy, isDESC);
    }

    @Override
    public List<ViewJobApplication> adminSearchJobApplications(String userName, String companyName, String jobPostTitle, String sortOrderBy, Boolean isDESC) {
        return adminMapper.adminSearchJobApplications(userName, companyName, jobPostTitle, sortOrderBy, isDESC);
    }

    @Override
    public List<Company> adminSearchCompanies(String companyName, String companyOwnerName, String companyPhone, String companyRegistrationNumber, String sortOrderBy, Boolean isDESC) {
        return adminMapper.adminSearchCompanies(companyName, companyOwnerName, companyPhone, companyRegistrationNumber, sortOrderBy, isDESC);
    }

    @Override
    public void updateCompanyApprovalStatus(Long companyId, String status) {
        adminMapper.updateCompanyApprovalStatus(companyId, status);
    }

    @Override
    public List<ViewJobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus, String sortOrderBy, Boolean isDESC) {
        return adminMapper.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC);
    }

    @Override
    public void updateJobPostStatus(String jobPostId, Boolean status) {
        Map<String, Object> params = new HashMap<>();
        params.put("jobPostId", jobPostId);
        params.put("status", status);
        adminMapper.updateJobPostStatus(params);
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

    @Transactional
    public void deleteCompanyWithJobPosts(String companyId) {
        adminJobPostStatusChange(companyId);
        adminCompanyDelete(companyId);
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

    @Override
    public List<Notice> getAllNotices() {
        return adminMapper.getAllNotices();
    }

    @Override
    public Notice getNoticeById(Long noticeId) {
        return adminMapper.getNoticeById(noticeId);
    }

    @Override
    public void addNotice(Notice notice) {
        adminMapper.addNotice(notice);
    }

    @Override
    public void updateNotice(Notice notice) {
        adminMapper.updateNotice(notice);
    }

    @Override
    public void deleteNotice(Long noticeId) {
        adminMapper.deleteNotice(noticeId);
    }

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", adminMapper.countTotalUsers());
        stats.put("totalCompanies", adminMapper.countTotalCompanies());
        stats.put("pendingCompanies", adminMapper.countPendingCompanies());
        stats.put("activeJobPosts", adminMapper.countActiveJobPosts());
        stats.put("totalReviews", adminMapper.countTotalReviews());
        return stats;
    }

    @Override
    public List<Map<String, Object>> getRecentUsers() {
        return adminMapper.getRecentUsers();
    }

    @Override
    public List<Map<String, Object>> getRecentJobPosts() {
        return adminMapper.getRecentJobPosts();
    }
    @Override
    public List<Map<String, Object>> getJobCategoryStats() {
        return adminMapper.getJobCategoryStats();
    }

    @Override
    public List<Map<String, Object>> getJobTypeStats() {
        return adminMapper.getJobTypeStats();
    }

    @Override
    public List<Map<String, Object>> getUserRegionStats() {
        return adminMapper.getUserRegionStats();
    }
}
