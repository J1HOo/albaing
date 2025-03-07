package com.jobjob.albaing.service;

import com.jobjob.albaing.model.vo.VerificationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationServiceImpl implements VerificationService {

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, VerificationData> verificationStore = new ConcurrentHashMap<>();

    private static class VerificationData {
        private final String code;
        private final LocalDateTime expiryTime;
        private boolean verified;

        public VerificationData(String code) {
            this.code = code;
            // 인증 코드 10분 유효
            this.expiryTime = LocalDateTime.now().plusMinutes(10);
            this.verified = false;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiryTime);
        }
    }

    @Override
    public String randomCode() {
        Random rand = new Random();
        int randomNum = 100000 + rand.nextInt(900000);
        return String.valueOf(randomNum);
    }

    @Override
    public void sendEmail(String email, String code) {
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
            throw new RuntimeException("이메일 전송 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    @Override
    public void saveEmailCode(String email, String code) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수 입력 사항입니다.");
        }
        verificationStore.put(email.toLowerCase(), new VerificationData(code));
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

        return inputCode.equals(data.code);
    }

    @Override
    public void sendVerificationEmail() {
        throw new UnsupportedOperationException("특정 이메일이 지정되지 않았습니다. sendEmail(email, code) 메소드를 사용하세요.");
    }

    // 이메일을 인증 완료 상태로 표시
    public void markEmailAsVerified(String email) {
        if (email == null) return;

        VerificationData data = verificationStore.get(email.toLowerCase());
        if (data != null) {
            System.out.println(data);
            data.verified = true;
        }
    }

    // 이메일이 인증되었는지 확인
    public boolean isEmailVerified(String email) {
        if (email == null) return false;

        VerificationData data = verificationStore.get(email.toLowerCase());
        if (data == null) return false;

        if (data.isExpired()) {
            verificationStore.remove(email.toLowerCase());
            return false;
        }

        return data.verified;
    }

    // 이메일 인증 정보 삭제 (회원가입 완료 후)
    public void removeEmailVerification(String email) {
        if (email != null) {
            verificationStore.remove(email.toLowerCase());
        }
    }
}