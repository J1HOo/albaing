package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.CareerHistory;
import com.jobjob.albaing.dto.EducationHistory;
import com.jobjob.albaing.dto.Resume;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.mapper.ResumeMapper;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.UUID;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserMapper userMapper;

    // 파일 저장 경로 설정 (실제 환경에 맞게 수정 필요)
    @Value("${file.upload.path:/uploads/profiles}")
    private String uploadPath;

    // 사용자 정보 조회
    @Override
    public User getUserById(int userId) {
        return userMapper.getUserById(userId);
    }

    // 사용자 정보 조회
    @Override
    public User getUserByEmail(String userEmail) {
        return userMapper.getUserByEmail(userEmail);
    }

    // 사용자 정보 및 프로필 이미지 수정
    @Override
    @Transactional
    public void updateUser(User user, MultipartFile file) {
        try {
            if (file != null && !file.isEmpty()) {
                String imageUrl = uploadProfileImage(user.getUserId(), file);
                user.setUserProfileImage(imageUrl);
            }

            // 사용자 정보 업데이트
            userMapper.updateUser(user);
        } catch (IOException e) {
            throw new RuntimeException("프로필 이미지 업로드 중 오류가 발생했습니다.", e);
        } catch (Exception e) {
            throw new RuntimeException("사용자 정보 업데이트 중 오류가 발생했습니다.", e);
        }
    }

    // 프로필 이미지 업로드 메서드
    private String uploadProfileImage(Long userId, MultipartFile file) throws IOException {
        // 업로드 디렉토리 생성
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // 파일명 중복 방지를 위한 UUID 생성
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = userId + "_" + UUID.randomUUID().toString() + extension;

        // 파일 저장 경로
        String filePath = uploadPath + File.separator + fileName;
        File dest = new File(filePath);

        // 파일 저장
        file.transferTo(dest);

        // 웹에서 접근 가능한 URL 생성 (서버 설정에 맞게 조정 필요)
        String userHome = System.getProperty("user.home"); // 현재 사용자 홈 디렉토리 가져오기
        String filePath = userHome + "/Desktop/images/profiles/" + fileName; // 바탕화면 경로
        String fileUrl = "/images/profiles/" + fileName;

        return fileUrl;
    }

}
