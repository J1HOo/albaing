package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;

import java.util.Map;

public interface AuthService {

    /**
     * ✅ 유저 로그인
     * @param userEmail    유저 이메일
     * @param userPassword 유저 비밀번호
     * @return 로그인 결과 (성공 시 유저 정보 포함)
     */
    Map<String, Object> loginUser(String userEmail, String userPassword);

    /**
     * ✅ 기업 로그인
     * @param companyEmail    기업 이메일
     * @param companyPassword 기업 비밀번호
     * @return 로그인 결과 (성공 시 기업 정보 포함)
     */
    Map<String, Object> loginCompany(String companyEmail, String companyPassword);

    /**
     * ✅ 유저 회원가입
     * @param user 회원가입할 유저 객체
     */
    public Map<String, Object> registerUser(User user);
    /**
     * ✅ 기업 회원가입
     * @param company 회원가입할 기업 객체
     */
    void registerCompany(Company company);

    boolean isUserExist(String email);

    User getUserByEmail(String email);

    boolean getEmailByEmail(String email);
}
