package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.ResumeServiceImpl;
import com.jobjob.albaing.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private ResumeServiceImpl resumeService;



    // 마이페이지 - 사용자 정보 조회
    @GetMapping("/user/{userId}")
    public User getUserById(@PathVariable int userId) {
        return userService.getUserById(userId);
    }

    // 마이페이지 - 사용자 정보 수정
    @PutMapping("/user/update/{userId}")
    public void updateUser(@PathVariable int userId,
                           @RequestParam("userGender") User.Gender userGender,
                           @RequestParam("userBirthdate") Date userBirthdate,
                           @RequestParam("userAddress") String userAddress,
                           @RequestParam("userProfileImage") String userProfileImage) {
        userService.updateUser(userId,userGender,userBirthdate,userAddress,userProfileImage);
    }

}
