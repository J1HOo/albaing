package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ResumeMapper {
        Resume getResumeBasicByUserId(int userId);

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
        void updateResume(Resume resume);

        // 학력 정보 수정
        void updateEducation(EducationHistory educationHistory);

        // 학력 정보 조회
        EducationHistory getEducationHistoryByResumeId(int resumeId);

        // 경력 정보 수정
        void updateCareer(CareerHistory careerHistory);

        // 경력 정보 조회
        List<CareerHistory> getCareerHistoryByResumeId(int resumeId);

        //경력 삭제
        int deleteCareer(Integer careerId, int resumeId);


        List<ResumeSummary> getAllResumeSummaries();
}
