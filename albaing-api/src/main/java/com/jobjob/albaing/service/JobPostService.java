package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobPost;

import java.util.List;

public interface JobPostService {
    JobPost createJobPost(JobPost jobPost);
    JobPost getJobPost(long companyId, long jobPostId);  // 회사 ID 추가
    List<JobPost> getJobPostList(long companyId, String jobCategory, String jobType,
                                 String keyword, int page, int size, boolean onlyActive);
    JobPost updateJobPost(long companyId, JobPost jobPost);  // 회사 ID 추가
    void updateJobPostStatus(long companyId, long jobPostId, boolean status); // 회사 ID 추가
    int getTotalCount(long companyId, String jobCategory, String jobType, String keyword, boolean onlyActive);
}
