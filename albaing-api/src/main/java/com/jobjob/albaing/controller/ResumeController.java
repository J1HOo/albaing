
package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.service.ResumeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public Resume getResumeByUserId(@PathVariable int userId) {
        return resumeService.getResumeByUserId(userId);
    }


}
