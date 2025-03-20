package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobApplication;
import java.util.List;

public interface JobApplicationService {
    List<JobApplication> getJobApplications(int resumeId);

    List<JobApplication> getJobApplicationsByJobPostId(int jobPostId);

    void userApplyForJob(JobApplication jobApplication);

    void updateJobApplicationStatus(int jobApplicationId, String approveStatus);

    int countApplicationsByJobPost(int jobPostId);

    List<JobApplication> getApplicationsByCompany(int companyId);


}
