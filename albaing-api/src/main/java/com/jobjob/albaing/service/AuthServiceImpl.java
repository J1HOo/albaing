package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.mapper.CompanyMapper;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CompanyMapper companyMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private VerificationServiceImpl verificationService;

    // 유저 로그인
    @Override
    public Map<String, Object> loginUser(String userEmail, String userPassword) {
        Map<String, Object> result = new HashMap<>();

        try {
            Map<String, Object> param = new HashMap<>();
            param.put("userEmail", userEmail);

            User loggedInUser = userMapper.loginUser(param);

            // 사용자가 존재하지 않는 경우
            if (loggedInUser == null) {
                result.put("status", "fail");
                result.put("message", "존재하지 않는 사용자입니다.");
                return result;
            }

            boolean matches = passwordEncoder.matches(userPassword, loggedInUser.getUserPassword());

            if (matches) {
                result.put("status", "success");
                result.put("user", loggedInUser);
            } else {
                result.put("status", "fail");
                result.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "로그인 중 오류가 발생했습니다: " + e.getMessage());
        }

        return result;
    }

    // 기업 로그인
    @Override
    public Map<String, Object> loginCompany(String companyEmail, String companyPassword) {
        Map<String, Object> result = new HashMap<>();

        try {
            Map<String, Object> param = new HashMap<>();
            param.put("companyEmail", companyEmail);

            Company loggedInCompany = companyMapper.loginCompany(param);

            if (loggedInCompany == null) {
                result.put("status", "fail");
                result.put("message", "존재하지 않는 기업 계정입니다.");
                return result;
            }



            boolean matches = passwordEncoder.matches(companyPassword, loggedInCompany.getCompanyPassword());

            if (matches) {
                result.put("status", "success");
                result.put("company", loggedInCompany);
            } else {
                result.put("status", "fail");
                result.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "로그인 중 오류가 발생했습니다: " + e.getMessage());
        }

        return result;
    }

    // 유저 회원가입
    @Override
    public void registerUser(User user) {
        if (!verificationService.isEmailVerified(user.getUserEmail())) {
            throw new IllegalArgumentException("AuthServiceImpl : 이메일 인증이 완료되지 않았습니다.");
        }

        validateUserInput(user);

        String encodedPassword = passwordEncoder.encode(user.getUserPassword());
        user.setUserPassword(encodedPassword);

        LocalDateTime now = LocalDateTime.now();
        user.setUserCreatedAt(now);
        user.setUserUpdatedAt(now);

        if (user.getUserIsAdmin() == null) {
            user.setUserIsAdmin(false);
        }

        userMapper.registerUser(user);
    }

    // 기업 회원가입
    @Override
    public void registerCompany(Company company) {
        if (!verificationService.isEmailVerified(company.getCompanyEmail())) {
            throw new IllegalArgumentException("이메일 인증이 완료되지 않았습니다.");
        }

        validateCompanyInput(company);

        String encodedPassword = passwordEncoder.encode(company.getCompanyPassword());
        company.setCompanyPassword(encodedPassword);

        LocalDateTime now = LocalDateTime.now();
        company.setCompanyCreatedAt(now);
        company.setCompanyUpdatedAt(now);

        if (company.getCompanyApprovalStatus() == null) {
            company.setCompanyApprovalStatus(Company.ApprovalStatus.approving);
        }

        companyMapper.registerCompany(company);
    }

    // 유저 입력값 검증
    private void validateUserInput(User user) {
        if (user.getUserEmail() == null || user.getUserEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수 입력 사항입니다.");
        }
        if (user.getUserPassword() == null || user.getUserPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수 입력 사항입니다.");
        }
        if (user.getUserName() == null || user.getUserName().trim().isEmpty()) {
            throw new IllegalArgumentException("이름은 필수 입력 사항입니다.");
        }

        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        if (!user.getUserEmail().matches(emailRegex)) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }

        String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$";
        if (!user.getUserPassword().matches(passwordRegex)) {
            throw new IllegalArgumentException("비밀번호는 최소 8자 이상이며, 숫자와 특수문자를 포함해야 합니다.");
        }

        String nameRegex = "^[가-힣]{2,}$";
        if (!user.getUserName().matches(nameRegex)) {
            throw new IllegalArgumentException("이름은 최소 2자 이상 한글이어야 합니다.");
        }

        if (user.getUserBirthdate() != null && user.getUserBirthdate().after(new Date())) {
            throw new IllegalArgumentException("생년월일은 미래 날짜일 수 없습니다.");
        }

        String phoneRegex = "^01[016789]-?\\d{3,4}-?\\d{4,}$";
        if (!user.getUserPhone().matches(phoneRegex)) {
            throw new IllegalArgumentException("유효하지 않은 전화번호 형식입니다.");
        }
    }

    // 기업 입력값 검증
    private void validateCompanyInput(Company company) {
        if (company.getCompanyRegistrationNumber() == null || company.getCompanyRegistrationNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("사업자 등록번호는 필수 입력 사항입니다.");
        }
        if (company.getCompanyEmail() == null || company.getCompanyEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수 입력 사항입니다.");
        }
        if (company.getCompanyPassword() == null || company.getCompanyPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수 입력 사항입니다.");
        }
        if (company.getCompanyOwnerName() == null || company.getCompanyOwnerName().trim().isEmpty()) {
            throw new IllegalArgumentException("대표자 이름은 필수 입력 사항입니다.");
        }
        if (company.getCompanyName() == null || company.getCompanyName().trim().isEmpty()) {
            throw new IllegalArgumentException("상호명은 필수 입력 사항입니다.");
        }
        if (company.getCompanyOpenDate() == null) {
            throw new IllegalArgumentException("개업일은 필수 입력 사항입니다.");
        }
        if (company.getCompanyLocalAddress() == null || company.getCompanyLocalAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("사업장 주소는 필수 입력 사항입니다.");
        }

        // 사업자 등록번호 형식 검증
        String registrationNumberRegex = "^\\d{3}-\\d{2}-\\d{5}$";
        if (!company.getCompanyRegistrationNumber().matches(registrationNumberRegex)) {
            throw new IllegalArgumentException("유효하지 않은 사업자 등록번호 형식입니다. (예: 123-45-67890)");
        }

        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        if (!company.getCompanyEmail().matches(emailRegex)) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }

        String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$";
        if (!company.getCompanyPassword().matches(passwordRegex)) {
            throw new IllegalArgumentException("비밀번호는 최소 8자 이상이며, 숫자와 특수문자를 포함해야 합니다.");
        }

        String nameRegex = "^[가-힣]{2,}$";
        if (!company.getCompanyOwnerName().matches(nameRegex)) {
            throw new IllegalArgumentException("대표자 이름은 최소 2자 이상 한글이어야 합니다.");
        }

        Date today = new Date();
        if (company.getCompanyOpenDate().after(today)) {
            throw new IllegalArgumentException("개업일은 미래 날짜일 수 없습니다.");
        }

        String phoneRegex = "^\\d{2,3}-\\d{3,4}-\\d{4}$";
        if (!company.getCompanyPhone().matches(phoneRegex)) {
            throw new IllegalArgumentException("유효하지 않은 전화번호 형식입니다. (예: 02-1234-5678)");
        }
    }
}