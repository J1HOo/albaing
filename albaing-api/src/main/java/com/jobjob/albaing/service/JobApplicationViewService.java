package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.ViewJobApplication;

import java.util.List;

public interface JobApplicationViewService {
    List<ViewJobApplication> getJobSearchApplications(String companyName, String jobPostTitle, String userName);
}
