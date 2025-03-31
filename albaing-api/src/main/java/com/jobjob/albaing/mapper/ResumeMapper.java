package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ResumeMapper {

        // 회원가입 시 이력서 자동 생성
        void createResumeForUser(Resume resume);

        // 기본 학력 정보 생성
        void createDefaultEducation(EducationHistory educationHistory);

        // 기본 경력 정보 생성
        void createDefaultCareer(CareerHistory careerHistory);

        // 사용자 ID로 이력서 조회 (중복 생성 방지용)
        Resume getResumeByUserId(int userId);

        // 이력서 상세 조회
        Resume resumeDetails(int resumeId);

        // 이력서 수정
        void updateResume(ResumeUpdateRequest resumeUpdateRequest);

        // 학력 정보 수정
        void updateEducation(ResumeUpdateRequest resumeUpdateRequest);

        // 학력 정보 조회
        EducationHistory getEducationHistoryByResumeId(int resumeId);

        // 경력 정보 수정
        void updateCareer(ResumeUpdateRequest resumeUpdateRequest);

        // 경력 정보 조회
        CareerHistory getCareerHistoryByResumeId(int resumeId);


        List<ResumeSummary> getAllResumeSummaries();
}
