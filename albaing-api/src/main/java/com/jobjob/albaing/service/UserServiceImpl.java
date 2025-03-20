package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.CareerHistory;
import com.jobjob.albaing.dto.EducationHistory;
import com.jobjob.albaing.dto.Resume;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.mapper.ResumeMapper;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserMapper userMapper;


    // 사용자 정보 조회
    @Override
    public User getUserById(Long userId) {
        return userMapper.getUserById(userId);
    }

    // 사용자 정보 조회
    @Override
    public User getUserByEmail(String userEmail) {
        return userMapper.getUserByEmail(userEmail);
    }

    // 사용자 정보 수정
    @Override
    public void updateUser(User user) {
        userMapper.updateUser(user);
    }

}
