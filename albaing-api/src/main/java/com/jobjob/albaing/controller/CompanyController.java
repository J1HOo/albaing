package com.jobjob.albaing.controller;

import org.springframework.ui.Model;
import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.service.CompanyServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account/auth")
public class CompanyController {

    @Autowired
    private CompanyServiceImpl companyService;

    // 기업 회원가입
    @PostMapping("/register-company")
    public void registerCompany(@RequestBody Company company) {
        companyService.registerCompany(company);
    }

    //회사 상세 정보 불러오기
    @GetMapping("/{companyId}")
    public String companyDetail(@PathVariable("companyId") long companyId, Model model) {
        Company company = companyService.companyDetail(companyId);

        model.addAttribute("company", company);

        return "company/companyDetail";
        }

}
