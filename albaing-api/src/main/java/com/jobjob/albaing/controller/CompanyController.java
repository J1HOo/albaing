package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.service.CompanyServiceImpl;
import com.jobjob.albaing.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyServiceImpl companyService;

    @Autowired
    private FileService fileService;


    // 회사 목록 조회 API
    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    // 회사 상세 정보 불러오기
    @GetMapping("/{companyId}")
    public ResponseEntity<Company> companyDetail(@PathVariable("companyId") long companyId) {
        Company company = companyService.companyDetail(companyId);
        return ResponseEntity.ok(company);
    }

    // 회사 상세 정보 수정
    @PutMapping(value = "/{companyId}", consumes = {"multipart/form-data", "application/json"})
    public ResponseEntity<?> updateCompany(
        @PathVariable Long companyId,
        @RequestPart(value = "company", required = false) Company company,
        @RequestPart(value = "companyLogo", required = false) MultipartFile companyLogo
    ) {
        try {
            // 기존 정보 업데이트
            if (company != null) {
                company.setCompanyId(companyId);

                // 로고 업로드가 있는 경우
                if (companyLogo != null && !companyLogo.isEmpty()) {
                    // 파일 크기 제한 (5MB)
                    if (companyLogo.getSize() > 5 * 1024 * 1024) {
                        return ResponseEntity.badRequest().body("로고 파일 크기는 5MB를 초과할 수 없습니다.");
                    }

                    // 파일 타입 검증
                    String contentType = companyLogo.getContentType();
                    if (contentType == null || !contentType.startsWith("image/")) {
                        return ResponseEntity.badRequest().body("이미지 파일만 업로드 가능합니다.");
                    }

                    // 파일 업로드 및 URL 생성
                    String logoUrl = fileService.uploadFile(companyLogo);
                    company.setCompanyLogo(logoUrl);
                }

                companyService.updateDetail(company);
            }

            return ResponseEntity.ok(company);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("회사 정보 업데이트 중 오류 발생: " + e.getMessage());
        }
    }


    // 회사명으로 검색
    @GetMapping("/search")
    public ResponseEntity<List<Company>> searchCompanies(@RequestParam("keyword") String keyword) {
        List<Company> companies = companyService.searchCompaniesByName(keyword);
        return ResponseEntity.ok(companies);
    }
}