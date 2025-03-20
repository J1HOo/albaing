package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.dto.ViewJobPost;

import java.util.List;

public interface JobPostService {
    JobPost createJobPost(JobPost jobPost);

    JobPost getJobPost(long jobPostId);

    List<JobPost> getJobPostList(String jobCategory, String jobType, String keyword, int page, int size, boolean onlyActive);

    JobPost updateJobPost(long jobPostId, JobPost jobPost);

    void updateJobPostStatus(long jobPostId, boolean status);

    int getTotalCount(String jobCategory, String jobType, String keyword, boolean onlyActive);

    List<JobPost> getJobPostsByCompanyId(long companyId);

    List<JobPost> mainPageJobPostsAlignByDueDateASC();

    List<JobPost> mainPageJobPostsAlignByDueDateDESC();

    List<JobPost> mainPageJobPostsAlignByUserResume(String resumeLocation, String resumeJobDuration);

    List<JobPost> mainPageJobPostsRandom();

    List<ViewJobPost> searchJobPosts(String regionSelect, String jobCategorySelect, String searchKeyword);

    List<JobPost> getAllJobPosts(String companyName, String jobPostTitle, Boolean jobPostStatus);
    void deleteJobPost(Long jobPostId);
}