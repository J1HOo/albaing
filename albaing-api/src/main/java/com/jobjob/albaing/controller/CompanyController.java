package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.service.CompanyServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyServiceImpl companyService;

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
    @PutMapping("/{companyId}")
    public ResponseEntity<?> updateCompany(@PathVariable Long companyId, @RequestBody Company company) {
        company.setCompanyId(companyId);
        companyService.updateDetail(company);
        return ResponseEntity.ok(company);
    }

    // 회사명으로 검색
    @GetMapping("/search")
    public ResponseEntity<List<Company>> searchCompanies(@RequestParam("keyword") String keyword) {
        List<Company> companies = companyService.searchCompaniesByName(keyword);
        return ResponseEntity.ok(companies);
    }
}