package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.model.vo.VerificationRequest;
import com.jobjob.albaing.service.AuthServiceImpl;
import com.jobjob.albaing.service.VerificationServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthServiceImpl authService;

    @Autowired
    private VerificationServiceImpl verificationServiceImpl;

    // 유저 로그인
    @PostMapping("/login/person")
    public ResponseEntity<Map<String, Object>> loginPerson(@RequestBody User user, HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> loginResult = authService.loginUser(user.getUserEmail(), user.getUserPassword());

            if ("success".equals(loginResult.get("status"))) {
                User loggedInUser = (User) loginResult.get("user");
                session.setAttribute("userSession", loggedInUser);

                response.put("status", "success");
                response.put("user", loggedInUser);
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "fail");
                response.put("message", loginResult.get("message"));
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "로그인 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 기업 로그인
    @PostMapping("/login/company")
    public ResponseEntity<Map<String, Object>> loginCompany(@RequestBody Company company, HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> loginResult = authService.loginCompany(company.getCompanyEmail(), company.getCompanyPassword());

            if ("success".equals(loginResult.get("status"))) {
                Company loggedInCompany = (Company) loginResult.get("company");
                session.setAttribute("companySession", loggedInCompany);

                response.put("status", "success");
                response.put("company", loggedInCompany);
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "fail");
                response.put("message", loginResult.get("message"));
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "로그인 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 계정 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        session.invalidate();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "logout");
        response.put("message", "로그아웃 되었습니다.");
        return ResponseEntity.ok(response);
    }

    // 계정 로그인 상태확인 (세션)
    @GetMapping("/checkLogin")
    public ResponseEntity<?> checkLogin(HttpSession session) {
        User loginUser = (User) session.getAttribute("userSession");
        Company loginCompany = (Company) session.getAttribute("companySession");

        if (loginUser != null) {
            return ResponseEntity.ok(loginUser);
        } else if (loginCompany != null) {
            return ResponseEntity.ok(loginCompany);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인 상태가 아닙니다."));
        }
    }

    // 유저 회원가입
    @PostMapping("/register/person")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        boolean isVerified = verificationServiceImpl.isEmailVerified(user.getUserEmail());
        if (!isVerified) {
            response.put("status", "fail");
            response.put("message", "AuthController : registerUser : 이메일 인증이 완료되지 않았습니다. 인증을 먼저 완료해주세요.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            authService.registerUser(user);

            response.put("status", "success");
            response.put("message", "회원가입이 성공적으로 완료되었습니다.");

            verificationServiceImpl.removeEmailVerification(user.getUserEmail());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "fail");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "회원가입 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 기업 회원가입
    @PostMapping("/register/company")
    public ResponseEntity<Map<String, Object>> registerCompany(@RequestBody Company company) {
        Map<String, Object> response = new HashMap<>();

        boolean isVerified = verificationServiceImpl.isEmailVerified(company.getCompanyEmail());
        if (!isVerified) {
            response.put("status", "fail");
            response.put("message", "이메일 인증이 완료되지 않았습니다. 인증을 먼저 완료해주세요.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            authService.registerCompany(company);

            response.put("status", "success");
            response.put("message", "회원가입이 성공적으로 완료되었습니다.");

            verificationServiceImpl.removeEmailVerification(company.getCompanyEmail());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "fail");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "회원가입 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**************************** 이메일 인증 ***********************************/
    @PostMapping("/sendCode")
    public ResponseEntity<Map<String, Object>> sendCode(@RequestBody VerificationRequest vr) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = vr.getEmail();
            String code = verificationServiceImpl.randomCode();

            verificationServiceImpl.saveEmailCode(email, code);
            verificationServiceImpl.sendEmail(email, code);

            response.put("status", "success");
            response.put("message", "이메일을 성공적으로 보냈습니다: " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "이메일 전송 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 인증번호 일치여부 확인 및 이메일 인증 처리
    @PostMapping("/checkCode")
    public ResponseEntity<Map<String, Object>> checkCode(@RequestBody VerificationRequest vr) {
        Map<String, Object> response = new HashMap<>();

        boolean isValid = verificationServiceImpl.verifyCodeWithVO(vr);

        if (isValid) {
            verificationServiceImpl.markEmailAsVerified(vr.getEmail());

            response.put("status", "success");
            response.put("message", "인증번호가 일치합니다.");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "fail");
            response.put("message", "인증번호가 일치하지 않습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}