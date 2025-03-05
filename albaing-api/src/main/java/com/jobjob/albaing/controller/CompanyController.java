package com.jobjob.albaing.controller;

import org.springframework.ui.Model;
import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.service.CompanyServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyServiceImpl companyService;

    //회사 상세 정보 불러오기
    @GetMapping("/{companyId}")
    public Company companyDetail(@PathVariable("companyId") long companyId) {
        return companyService.companyDetail(companyId);
    }
}