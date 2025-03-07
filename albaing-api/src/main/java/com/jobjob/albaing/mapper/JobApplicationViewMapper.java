package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.ViewJobApplication;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface JobApplicationViewMapper {
    List<ViewJobApplication> getJobSearchApplications(
            @Param("companyName") String companyName,
            @Param("jobPostTitle") String jobPostTitle,
            @Param("userName") String userName
    );
}