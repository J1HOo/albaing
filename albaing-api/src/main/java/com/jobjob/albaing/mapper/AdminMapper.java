package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminMapper {

    List<User> adminSearchUsers(String userName, String userEmail, String userPhone);

    List<Resume> adminSearchResumes(String resumeTitle, String resumeJobCategory, String resumeJobType);

    List<JobApplication> adminSearchJobApplications(String userName, String companyName, String jobPostTitle);

    List<Company> adminSearchCompanies(String companyName, String companyOwnerName, String companyPhone, String companyRegistrationNumber);

    List<JobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus);

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
