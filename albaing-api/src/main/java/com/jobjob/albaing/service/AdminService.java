package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;

import java.util.List;
import java.util.Map;

public interface AdminService {

    List<AdminUser> adminSearchUsers(String userName, String userEmail, String userPhone, String sortOrderBy, Boolean isDESC);

    List<ViewResume> adminSearchResumes(String userName, String resumeTitle, String resumeJobCategory, String resumeJobType, String sortOrderBy, Boolean isDESC);

    List<ViewJobApplication> adminSearchJobApplications(String userName, String companyName, String jobPostTitle, String sortOrderBy, Boolean isDESC);

    List<Company> adminSearchCompanies(String companyName, String companyOwnerName, String companyPhone, String companyRegistrationNumber, String sortOrderBy, Boolean isDESC);

    List<ViewJobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus, String sortOrderBy, Boolean isDESC);

    User adminUserDetail(String userId);

    void adminUserDelete(String userId);

    Resume adminResumeDetail(String resumeId);

    void adminResumeDelete(String userId);

    Company adminCompanyDetail(String companyId);

    void adminCompanyDelete(String companyId);

    JobPost adminJobPostDetail(String jobPostId);

    void adminJobPostDelete(String jobPostId);

    void adminJobPostStatusChange(String CompanyId);

    // 유저 정보 수정
    void adminUserUpdate(User user);

    // 기업 승인 상태 변경
    void updateCompanyStatus(String companyId, String status);

    // 유저 삭제 트랜잭션 처리 (관련 데이터 함께 삭제)
    void deleteUserWithRelatedData(String userId);

    // 기업 삭제 트랜잭션 처리 (관련 데이터 함께 삭제)
    void deleteCompanyWithRelatedData(String companyId);

    Map<String, Object> getDashboardStats();
}
