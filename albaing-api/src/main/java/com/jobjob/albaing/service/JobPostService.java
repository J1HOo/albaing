package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobPost;

import java.util.List;

public interface JobPostService {
    JobPost createJobPost(JobPost jobPost);
    JobPost getJobPost(int jobPostId);
    List<JobPost> getJobPostList(String jobCategory, String jobType, String keyword, int page, int size, boolean onlyActive);
    JobPost updateJobPost(JobPost jobPost);
    void updateJobPostStatus(int jobPostId, boolean status);
    int getTotalCount(String jobCategory, String jobType, String keyword, boolean onlyActive);
    List<JobPost> getJobPostsByCompanyId(long companyId);
}
