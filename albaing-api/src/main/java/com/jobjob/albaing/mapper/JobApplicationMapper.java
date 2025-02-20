package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.JobApplication;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Mapper
public interface JobApplicationMapper {
    List<JobApplication> findByJobPostId(Integer jobPostId);
    JobApplication findById(Integer id);
    void save(JobApplication jobApplication);
    void updateStatus(@Param("id") Integer id, @Param("status") String status);
}
