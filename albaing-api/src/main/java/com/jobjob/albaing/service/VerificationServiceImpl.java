package com.jobjob.albaing.service;

import com.jobjob.albaing.model.vo.VerificationData;
import com.jobjob.albaing.model.vo.VerificationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationServiceImpl implements VerificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    AuthServiceImpl authService;

    private final Map<String, VerificationData> verificationStore = new ConcurrentHashMap<>();

    @Override
    public String randomCode() {
        Random rand = new Random();
        int randomNum = 100000 + rand.nextInt(900000);
        return String.valueOf(randomNum);
    }

    @Override
    public void sendEmail(String email, String code) {
        // 🔹 1. 이메일 중복 체크 (DB 조회)
        if (authService.getEmailByEmail(email)) { // DB에 이미 존재하는 이메일인지 확인
            throw new IllegalArgumentException("이미 가입된 이메일입니다."); // 예외 발생
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("[알바잉] 이메일 인증번호");

            String content =
                    "<div style='margin:20px;'>" +
                            "<h2>알바잉 이메일 인증</h2>" +
                            "<p>안녕하세요! 알바잉 서비스 이용을 위한 이메일 인증번호입니다.</p>" +
                            "<div style='padding:10px; font-size:24px; font-weight:bold; background-color:#f4f4f4; border-radius:5px; display:inline-block;'>" +
                            code +
                            "</div>" +
                            "<p>인증번호는 10분간 유효합니다.</p>" +
                            "<p>감사합니다.</p>" +
                            "</div>";

            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("VerifiCationServiceImpl : 이메일 전송 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    @Override
    public void saveEmailCode(String email, String code) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수 입력 사항입니다.");
        }
        verificationStore.put(email.toLowerCase(), new VerificationData(email, code));
    }

    @Override
    public boolean verifyCodeWithVO(VerificationRequest request) {
        if (request == null || request.getEmail() == null || request.getCode() == null) {
            return false;
        }

        String email = request.getEmail().toLowerCase();
        String inputCode = request.getCode();
        VerificationData data = verificationStore.get(email);

        if (data == null) {
            return false;
        }

        if (data.isExpired()) {
            verificationStore.remove(email);
            return false;
        }

        return inputCode.equals(data.getCode());
    }

    @Override
    public void sendVerificationEmail() {
        throw new UnsupportedOperationException("특정 이메일이 지정되지 않았습니다. sendEmail(email, code) 메소드를 사용하세요.");
    }

    public void markEmailAsVerified(String email) {
        if (email == null || email.trim().isEmpty()) return;

        String lowerEmail = email.toLowerCase();
        VerificationData data = verificationStore.get(lowerEmail);

        if (data == null) {
            data = new VerificationData(lowerEmail, true);
            verificationStore.put(lowerEmail, data);
        } else {
            data.setVerified(true);
        }
    }

    public boolean isEmailVerified(String email) {
        if (email == null) return false;

        VerificationData data = verificationStore.get(email.toLowerCase());
        if (data == null) return false;

        if (data.isExpired()) {
            verificationStore.remove(email.toLowerCase());
            return false;
        }

        return data.isVerified();
    }

    public void removeEmailVerification(String email) {
        if (email != null) {
            verificationStore.remove(email.toLowerCase());
        }
    }
}
