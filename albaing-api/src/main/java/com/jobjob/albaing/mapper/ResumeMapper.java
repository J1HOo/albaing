package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ResumeMapper {

    //user 정보 불러오기 - 사진,이름,생년월일,이메일, 프로필이미지
    User getUserById(int userId);


    //이력서 조회
    Resume resumeDetails(int resumeId);

    //내 정보 수정
    void updateUser(int userId, String userEmail, String userAddress, String userProfileImage);
    //이력서 수정
    void updateResumes(ResumeUpdateRequest resumeUpdateRequest);
    void updateResume(Resume resume);
    void updateEducation(EducationHistory educationHistory);
    void updateCareer(CareerHistory careerHistory);

    //사용자 회원가입시 이력서 자동 생성
    void createResumeForUser(Resume resume);

    // 기본 학력 정보 생성
    void createDefaultEducation(EducationHistory educationHistory);

    // 기본 경력 정보 생성
    void createDefaultCareer(CareerHistory careerHistory);




}
