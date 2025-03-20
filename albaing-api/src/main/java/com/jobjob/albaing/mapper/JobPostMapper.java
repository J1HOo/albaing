package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.dto.ViewJobPost;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface JobPostMapper {
    void insertJobPost(JobPost jobPost);

    JobPost selectJobPostById(long jobPostId);

    List<JobPost> selectJobPostList(Map<String, Object> params);

    void updateJobPost(JobPost jobPost);

    void updateJobPostStatus(@Param("jobPostId") long jobPostId,
                             @Param("status") boolean status);

    int countJobPost(Map<String, Object> params);

    List<JobPost> getJobPostsByCompanyId(long companyId);

    List<JobPost> mainPageJobPostsAlignByDueDateASC();

    List<JobPost> mainPageJobPostsAlignByDueDateDESC();

    List<JobPost> mainPageJobPostsAlignByUserResume(String resumeLocation, String resumeJobDuration);

    List<JobPost> mainPageJobPostsRandom();

    List<ViewJobPost> searchJobPosts(String regionSelect, String jobCategorySelect, String searchKeyword);
}