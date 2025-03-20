package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminMapper {
    // 회원 관리
    List<AdminUser> adminSearchUsers(String userName, String userEmail, String userPhone, String sortOrderBy, Boolean isDESC, Integer limit);
    User adminUserDetail(String userId);
    void adminUserUpdate(User user);
    void adminUserDelete(String userId);

    // 이력서 관리
    List<ViewResume> adminSearchResumes(String userName, String resumeTitle, String resumeJobCategory, String resumeJobType, String sortOrderBy, Boolean isDESC, Integer limit);
    Resume adminResumeDetail(String resumeId);
    void adminResumeDelete(String userId);

    // 기업 관리
    List<Company> adminSearchCompanies(String companyName, String companyOwnerName, String companyPhone, String companyRegistrationNumber, String companyApprovalStatus, String sortOrderBy, Boolean isDESC, Integer limit);
    Company adminCompanyDetail(String companyId);
    void adminCompanyDelete(String companyId);
    void updateCompanyStatus(String companyId, String status);

    // 공고 관리
    List<ViewJobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus, String sortOrderBy, Boolean isDESC, Integer limit);
    JobPost adminJobPostDetail(String jobPostId);
    void adminJobPostDelete(String jobPostId);
    void adminJobPostStatusChange(String CompanyId);

    // 지원 내역 관리
    List<ViewJobApplication> adminSearchJobApplications(String userName, String companyName, String jobPostTitle, String sortOrderBy, Boolean isDESC, Integer limit);

    // 관련 데이터 삭제 메서드
    void deleteApplicationsByUserId(String userId);
    void deleteScrapsByUserId(String userId);
    void deleteCommentsByUserId(String userId);
    void deleteReviewsByUserId(String userId);
    void deleteApplicationsByCompanyId(String companyId);
    void deleteScrapsByCompanyId(String companyId);
    void deleteCommentsByCompanyId(String companyId);
    void deleteReviewsByCompanyId(String companyId);
    void deleteJobPostsByCompanyId(String companyId);

    // 통계 정보
    int countAllUsers();
    int countAllCompanies();
    int countAllJobPosts();
    int countAllApplications();
    int countAllReviews();
    int countPendingCompanies();

    List<Map<String, Object>> getAllReviewsForAdmin();
    int updateReviewByAdmin(Review review);
    void deleteReviewByAdmin(long reviewId);
    void deleteCommentByAdmin(long commentId);
}