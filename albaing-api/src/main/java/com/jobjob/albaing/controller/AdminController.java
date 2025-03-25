package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.service.AdminServiceImpl;
import com.jobjob.albaing.service.ResumeServiceImpl;
import com.jobjob.albaing.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminServiceImpl adminService;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private ResumeServiceImpl resumeService;

    // 개인 검색
    @GetMapping("/users")
    public List<AdminUser> adminSearchUsers(@RequestParam(required = false) String userName,
                                            @RequestParam(required = false) String userEmail,
                                            @RequestParam(required = false) String userPhone,
                                            @RequestParam(required = false) String sortOrderBy,
                                            @RequestParam(required = false) Boolean isDESC) {
        if (sortOrderBy != null) {
            if (sortOrderBy.equals("userId")) {
                sortOrderBy = "userId";
            } else if (sortOrderBy.equals("companyId")) {
                sortOrderBy = "companyId";
            } else if (sortOrderBy.equals("name")) {
                sortOrderBy = "이름";
            } else if (sortOrderBy.equals("createdAt")) {
                sortOrderBy = "가입일";
            }
        } else {
            sortOrderBy = "이름";
        }

        return adminService.adminSearchUsers(userName, userEmail, userPhone, sortOrderBy, isDESC);
    }

    private String formatDateSafely(Object dateObj, SimpleDateFormat dateFormat) {
        if (dateObj == null) return "";

        if (dateObj instanceof Date) {
            return dateFormat.format(dateObj);
        } else if (dateObj instanceof String) {
            try {
                return dateFormat.format(dateFormat.parse((String)dateObj));
            } catch (Exception e) {
                return (String)dateObj;
            }
        }

        return "";
    }

    // 회원 목록 CSV 다운로드
    @GetMapping("/users/csv")
    public ResponseEntity<byte[]> getUsersCSV(
        @RequestParam(required = false) String userName,
        @RequestParam(required = false) String userEmail,
        @RequestParam(required = false) String userPhone) {

        List<AdminUser> users = adminService.adminSearchUsers(userName, userEmail, userPhone, "이름", false);

        StringBuilder csv = new StringBuilder();
        csv.append("회원ID,이름,이메일,전화번호,성별,생년월일,주소,가입일,수정일,관리자여부\n");

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        for (AdminUser user : users) {
            csv.append(user.getUserId()).append(",");
            csv.append(escapeCsvField(user.getUserName())).append(",");
            csv.append(escapeCsvField(user.getUserEmail())).append(",");
            csv.append(escapeCsvField(user.getUserPhone())).append(",");
            csv.append(user.getUserGender() != null ? user.getUserGender() : "").append(",");
            csv.append(formatDateSafely(user.getUserBirthdate(), dateFormat)).append(",");
            csv.append(escapeCsvField(user.getUserAddress())).append(",");
            csv.append(formatDateSafely(user.getUserCreatedAt(), dateFormat)).append(",");
            csv.append(formatDateSafely(user.getUserUpdatedAt(), dateFormat)).append(",");
            csv.append(user.getUserIsAdmin() != null && user.getUserIsAdmin() ? "예" : "아니오").append("\n");
        }

        String filename = "알바잉_회원목록_" + new SimpleDateFormat("yyyyMMdd").format(new Date()) + ".csv";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv;charset=UTF-8"));
        headers.set("Content-Disposition", "attachment; filename=\"" + filename + "\"");

        headers.add("Access-Control-Allow-Origin", "*");

        return ResponseEntity.ok()
            .headers(headers)
            .body(csv.toString().getBytes(StandardCharsets.UTF_8));
    }

    // 채용공고 목록 CSV 다운로드
    @GetMapping("/job-posts/csv")
    public ResponseEntity<byte[]> getJobPostsCSV(
        @RequestParam(required = false) String companyName,
        @RequestParam(required = false) String jobPostTitle,
        @RequestParam(required = false) String jobPostStatus) {

        try {
            List<ViewJobPost> jobPosts = adminService.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus, "공고 제목", false);

            StringBuilder csv = new StringBuilder();
            csv.append("공고ID,공고제목,회사명,직무분류,고용형태,근무지,급여,근무기간,마감일,등록일,공개여부\n");

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            for (ViewJobPost post : jobPosts) {
                csv.append(post.getJobPostId()).append(",");
                csv.append(escapeCsvField(post.getJobPostTitle() != null ? post.getJobPostTitle() : "")).append(",");
                csv.append(escapeCsvField(post.getCompanyName() != null ? post.getCompanyName() : "")).append(",");
                csv.append(escapeCsvField(post.getJobPostJobCategory() != null ? post.getJobPostJobCategory() : "")).append(",");
                csv.append(escapeCsvField(post.getJobPostJobType() != null ? post.getJobPostJobType() : "")).append(",");
                csv.append(escapeCsvField(post.getJobPostWorkPlace() != null ? post.getJobPostWorkPlace() : "")).append(",");
                csv.append(escapeCsvField(post.getJobPostSalary() != null ? post.getJobPostSalary() : "")).append(",");
                csv.append(escapeCsvField(post.getJobPostWorkingPeriod() != null ? post.getJobPostWorkingPeriod() : "")).append(",");
                csv.append(formatDateSafely(post.getJobPostDueDate(), dateFormat)).append(",");
                csv.append(formatDateSafely(post.getJobPostCreatedAt(), dateFormat)).append(",");
                csv.append(post.getJobPostStatus() != null && post.getJobPostStatus() ? "공개" : "비공개").append("\n");
            }

            String filename = "알바잉_채용공고목록_" + new SimpleDateFormat("yyyyMMdd").format(new Date()) + ".csv";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv;charset=UTF-8"));
            headers.set("Content-Disposition", "attachment; filename=\"" + filename + "\"");
            headers.add("Access-Control-Allow-Origin", "*");

            return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString().getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(("CSV 생성 중 오류가 발생했습니다: " + e.getMessage()).getBytes(StandardCharsets.UTF_8));
        }
    }

    // 안전한 날짜 형식화를 위한 메서드 추가
    private String formatDateSafely(Date date, SimpleDateFormat dateFormat) {
        if (date == null) return "";
        try {
            return dateFormat.format(date);
        } catch (Exception e) {
            return "";
        }
    }

    private String escapeCsvField(String field) {
        if (field == null) return "";

        if (field.contains(",") || field.contains("\"") || field.contains("\n") || field.contains("\r")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        return field;
    }

    // 개인 회원 상세 정보 조회
    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    // 개인 회원 정보 수정
    @PutMapping("/users/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User user) {
        if (!userId.equals(user.getUserId())) {
            return ResponseEntity.badRequest().build();
        }

        userService.updateUser(user);
        return ResponseEntity.ok(user);
    }

    // 개인 유저 삭제 + 이력서 삭제
    @DeleteMapping("/users/{userId}")
    public void adminUserDelete(@PathVariable String userId) {
        adminService.adminUserDelete(userId);
        adminService.adminResumeDelete(userId);
    }

    // 유저 ID로 이력서 조회
    @GetMapping("/resumes/user/{userId}")
    public ResponseEntity<Resume> getResumeByUserId(@PathVariable int userId) {
        Resume resume = resumeService.getResumeByUserId(userId);
        if (resume == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resume);
    }

    // 이력서 ID로 이력서 조회
    @GetMapping("/resumes/{resumeId}")
    public ResponseEntity<Resume> getResumeById(@PathVariable int resumeId) {
        Resume resume = resumeService.resumeDetails(resumeId);
        if (resume == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resume);
    }

    // 이력서 수정
    @PutMapping("/resumes/update/{resumeId}")
    public ResponseEntity<Void> updateResume(
        @PathVariable int resumeId,
        @RequestBody ResumeUpdateRequest resumeUpdateRequest) {

        if (resumeUpdateRequest.getResume() != null) {
            resumeUpdateRequest.getResume().setResumeId(resumeId);
        } else {
            return ResponseEntity.badRequest().build();
        }

        resumeService.updateResume(resumeUpdateRequest);
        return ResponseEntity.ok().build();
    }

    // 이력서 검색
    @GetMapping("/resumes")
    public List<ViewResume> adminSearchResumes(@RequestParam(required = false) String userName,
                                               @RequestParam(required = false) String resumeTitle,
                                               @RequestParam(required = false) String resumeCategory,
                                               @RequestParam(required = false) String resumeJobType,
                                               @RequestParam(defaultValue = "이름") String sortOrderBy,
                                               @RequestParam(required = false) Boolean isDESC) {

        return adminService.adminSearchResumes(userName, resumeTitle, resumeCategory, resumeJobType, sortOrderBy, isDESC);
    }

    // 공고지원 검색
    @GetMapping("/job-applications")
    public List<ViewJobApplication> adminSearchJobApplications(@RequestParam(required = false) String userName,
                                                               @RequestParam(required = false) String companyName,
                                                               @RequestParam(required = false) String jobPostTitle,
                                                               @RequestParam(defaultValue = "지원자명") String sortOrderBy,
                                                               @RequestParam(required = false) Boolean isDESC) {

        return adminService.adminSearchJobApplications(userName, companyName, jobPostTitle, sortOrderBy, isDESC);
    }

    // 회사 검색
    @GetMapping("/companies")
    public List<Company> adminSearchCompanies(
        @RequestParam(required = false) String companyName,
        @RequestParam(required = false) String companyOwnerName,
        @RequestParam(required = false) String companyPhone,
        @RequestParam(required = false) String companyRegistrationNumber,
        @RequestParam(required = false) String sortOrderBy,
        @RequestParam(required = false) Boolean isDESC) {

        if (sortOrderBy != null) {
            if (sortOrderBy.equals("companyId")) {
                sortOrderBy = "companyId";
            } else if (sortOrderBy.equals("companyName")) {
                sortOrderBy = "법인명";
            } else if (sortOrderBy.equals("companyOwnerName")) {
                sortOrderBy = "대표자명";
            } else if (sortOrderBy.equals("companyRegistrationNumber")) {
                sortOrderBy = "사업자번호";
            } else if (sortOrderBy.equals("createdAt")) {
                sortOrderBy = "가입일";
            }
        } else {
            sortOrderBy = "법인명";
        }

        return adminService.adminSearchCompanies(companyName, companyOwnerName, companyPhone, companyRegistrationNumber, sortOrderBy, isDESC);
    }


    // 회사 상세 조회
    @GetMapping("/companies/{companyId}")
    public Company adminCompanyDetail(@PathVariable String companyId) {
        return adminService.adminCompanyDetail(companyId);
    }

    // 회사 상태 변경
    @PatchMapping("/companies/{companyId}/approval-status")
    public ResponseEntity<Void> updateCompanyApprovalStatus(
        @PathVariable Long companyId,
        @RequestBody Map<String, String> requestBody) {

        String status = requestBody.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().build();
        }

        adminService.updateCompanyApprovalStatus(companyId, status);
        return ResponseEntity.ok().build();
    }

    // 회사 삭제
    @DeleteMapping("/companies/{companyId}")
    public void adminCompanyDelete(@PathVariable String companyId) {
        adminService.deleteCompanyWithJobPosts(companyId);
    }

    // 공고 검색
    @GetMapping("/job-posts")
    public List<ViewJobPost> adminSearchJobPosts(@RequestParam(required = false) String companyName,
                                                 @RequestParam(required = false) String jobPostTitle,
                                                 @RequestParam(required = false) String jobPostStatus,
                                                 @RequestParam(defaultValue = "공고 제목") String sortOrderBy,
                                                 @RequestParam(required = false) Boolean isDESC) {

        return adminService.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC);
    }

    // 공고 상세 조회
    @GetMapping("/job-posts/{jobPostId}")
    public JobPost adminJobPostDetail(@PathVariable String jobPostId) {
        return adminService.adminJobPostDetail(jobPostId);
    }

    // 공고 상태 변경
    @PatchMapping("/job-posts/{jobPostId}/status")
    public ResponseEntity<Void> updateJobPostStatus(
        @PathVariable String jobPostId,
        @RequestBody Map<String, Object> requestBody) {

        Boolean status = (Boolean) requestBody.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().build();
        }

        adminService.updateJobPostStatus(jobPostId, status);
        return ResponseEntity.ok().build();
    }

    // 공고 삭제
    @DeleteMapping("/job-posts/{jobPostId}")
    public void adminJobPostDelete(@PathVariable String jobPostId) {
        adminService.adminJobPostDelete(jobPostId);
    }

    // 모든 공지사항 조회
    @GetMapping("/notices")
    public List<Notice> getAllNotices() {
        return adminService.getAllNotices();
    }

    // 공지사항 상세 조회
    @GetMapping("/notices/{noticeId}")
    public Notice getNoticeById(@PathVariable Long noticeId) {
        return adminService.getNoticeById(noticeId);
    }

    // 공지사항 추가
    @PostMapping("/notices")
    public void addNotice(@RequestBody Notice notice) {
        adminService.addNotice(notice);
    }

    // 공지사항 수정
    @PutMapping("/notices/{noticeId}")
    public void updateNotice(@PathVariable Long noticeId, @RequestBody Notice notice) {
        notice.setNoticeId(noticeId);
        adminService.updateNotice(notice);
    }

    // 공지사항 삭제
    @DeleteMapping("/notices/{noticeId}")
    public void deleteNotice(@PathVariable Long noticeId) {
        adminService.deleteNotice(noticeId);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent/users")
    public ResponseEntity<List<Map<String, Object>>> getRecentUsers() {
        List<Map<String, Object>> users = adminService.getRecentUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/recent/jobposts")
    public ResponseEntity<List<Map<String, Object>>> getRecentJobPosts() {
        List<Map<String, Object>> jobPosts = adminService.getRecentJobPosts();
        return ResponseEntity.ok(jobPosts);
    }

    // 직종별 채용공고 통계
    @GetMapping("/stats/job-categories")
    public ResponseEntity<List<Map<String, Object>>> getJobCategoryStats() {
        List<Map<String, Object>> stats = adminService.getJobCategoryStats();
        return ResponseEntity.ok(stats);
    }

    // 고용형태별 채용공고 통계
    @GetMapping("/stats/job-types")
    public ResponseEntity<List<Map<String, Object>>> getJobTypeStats() {
        List<Map<String, Object>> stats = adminService.getJobTypeStats();
        return ResponseEntity.ok(stats);
    }

    // 지역별 회원 통계
    @GetMapping("/stats/user-regions")
    public ResponseEntity<List<Map<String, Object>>> getUserRegionStats() {
        List<Map<String, Object>> stats = adminService.getUserRegionStats();
        return ResponseEntity.ok(stats);
    }
}