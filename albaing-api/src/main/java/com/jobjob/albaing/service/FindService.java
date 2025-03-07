package com.jobjob.albaing.service;

public interface FindService {

    // 유저 이메일 찾기
    String findEmail(String userName, String userPhone);

    // 유저 비밀번호 찾기
    String findPassword(String userEmail, String userPhone);

}
