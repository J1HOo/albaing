package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminMapper {

    List<AdminUser> adminSearchUsers(String userName, String userEmail, String userPhone, String sortOrderBy, Boolean isDESC);

    List<ViewResume> adminSearchResumes(String userName, String resumeTitle, String resumeJobCategory, String resumeJobType, String sortOrderBy, Boolean isDESC);

    List<ViewJobApplication> adminSearchJobApplications(String userName, String companyName, String jobPostTitle, String sortOrderBy, Boolean isDESC);

    List<Company> adminSearchCompanies(String companyName, String companyOwnerName, String companyPhone, String companyRegistrationNumber, String sortOrderBy, Boolean isDESC);

    List<ViewJobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus, String sortOrderBy, Boolean isDESC);

    User adminUserDetail(String userId);

    void adminUserUpdate(User user);

    void adminUserDelete(String userId);

    Resume adminResumeDetail(String resumeId);

    void adminResumeDelete(String userId);

    Company adminCompanyDetail(String companyId);

    void adminCompanyDelete(String companyId);

    JobPost adminJobPostDetail(String jobPostId);

    void adminJobPostDelete(String jobPostId);

    void adminJobPostStatusChange(String CompanyId);

    void updateCompanyStatus(String companyId, String status);

    void deleteApplicationsByUserId(String userId);

    void deleteScrapsByUserId(String userId);

    void deleteCommentsByUserId(String userId);

    void deleteReviewsByUserId(String userId);

    void deleteApplicationsByCompanyId(String companyId);

    void deleteScrapsByCompanyId(String companyId);

    void deleteCommentsByCompanyId(String companyId);

    void deleteReviewsByCompanyId(String companyId);

    void deleteJobPostsByCompanyId(String companyId);

    int countAllUsers();
    int countAllCompanies();
    int countAllJobPosts();
    int countAllApplications();
    int countAllReviews();
    int countPendingCompanies();
}
