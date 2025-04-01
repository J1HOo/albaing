package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;

import java.util.List;

public interface ResumeService {

        // 회원가입 시 이력서 생성
        void createResumeForUser(User user);

        // 이력서 조회
        Resume resumeDetails(int resumeId);

        // 이력서 수정
        void updateResume(ResumeUpdateRequest resumeUpdateRequest);

        // 이력서 조회 (유저아이디)
        Resume getResumeByUserId(int userId);

        void deleteCareer(Integer careerId, int resumeId);

        List<ResumeSummary> getAllResumeSummaries();



}

