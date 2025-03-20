package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import java.util.List;
import java.util.Map;

public interface AdminService {
    // 회원 관리
    List<AdminUser> adminSearchUsers(String userName, String userEmail, String userPhone, String sortOrderBy, Boolean isDESC, Integer limit);
    User adminUserDetail(String userId);
    void adminUserUpdate(User user);
    void adminUserDelete(String userId);
    void deleteUserWithRelatedData(String userId);

    // 이력서 관리
    List<ViewResume> adminSearchResumes(String userName, String resumeTitle, String resumeJobCategory, String resumeJobType, String sortOrderBy, Boolean isDESC, Integer limit);
    Resume adminResumeDetail(String resumeId);
    void adminResumeDelete(String userId);

    // 기업 관리
    List<Company> adminSearchCompanies(String companyName, String companyOwnerName, String companyPhone, String companyRegistrationNumber, String companyApprovalStatus, String sortOrderBy, Boolean isDESC, Integer limit);
    Company adminCompanyDetail(String companyId);
    void adminCompanyDelete(String companyId);
    void updateCompanyStatus(String companyId, String status);
    void deleteCompanyWithRelatedData(String companyId);

    // 공고 관리
    List<ViewJobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus, String sortOrderBy, Boolean isDESC, Integer limit);
    JobPost adminJobPostDetail(String jobPostId);
    void adminJobPostDelete(String jobPostId);
    void adminJobPostStatusChange(String CompanyId);

    // 지원 내역 관리
    List<ViewJobApplication> adminSearchJobApplications(String userName, String companyName, String jobPostTitle, String sortOrderBy, Boolean isDESC, Integer limit);

    // 대시보드 통계
    Map<String, Object> getDashboardStats();

    List<Map<String, Object>> getAllReviewsForAdmin();

    boolean updateReviewByAdmin(Review review);

    void deleteReviewByAdmin(long reviewId);

    void deleteCommentByAdmin(long commentId);

}