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

    void updateCompanyApprovalStatus(Long companyId, String status);

    void adminResumeDelete(String userId);

    Company adminCompanyDetail(String companyId);

    void adminCompanyDelete(String companyId);

    JobPost adminJobPostDetail(String jobPostId);

    void adminJobPostDelete(String jobPostId);

    void adminJobPostStatusChange(String CompanyId);

    void updateJobPostStatus(String jobPostId, Boolean status);

    // 모든 공지사항 조회
    List<Notice> getAllNotices();

    // 공지사항 상세 조회
    Notice getNoticeById(Long noticeId);

    // 공지사항 추가
    void addNotice(Notice notice);

    // 공지사항 수정
    void updateNotice(Notice notice);

    // 공지사항 삭제
    void deleteNotice(Long noticeId);

    List<Map<String, Object>> getRecentUsers();

    List<Map<String, Object>> getRecentJobPosts();

    Map<String, Object> getDashboardStats();

    // 직종별 채용공고 통계
    List<Map<String, Object>> getJobCategoryStats();

    // 고용형태별 채용공고 통계
    List<Map<String, Object>> getJobTypeStats();

    // 지역별 회원 통계
    List<Map<String, Object>> getUserRegionStats();
}
