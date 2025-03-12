package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.ResumeServiceImpl;
import com.jobjob.albaing.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

//    // 마이페이지 - 사용자 정보 수정
//    @PutMapping("/update/{userId}")
//    public void updateUser(@RequestBody User user, @PathVariable int userId) {
//        userService.updateUser(user);
//    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<String> updateUser(
            @PathVariable int userId,
            @RequestPart(value = "userProfileImage", required = false) MultipartFile file,
            @RequestPart("user") User user
    ) {
        if (file != null && !file.isEmpty()) {
            String fileName = userService.saveFile(file); // 이미지 저장 후 URL 반환
            user.setUserProfileImage(fileName);
        }

        userService.updateUser(user);
        return ResponseEntity.ok("User updated successfully.");
    }


}
