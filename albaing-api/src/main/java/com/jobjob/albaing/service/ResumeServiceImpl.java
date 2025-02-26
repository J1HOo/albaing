package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.mapper.ResumeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    private ResumeMapper resumeMapper;

    // 회원가입시 이력서 생성
    @Override
    @Transactional
    public void createResumeForUser(User user){
//        // 이미 존재하는 이력서가 있는지 확인
//        Resume existingResume = resumeMapper.getResumeByUserId(user.getUserId());
//        if (existingResume != null) {
//// 이미 존재하는 경우 더 이상 생성하지 않음
//            return;
//        }

            // 1. 이력서 기본 정보 생성
            Resume resume = new Resume();
            resume.setUserId(Math.toIntExact(user.getUserId()));  // 이미 userId는 존재
            resume.setResumeTitle(user.getUserName() + "의 이력서");
        // User 테이블의 정보 그대로 반영
        resume.setResumeLocation(user.getUserAddress());

// 나머지 기본값
        resume.setResumeJobCategory(Resume.JobCategory.외식_음료);
        resume.setResumeJobType(Resume.ResumeJobType.정규직);
        resume.setResumeJobDuration(Resume.JobDuration.무관);
        resume.setResumeWorkSchedule(Resume.workSchedule.무관);
        resume.setResumeWorkTime(Resume.WorkTime.무관);
        resume.setResumeJobSkill("");
        resume.setResumeIntroduction("");

// 이력서 저장
        resumeMapper.createResumeForUser(resume);

// 이력서 ID 획득
        int resumeId = resume.getResumeId();

// 기본 학력 정보 생성
        EducationHistory educationHistory = new EducationHistory();
        educationHistory.setResumeId(resumeId);
        educationHistory.setEduDegree("");
        educationHistory.setEduStatus(EducationHistory.eduStatus.재학중);
        educationHistory.setEduSchool("");
        educationHistory.setEduMajor("");
        educationHistory.setEduAdmissionYear("");
        educationHistory.setEduGraduationYear("");
        resumeMapper.createDefaultEducation(educationHistory);

// 기본 경력 정보 생성
        CareerHistory careerHistory = new CareerHistory();
        careerHistory.setResumeId(resumeId);
        careerHistory.setCareerCompanyName("");
        careerHistory.setCareerJoinDate("");
        careerHistory.setCareerQuitDate("");
        careerHistory.setCareerJobDescription("");
        careerHistory.setCareerIsCareer(CareerHistory.careerHistoryType.신입);
        resumeMapper.createDefaultCareer(careerHistory);


    }

    //user 정보 불러오기 - 사진,이름,생년월일,이메일, 프로필이미지
    @Override
    public User getUserById(int userId) {
        return resumeMapper.getUserById(userId);
    }

    //내 정보 수정
    @Override
    public void updateUser(int userId,String userEmail, String userAddress, String userProfileImage) {
        resumeMapper.updateUser(userId, userEmail, userAddress, userProfileImage);
    }

    @Override
    public void updateResumes(ResumeUpdateRequest resumeUpdateRequest) {
        resumeMapper.updateResumes(resumeUpdateRequest);
    }

    //이력서 수정
    @Override
    public void updateResume(Resume resume) {
        resumeMapper.updateResume(resume);
    }
    @Override
    public void updateEducation(EducationHistory educationHistory) {
        resumeMapper.updateEducation(educationHistory);
    }
    @Override
    public void updateCareer(CareerHistory careerHistory) {
        resumeMapper.updateCareer(careerHistory);
    }

    //이력서 조회
    @Override
    public Resume resumeDetails(int resumeId) {
        return resumeMapper.resumeDetails(resumeId);
    }





}
