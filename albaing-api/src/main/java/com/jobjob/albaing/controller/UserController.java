package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Review;
import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.FileService;
import com.jobjob.albaing.service.FileServiceImpl;
import com.jobjob.albaing.service.ResumeServiceImpl;
import com.jobjob.albaing.service.ReviewServiceImpl;
import com.jobjob.albaing.service.UserServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private ResumeServiceImpl resumeService;
    @Autowired
    private ReviewServiceImpl reviewService;

    @Autowired
    private FileService fileService;

    private boolean isAdmin() {
        HttpSession session = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest().getSession();
        User user = (User) session.getAttribute("userSession");
        return user != null && user.getUserIsAdmin() != null && user.getUserIsAdmin();
    }

    // 마이페이지 - 사용자 정보 조회
    @GetMapping("/{userId}")
    public User getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    // 마이페이지 - 사용자 정보 수정
    @PutMapping(value = "/update/{userId}", consumes = {"multipart/form-data", "application/json"})
    public ResponseEntity<?> updateUser(
            @PathVariable Long userId,
            @RequestPart(value = "user", required = false) User user,
            @RequestPart(value = "userProfileImage", required = false) MultipartFile userProfileImage
    ) {
        try {
            // 기존 정보 업데이트
            if (user != null) {
                user.setUserId(userId);

                // 로고 업로드가 있는 경우
                if (userProfileImage != null && !userProfileImage.isEmpty()) {
                    // 파일 크기 제한 (5MB)
                    if (userProfileImage.getSize() > 5 * 1024 * 1024) {
                        return ResponseEntity.badRequest().body("로고 파일 크기는 5MB를 초과할 수 없습니다.");
                    }

                    // 파일 타입 검증
                    String contentType = userProfileImage.getContentType();
                    if (contentType == null || !contentType.startsWith("image/")) {
                        return ResponseEntity.badRequest().body("이미지 파일만 업로드 가능합니다.");
                    }

                    // 파일 업로드 및 URL 생성
                    String logoUrl = fileService.uploadFile(userProfileImage);
                    user.setUserProfileImage(logoUrl);
                }

                userService.updateUser(user);
            }

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("회사 정보 업데이트 중 오류 발생: " + e.getMessage());
        }
    }

    // 내가 작성한 리뷰 목록 조회
    @GetMapping("/user/{userId}/reviews")
    public List<Review> getUserReviews(@PathVariable long userId) {
        List<Review> reviews = reviewService.getReviewsByUser(userId);
        System.out.println("Fetched reviews for user " + userId + ": " + reviews);
        return reviews;
    }

    // 내가 작성한 댓글 목록 조회
    @GetMapping("/user/{userId}/comments")
    public List<Comment> getUserComments(@PathVariable long userId) {
        List<Comment> comments = reviewService.getCommentsByUser(userId);
        System.out.println("Fetched comments for user " + userId + ": " + comments);
        return comments;
    }

    // 내가 작성한 리뷰 삭제
    @DeleteMapping("/user/{userId}/reviews/{reviewId}")
    public void deleteUserReview(@PathVariable long userId, @PathVariable long reviewId) {
        reviewService.deleteReviewByUser(reviewId, userId);
    }

    // 내가 작성한 댓글 삭제
    @DeleteMapping("/user/{userId}/comments/{commentId}")
    public void deleteUserComment(@PathVariable long userId, @PathVariable long commentId) {
        reviewService.deleteCommentByUser(commentId, userId);
    }

    @GetMapping("/api/admin/users")
    public ResponseEntity<List<User>> getAllUsers(
        @RequestParam(required = false) String userName,
        @RequestParam(required = false) String userEmail,
        @RequestParam(required = false) String userPhone,
        @RequestParam(required = false) String sortOrderBy,
        @RequestParam(required = false) Boolean isDESC
    ) {
        // 관리자 권한 확인
        if (!isAdmin()) {
            return ResponseEntity.status(403).build();
        }

        List<User> users = userService.getAllUsers(userName, userEmail, userPhone, sortOrderBy, isDESC);
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/api/admin/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        // 관리자 권한 확인
        if (!isAdmin()) {
            return ResponseEntity.status(403).build();
        }

        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }
}
