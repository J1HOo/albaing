package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.CompanyServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/companies")
public class AdminCompanyController {

    @Autowired
    private CompanyServiceImpl companyService;

    // 관리자 권한 확인 메소드
    private boolean isAdmin(HttpSession session) {
        User user = (User) session.getAttribute("userSession");
        return user != null && user.getUserIsAdmin() != null && user.getUserIsAdmin();
    }

    // 모든 회사 목록 조회 (관리자용)
    @GetMapping
    public ResponseEntity<?> getAllCompanies(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<Company> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    // 승인 대기 중인 회사 목록 조회
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingCompanies(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<Company> pendingCompanies = companyService.getPendingCompanies();
        return ResponseEntity.ok(pendingCompanies);
    }

    // 회사 상세 정보 조회 (관리자용)
    @GetMapping("/{companyId}")
    public ResponseEntity<?> getCompanyDetail(@PathVariable long companyId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        Company company = companyService.companyDetail(companyId);
        if (company == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(company);
    }

    // 회사 승인 상태 업데이트 (관리자용)
    @PatchMapping("/{companyId}/status")
    public ResponseEntity<?> updateCompanyStatus(
        @PathVariable long companyId,
        @RequestBody Map<String, String> statusRequest,
        HttpSession session) {

        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        String approvalStatus = statusRequest.get("companyApprovalStatus");
        if (approvalStatus == null || approvalStatus.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "승인 상태가 제공되지 않았습니다."));
        }

        boolean success = companyService.updateApprovalStatus(companyId, approvalStatus);
        if (success) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회사 상태가 성공적으로 업데이트되었습니다.");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "회사 상태 업데이트 중 오류가 발생했습니다."));
        }
    }

    // 회사 삭제 (관리자용)
    @DeleteMapping("/{companyId}")
    public ResponseEntity<?> deleteCompany(@PathVariable long companyId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        boolean success = companyService.deleteCompany(companyId);
        if (success) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회사가 성공적으로 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "회사 삭제 중 오류가 발생했습니다."));
        }
    }
}