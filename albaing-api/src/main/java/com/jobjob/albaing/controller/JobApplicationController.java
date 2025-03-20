package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.JobApplicationServiceImpl;
import com.jobjob.albaing.service.MyApplicationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationServiceImpl jobApplicationService;
    @Autowired
    private MyApplicationService myApplicationService;

    private boolean isAdmin() {
        HttpSession session = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest().getSession();
        User user = (User) session.getAttribute("userSession");
        return user != null && user.getUserIsAdmin() != null && user.getUserIsAdmin();
    }

    // (새로 추가) 이력서 기준 지원 내역 조회
    @GetMapping("resume/{resumeId}")
    public List<Map<String, Object>> getUserApplications(@PathVariable int resumeId) {
        return myApplicationService.getUserApplications(resumeId);
    }

    // 특정 resumeId에 대한 지원 개수 및 상태별 개수 조회
    @GetMapping("/status/{resumeId}")
    public Map<String, Object> getApplicationStats(@PathVariable int resumeId) {
        return myApplicationService.getApplicationStatus(resumeId);
    }

    // (이미 있는) 채용공고별 지원자 목록 조회
    @GetMapping("/jobPost/{jobPostId}")
    public List<JobApplication> getJobApplicationsByJobPostId(@PathVariable int jobPostId) {
        return jobApplicationService.getJobApplicationsByJobPostId(jobPostId);
    }

    // (이미 있는) 사용자 공고 지원
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void userApplyForJob(@RequestBody JobApplication jobApplication) {
        jobApplicationService.userApplyForJob(jobApplication);
    }

    // (이미 있는) 지원 상태 변경 (승인/거절)
    @PutMapping("/{jobApplicationId}")
    public void updateJobApplicationStatus(
            @PathVariable int jobApplicationId,
            @RequestBody UpdateStatusRequest request
    ) {
        jobApplicationService.updateJobApplicationStatus(jobApplicationId, request.getApproveStatus());
    }

    // (이미 있는) 회사 기준 지원자 목록 조회
    @GetMapping("/company/{companyId}")
    public List<JobApplication> getApplicationsByCompany(@PathVariable int companyId) {
        return jobApplicationService.getApplicationsByCompany(companyId);
    }

    // (이미 있는) 예외 처리 핸들러
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleRuntimeException(RuntimeException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        return errorResponse;
    }

    // (이미 있는) 상태 업데이트 요청 DTO
    public static class UpdateStatusRequest {
        private String approveStatus;
        public String getApproveStatus() { return approveStatus; }
        public void setApproveStatus(String approveStatus) { this.approveStatus = approveStatus; }
    }

    @GetMapping("/api/admin/applications")
    public ResponseEntity<List<JobApplication>> getAllApplications(
        @RequestParam(required = false) String userName,
        @RequestParam(required = false) String companyName,
        @RequestParam(required = false) String jobPostTitle,
        @RequestParam(required = false) String approveStatus
    ) {
        // 관리자 권한 확인
        if (!isAdmin()) {
            return ResponseEntity.status(403).build();
        }

        List<JobApplication> applications = jobApplicationService.getAllApplications(
            userName, companyName, jobPostTitle, approveStatus);
        return ResponseEntity.ok(applications);
    }
}
