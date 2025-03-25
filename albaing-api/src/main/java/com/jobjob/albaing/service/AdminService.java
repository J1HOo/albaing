package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;

import java.util.List;

public interface AdminService {

    List<AdminUser> adminSearchUsers(String userName, String userEmail, String userPhone, String sortOrderBy, Boolean isDESC);

    List<ViewResume> adminSearchResumes(String userName, String resumeTitle, String resumeJobCategory, String resumeJobType, String sortOrderBy, Boolean isDESC);

    List<ViewJobApplication> adminSearchJobApplications(String userName, String companyName, String jobPostTitle, String sortOrderBy, Boolean isDESC);

    List<Company> adminSearchCompanies(String companyName, String companyOwnerName, String companyPhone, String companyRegistrationNumber, String sortOrderBy, Boolean isDESC);

    List<ViewJobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus, String sortOrderBy, Boolean isDESC);

    List<Notice> adminSearchNotices();

    List<ViewReview> adminSearchReviews(String reviewTitle, String userName, String companyName, String sortOrderBy, Boolean isDESC);

    User adminUserDetail(String userId);

    void adminUserDelete(String userId);

    Resume adminResumeDetail(String resumeId);

    void adminResumeDelete(String userId);

    Company adminCompanyDetail(String companyId);

    void adminCompanyDelete(String companyId);

    JobPost adminJobPostDetail(String jobPostId);

    void adminJobPostDelete(String jobPostId);

    void adminJobPostStatusChange(String CompanyId);
}
