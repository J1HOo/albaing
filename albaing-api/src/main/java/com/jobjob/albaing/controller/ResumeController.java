
package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.service.ResumeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private ResumeServiceImpl resumeService;

    // 2. 이력서 수정
    @PutMapping("/update/{resumeId}")
    public void updateResume(
        @PathVariable int resumeId,
        @RequestBody ResumeUpdateRequest resumeUpdateRequest) {
        if (resumeUpdateRequest.getResume() != null) {
            resumeUpdateRequest.getResume().setResumeId(resumeId);
        }
        resumeService.updateResume(resumeUpdateRequest);
    }

    // 3. 이력서 조회
    @GetMapping("/{resumeId}")
    public Resume resumeDetails(@PathVariable int resumeId) {
        return resumeService.resumeDetails(resumeId);
    }

    @GetMapping("/user/{userId}")
    public Resume getResumeByUserId(@PathVariable("userId") int userId) {
        return resumeService.getResumeByUserId(userId);
    }

    // 회원가입 시 이력서 자동 생성 (POST)
    @PostMapping("/resume/create")
    public void createResumeForUser(@RequestBody User user) {
        resumeService.createResumeForUser(user);
    }

    //경력 삭제 delete
    @DeleteMapping("{userId}/careers/{careerId}")
    public void deleteCareer(@PathVariable Integer careerId, @PathVariable int userId) {
        resumeService.deleteCareer(careerId, userId);

    @GetMapping("/list")
    public ResponseEntity<List<ResumeSummary>> listResumes() {
        List<ResumeSummary> result = resumeService.getAllResumeSummaries();
        return ResponseEntity.ok(result);
    }

}
