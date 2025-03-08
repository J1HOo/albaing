package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.Date;
import java.util.Map;


@Mapper
public interface UserMapper {


    // 유저 회원가입 (INSERT)
    void registerUser(User user);

    // 유저 로그인
    User loginUser(Map<String, Object> param);

    // 유저 존재여부 확인
    boolean isUserExist(String email);

    // 유저 전화번호 중복체크
    boolean isUserPhoneExist(String email);

    // 마이페이지- 사용자 정보 조회
    User getUserById(int userId);

    User getUserByEmail(String email);

    // 마이페이지 - 사용자 정보 수정
    void updateUser(int userId, User.Gender userGender, Date userBirthdate, String userAddress, String userProfileImage);


}
