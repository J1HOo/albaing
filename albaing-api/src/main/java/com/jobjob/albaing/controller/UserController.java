package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.ResumeServiceImpl;
import com.jobjob.albaing.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private ResumeServiceImpl resumeService;


    // 마이페이지 - 사용자 정보 조회
    @GetMapping("/{userId}")
    public User getUserById(@PathVariable int userId) {
        return userService.getUserById(userId);
    }


    // 사용자 정보 및 프로필 이미지 수정
    @PutMapping("/update/{userId}")
    public ResponseEntity<String> updateUser(
            @PathVariable int userId,
            @RequestPart("user") User user,
            @RequestPart(value = "userProfileImage", required = false) MultipartFile userProfileImage) {

        // 사용자 정보 및 프로필 이미지 수정
        userService.updateUser(user, userProfileImage);

        return ResponseEntity.ok("사용자 정보가 성공적으로 업데이트되었습니다.");
    }
}
