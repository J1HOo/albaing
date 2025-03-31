package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public List<ViewJobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus, String sortOrderBy, Boolean isDESC) {
        return adminMapper.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC);
    }

    @Override
    public List<Notice> adminSearchNotices() {
        return adminMapper.adminSearchNotices();
    }

    @Override
    public List<ViewReview> adminSearchReviews(String reviewTitle, String userName, String companyName, String sortOrderBy, Boolean isDESC) {
        return adminMapper.adminSearchReviews(reviewTitle, userName, companyName, sortOrderBy, isDESC);
    }

    @Override
    public List<ViewComment> adminSearchComments(String reviewTitle, String commentContent, String userName, String sortOrderBy, Boolean isDESC) {
        return adminMapper.adminSearchComments(reviewTitle, commentContent, userName, sortOrderBy, isDESC);
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

    @Override
    public Notice adminNoticeDetail(String noticeId) {
        return adminMapper.adminNoticeDetail(noticeId);
    }

    @Override
    public void adminNoticeDelete(String noticeId) {
        adminMapper.adminNoticeDelete(noticeId);
    }

    @Override
    public ViewReview adminReviewDetail(String reviewId) {
        return adminMapper.adminReviewDetail(reviewId);
    }

    @Override
    public void adminReviewDelete(String reviewId) {
        adminMapper.adminReviewDelete(reviewId);
    }

    @Override
    public void adminCommentDelete(String commentId) {
        adminMapper.adminCommentDelete(commentId);
    }
}
