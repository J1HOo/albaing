package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.model.vo.VerificationRequest;
import com.jobjob.albaing.service.AuthService;
import com.jobjob.albaing.service.VerificationService;
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
    private AuthService authService;

    @Autowired
    private VerificationServiceImpl verificationService;


    @PostMapping("/register/person")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User user) {
        System.out.println("🚀 회원가입 요청: " + user);

        // 📌 AuthService에서 회원가입 처리 (이메일 인증 포함)
        Map<String, Object> response = authService.registerUser(user);

        if ("success".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else if ("fail".equals(response.get("status"))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/login/person")
    public ResponseEntity<Map<String, Object>> loginPerson(@RequestBody User user, HttpSession session) {
        Map<String, Object> result = authService.loginUser(user.getUserEmail(), user.getUserPassword());

        if ("success".equals(result.get("status"))) {
            session.setAttribute("userSession", result.get("user"));
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }


    @PostMapping("/register/company")
    public ResponseEntity<Map<String, Object>> registerCompany(@RequestBody Company company) {
        Map<String, Object> response = new HashMap<>();

        try {
            authService.registerCompany(company);
            response.put("status", "success");
            response.put("message", "기업 회원가입이 성공적으로 완료되었습니다.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "fail");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "기업 회원가입 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/login/company")
    public ResponseEntity<Map<String, Object>> loginCompany(@RequestBody Company company, HttpSession session) {
        Map<String, Object> result = authService.loginCompany(company.getCompanyEmail(), company.getCompanyPassword());

        if ("success".equals(result.get("status"))) {
            session.setAttribute("companySession", result.get("company"));
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }


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
    /**************************** 이메일 인증 ***********************************/
    @PostMapping("/sendCode")
    public ResponseEntity<Map<String, Object>> sendCode(@RequestBody VerificationRequest vr) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = vr.getEmail();
            String code = verificationService.randomCode();

            verificationService.saveEmailCode(email, code);
            verificationService.sendEmail(email, code);

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

        boolean isValid = verificationService.verifyCodeWithVO(vr);

        if (isValid) {
            verificationService.markEmailAsVerified(vr.getEmail());

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
