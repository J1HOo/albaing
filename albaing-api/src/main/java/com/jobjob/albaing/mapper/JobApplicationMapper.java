package com.jobjob.albaing.mapper;


import com.jobjob.albaing.dto.JobApplication;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface JobApplicationMapper {
    List<JobApplication> findByJobPostId(long jobPostId);
    void updateStatus(@Param("applicationId") long applicationId, @Param("status") String status);
}