package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;

import java.util.List;

public interface ResumeService {

    //회원가입시 이력서 생성
    void createResumeForUser(User user); //user user 말고 들어가야할 값 ....?

    //user 정보 불러오기 - 사진,이름,생년월일,이메일, 프로필이미지
    User getUserById(int userId);

    //내 정보 수정
    void updateUser(int userId, String userEmail, String userAddress, String userProfileImage);

    //이력서 조회
    Resume resumeDetails(int resumeId);

    //이력서 수정
    void updateResume(ResumeUpdateRequest resumeUpdateRequest);




}
