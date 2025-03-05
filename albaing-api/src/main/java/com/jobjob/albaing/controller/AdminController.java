package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.Resume;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.AdminServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminServiceImpl adminService;

    // 유저 검색
    @GetMapping("/users")
    public List<User> adminSearchUsers(@PathVariable String userName,
                                       @PathVariable String userEmail,
                                       @PathVariable String userPhone,
                                       @PathVariable String sortOrderBy,
                                       @PathVariable Boolean isDESC) {

        List<User> usersResult = adminService.adminSearchUsers(userName, userEmail, userPhone, sortOrderBy, isDESC);
        return usersResult;
    }

    // 이력서 검색
    @GetMapping("/resumes")
    public List<Resume> adminSearchResumes(@PathVariable String resumeTitle,
                                          @PathVariable String resumeCategory,
                                          @PathVariable String resumeJobType,
                                          @PathVariable String sortOrderBy,
                                          @PathVariable Boolean isDESC) {
        List<Resume> resumesResult = adminService.adminSearchResumes(resumeTitle, resumeCategory, resumeJobType, sortOrderBy, isDESC);
        return resumesResult;
    }


    @GetMapping("/companies")
    public List<Company> adminSearchCompanies(@PathVariable String )
}
