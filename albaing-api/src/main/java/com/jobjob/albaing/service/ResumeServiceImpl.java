
package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.mapper.ResumeMapper;
import com.jobjob.albaing.mapper.UserMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    //아력서 수정
    @Override
    public void updateResume(ResumeUpdateRequest resumeUpdateRequest) {
        try {
            if (resumeUpdateRequest.getResume() != null) {
                resumeMapper.updateResume(resumeUpdateRequest.getResume());
            }

            if (resumeUpdateRequest.getEducationHistory() != null) {
                EducationHistory existingEdu = resumeMapper.getEducationHistoryByResumeId(resumeUpdateRequest.getResume().getResumeId());

                if (existingEdu != null) {
                    resumeUpdateRequest.getEducationHistory().setResumeId(resumeUpdateRequest.getResume().getResumeId());
                    resumeMapper.updateEducation(resumeUpdateRequest.getEducationHistory());
                } else {
                    resumeUpdateRequest.getEducationHistory().setResumeId(resumeUpdateRequest.getResume().getResumeId());
                    resumeMapper.createDefaultEducation(resumeUpdateRequest.getEducationHistory());
                }
            }

            if (resumeUpdateRequest.getCareerHistory() != null && !resumeUpdateRequest.getCareerHistory().isEmpty()) {
                int resumeId = resumeUpdateRequest.getResume().getResumeId();

                boolean isNewbieMode = false;
                for (CareerHistory career : resumeUpdateRequest.getCareerHistory()) {
                    if ("신입".equals(career.getCareerIsCareer())) {
                        isNewbieMode = true;
                        break;
                    }
                }

                List<CareerHistory> existingCareers = resumeMapper.getCareerHistoryByResumeId(resumeId);

                if (isNewbieMode) {
                    for (CareerHistory career : existingCareers) {
                        if (career.getCareerId() != null) {
                            resumeMapper.deleteCareer(career.getCareerId(), resumeId);
                        }
                    }

                    CareerHistory newbieCareer = null;
                    for (CareerHistory career : resumeUpdateRequest.getCareerHistory()) {
                        if ("신입".equals(career.getCareerIsCareer())) {
                            newbieCareer = career;
                            break;
                        }
                    }

                    if (newbieCareer != null) {
                        newbieCareer.setResumeId(resumeId);
                        newbieCareer.setCareerId(null);
                        resumeMapper.createDefaultCareer(newbieCareer);
                    }
                } else {
                    Map<Integer, CareerHistory> existingCareerMap = new HashMap<>();
                    for (CareerHistory career : existingCareers) {
                        if (career.getCareerId() != null) {
                            existingCareerMap.put(career.getCareerId(), career);
                        }
                    }

                    for (CareerHistory career : resumeUpdateRequest.getCareerHistory()) {
                        if (!"신입".equals(career.getCareerIsCareer())) {
                            career.setResumeId(resumeId);

                            if (career.getCareerId() == null || career.getCareerId() == 0) {
                                resumeMapper.createDefaultCareer(career);
                            } else if (existingCareerMap.containsKey(career.getCareerId())) {
                                resumeMapper.updateCareer(career);
                                existingCareerMap.remove(career.getCareerId());
                            } else {
                                career.setCareerId(null);
                                resumeMapper.createDefaultCareer(career);
                            }
                        }
                    }

                    for (Integer careerId : existingCareerMap.keySet()) {
                        resumeMapper.deleteCareer(careerId, resumeId);
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("이력서 수정 중 오류가 발생했습니다.", e);
        }
    }

    // 이력서 조회(유저 아이디로)
    /*
    @Override
    public Resume getResumeByUserId(int userId) {
        return resumeMapper.getResumeByUserId(userId);
    }
     */
    @Override
    public Resume getResumeByUserId(int userId) {
        Resume resume = resumeMapper.getResumeBasicByUserId(userId);

        if (resume != null) {
            EducationHistory edu = resumeMapper.getEducationHistoryByResumeId(resume.getResumeId());
            resume.setEducationHistory(edu);

            List<CareerHistory> careers = resumeMapper.getCareerHistoryByResumeId(resume.getResumeId());
            resume.setCareerHistory(careers);
        }

        return resume;
    }

    @Override
    public int deleteCareer(Integer careerId, int resumeId) {
        // 삭제 전 검증 로직 추가
        // 예: 해당 careerId가 존재하는지, 사용자가 이 경력 정보에 접근 권한이 있는지 등
        int existCareer = resumeMapper.deleteCareer(careerId,resumeId);
        if (existCareer == 0) {
            throw new EntityNotFoundException("해당 경력 정보를 찾을 수 없습니다: " + careerId);
        } else {
            return existCareer;
        }
    }


    @Override
    public List<ResumeSummary> getAllResumeSummaries() {
        return resumeMapper.getAllResumeSummaries();
    }
}
