package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.*;

import com.jobjob.albaing.service.ResumeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api")
@RestController
public class ResumeController {

    @Autowired
    private ResumeServiceImpl resumeService;

    // 1. 회원가입 시 이력서 자동 생성 (POST)
    @PostMapping("/resume")
    public void createResumeForUser(@RequestBody User user) {
        resumeService.createResumeForUser(user);
    }

    // 2. 이력서 수정
    @PutMapping("/resume/update/{resumeId}")
    public void updateResume(
            @PathVariable int resumeId,
            @RequestBody ResumeUpdateRequest resumeUpdateRequest) {
        resumeService.updateResume(resumeUpdateRequest);
    }

    // 3. 이력서 조회
    @GetMapping("/resume/{resumeId}")
    public Resume resumeDetails(@PathVariable int resumeId) {
        return resumeService.resumeDetails(resumeId);
    }

    // 4. 사용자 정보 조회
    @GetMapping("/user/{userId}")
    public User getUserById(@PathVariable int userId) {
        return resumeService.getUserById(userId);
    }

    // 5. 사용자 정보 수정
    @PutMapping("/user/update/{userId}")
    public void updateUser(@PathVariable int userId,
                           @RequestParam("userEmail") String userEmail,
                           @RequestParam("userAddress") String userAddress,
                           @RequestParam("userProfileImage") String userProfileImage) {
        resumeService.updateUser(userId,userEmail,userAddress,userProfileImage);
    }

    //6. 이력서 최종 저장
    @PostMapping("/resume/save")
    public void insertResume(@RequestBody ResumeUpdateRequest resumeUpdateRequest) {
        resumeService.insertResume(resumeUpdateRequest);
    }
}




