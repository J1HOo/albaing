package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminMapper adminMapper;

    @Override
    public List<AdminUser> adminSearchUsers(String userName, String userEmail, String userPhone, String sortOrderBy, Boolean isDESC, Integer limit) {
        return adminMapper.adminSearchUsers(userName, userEmail, userPhone, sortOrderBy, isDESC, limit);
    }

    @Override
    public User adminUserDetail(String userId) {
        return adminMapper.adminUserDetail(userId);
    }

    @Override
    public void adminUserUpdate(User user) {
        adminMapper.adminUserUpdate(user);
    }

    @Override
    public void adminUserDelete(String userId) {
        adminMapper.adminUserDelete(userId);
    }

    @Override
    @Transactional
    public void deleteUserWithRelatedData(String userId) {
        adminMapper.deleteApplicationsByUserId(userId);
        adminMapper.deleteScrapsByUserId(userId);
        adminMapper.deleteCommentsByUserId(userId);
        adminMapper.deleteReviewsByUserId(userId);
        adminMapper.adminResumeDelete(userId);
        adminMapper.adminUserDelete(userId);
    }

    @Override
    public List<ViewResume> adminSearchResumes(String userName, String resumeTitle, String resumeJobCategory, String resumeJobType, String sortOrderBy, Boolean isDESC, Integer limit) {
        return adminMapper.adminSearchResumes(userName, resumeTitle, resumeJobCategory, resumeJobType, sortOrderBy, isDESC, limit);
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
    public List<Company> adminSearchCompanies(String companyName, String companyOwnerName, String companyPhone, String companyRegistrationNumber, String companyApprovalStatus, String sortOrderBy, Boolean isDESC, Integer limit) {
        return adminMapper.adminSearchCompanies(companyName, companyOwnerName, companyPhone, companyRegistrationNumber, companyApprovalStatus, sortOrderBy, isDESC, limit);
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
    @Transactional
    public void updateCompanyStatus(String companyId, String status) {
        try {
            Company company = adminMapper.adminCompanyDetail(companyId);
            if (company != null) {
                company.setCompanyApprovalStatus(Company.ApprovalStatus.valueOf(status));
                company.setCompanyUpdatedAt(LocalDateTime.now());
                adminMapper.updateCompanyStatus(companyId, status);
            } else {
                throw new RuntimeException("기업 정보를 찾을 수 없습니다.");
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("유효하지 않은 상태 값입니다.", e);
        }
    }

    @Override
    @Transactional
    public void deleteCompanyWithRelatedData(String companyId) {
        adminMapper.deleteApplicationsByCompanyId(companyId);
        adminMapper.deleteScrapsByCompanyId(companyId);
        adminMapper.deleteCommentsByCompanyId(companyId);
        adminMapper.deleteReviewsByCompanyId(companyId);
        adminMapper.deleteJobPostsByCompanyId(companyId);
        adminMapper.adminCompanyDelete(companyId);
    }

    @Override
    public List<ViewJobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus, String sortOrderBy, Boolean isDESC, Integer limit) {
        return adminMapper.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC, limit);
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
    public List<ViewJobApplication> adminSearchJobApplications(String userName, String companyName, String jobPostTitle, String sortOrderBy, Boolean isDESC, Integer limit) {
        return adminMapper.adminSearchJobApplications(userName, companyName, jobPostTitle, sortOrderBy, isDESC, limit);
    }

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("userCount", adminMapper.countAllUsers());
        stats.put("companyCount", adminMapper.countAllCompanies());
        stats.put("jobPostCount", adminMapper.countAllJobPosts());
        stats.put("applicationCount", adminMapper.countAllApplications());
        stats.put("reviewCount", adminMapper.countAllReviews());
        stats.put("pendingCompanyCount", adminMapper.countPendingCompanies());
        return stats;
    }

    @Override
    public boolean updateReviewByAdmin(Review review) {
        return adminMapper.updateReviewByAdmin(review) > 0;
    }

    @Override
    public void deleteReviewByAdmin(long reviewId) {
        adminMapper.deleteReviewByAdmin(reviewId);
    }

    @Override
    public void deleteCommentByAdmin(long commentId) {
        adminMapper.deleteCommentByAdmin(commentId);
    }

    @Override
    public List<Map<String, Object>> getAllReviewsForAdmin() {
        return adminMapper.getAllReviewsForAdmin();
    }
}