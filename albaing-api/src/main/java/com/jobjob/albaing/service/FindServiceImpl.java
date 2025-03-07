package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.mapper.CompanyMapper;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FindServiceImpl implements FindService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CompanyMapper companyMapper;

    @Override
    public String findEmail(String userName, String password) {
        User user = userMapper.findEmailByUserNameAndUserPhone(userName, password);
        if (user == null) {
            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");
        }
        return User.getUserEmail();
    }

    @Override
    public String findPassword(String email, String phoneNumber) {
        User user = userMapper.findPasswordByUserNameAndUserPassword(email, phoneNumber);
        if (user == null) {
            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");
        }
        return User.getUserPassword();
    }
}
