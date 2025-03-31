
package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.mapper.ResumeMapper;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    private ResumeMapper resumeMapper;

    @Autowired
    private UserMapper userMapper;

    // 회원가입 시 이력서 생성
    @Override
    public void createResumeForUser(User user) {
        // userId가 null인 경우 이메일로 사용자 정보 조회
        User targetUser = user;
        if (user.getUserId() == null) {
            targetUser = userMapper.getUserByEmail(user.getUserEmail());

            // 사용자 정보를 찾을 수 없으면 종료
            if (targetUser == null || targetUser.getUserId() == null) {
                return;
            }
        }

        Resume existingResume = resumeMapper.getResumeByUserId(targetUser.getUserId().intValue());
        if (existingResume != null) {
            return;
        }

        Resume resume = new Resume();
        resume.setUserId(targetUser.getUserId().intValue());
        resume.setResumeTitle(targetUser.getUserName() + "의 이력서");
        resume.setResumeLocation("");
        resume.setResumeJobCategory("서비스");
        resume.setResumeJobType("알바");
        resume.setResumeJobDuration("무관");
        resume.setResumeWorkSchedule("무관");
        resume.setResumeWorkTime("무관");
        resume.setResumeJobSkill("");
        resume.setResumeIntroduction("");

        resumeMapper.createResumeForUser(resume);

        int resumeId = resume.getResumeId();

        EducationHistory educationHistory = new EducationHistory();
        educationHistory.setResumeId(resumeId);
        educationHistory.setEduDegree("");
        educationHistory.setEduStatus("졸업");
        educationHistory.setEduSchool("");
        educationHistory.setEduMajor("");
        educationHistory.setEduAdmissionYear("");
        educationHistory.setEduGraduationYear("");
        resumeMapper.createDefaultEducation(educationHistory);

        CareerHistory careerHistory = new CareerHistory();
        careerHistory.setResumeId(resumeId);
        careerHistory.setCareerCompanyName("");
        careerHistory.setCareerJoinDate("");
        careerHistory.setCareerQuitDate("");
        careerHistory.setCareerJobDescription("");
        careerHistory.setCareerIsCareer("신입");
        resumeMapper.createDefaultCareer(careerHistory);
    }



    // 이력서 상세 조회
    @Override
    public Resume resumeDetails(int resumeId) {
        return resumeMapper.resumeDetails(resumeId);
    }

    @Override
    public void updateResume(ResumeUpdateRequest resumeUpdateRequest) {
        try {
            // 이력서 기본 정보 업데이트
            if (resumeUpdateRequest.getResume() != null) {
                resumeMapper.updateResume(resumeUpdateRequest);
            }

            // 학력 정보 업데이트
            if (resumeUpdateRequest.getEducationHistory() != null) {
                EducationHistory existingEdu = resumeMapper.getEducationHistoryByResumeId(resumeUpdateRequest.getResume().getResumeId());

                if (existingEdu != null) {
                    resumeMapper.updateEducation(resumeUpdateRequest);
                } else {
                    resumeUpdateRequest.getEducationHistory().setResumeId(resumeUpdateRequest.getResume().getResumeId());
                    resumeMapper.createDefaultEducation(resumeUpdateRequest.getEducationHistory());
                }
            }

            // 경력 정보 업데이트
            if (resumeUpdateRequest.getCareerHistory() != null) {
                CareerHistory existingCareer = resumeMapper.getCareerHistoryByResumeId(resumeUpdateRequest.getResume().getResumeId());

                if (existingCareer != null) {
                    resumeMapper.updateCareer(resumeUpdateRequest);
                } else {
                    resumeUpdateRequest.getCareerHistory().setResumeId(resumeUpdateRequest.getResume().getResumeId());
                    resumeMapper.createDefaultCareer(resumeUpdateRequest.getCareerHistory());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("이력서 수정 중 오류가 발생했습니다.", e);
        }
    }

    // 이력서 조회(유저 아이디로)
    @Override
    public Resume getResumeByUserId(int userId) {
        return resumeMapper.getResumeByUserId(userId);
    }

    @Override
    public List<ResumeSummary> getAllResumeSummaries() {
        return resumeMapper.getAllResumeSummaries();
    }
}
