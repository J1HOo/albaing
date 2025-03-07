package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/oauth/kakao")
public class KakaoAPIController {

    @Autowired
    private UserMapper userMapper;

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.client-secret}")
    private String kakaoClientSecret;

    @GetMapping("/login")
    public ResponseEntity<?> getKakaoLoginUrl() {
        String url = "https://kauth.kakao.com/oauth/authorize?response_type=code" +
                "&client_id=" + kakaoClientId + "&redirect_uri=" + redirectUri;
        return ResponseEntity.ok(url);
    }

    @GetMapping("/callback")
    public RedirectView handleCallback(@RequestParam String code) {
        RestTemplate restTemplate = new RestTemplate();

        // 1. 카카오 토큰 요청
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        LinkedMultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);
        params.add("client_secret", kakaoClientSecret);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded");

        HttpEntity<LinkedMultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
        Map<String, Object> tokenResponse = restTemplate.postForObject(tokenUrl, tokenRequest, Map.class);

        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            return new RedirectView("http://localhost:3000/error?message=Failed to get access token");
        }

        String accessToken = (String) tokenResponse.get("access_token");

        // 2. 카카오 사용자 정보 요청
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.add("Authorization", "Bearer " + accessToken);

        HttpEntity<String> userRequest = new HttpEntity<>(userHeaders);
        ResponseEntity<Map> userResponse = restTemplate.postForEntity(userInfoUrl, userRequest, Map.class);

        if (userResponse.getBody() == null) {
            return new RedirectView("http://localhost:3000/error?message=Failed to fetch user info");
        }

        // 3. 사용자 정보 파싱
        Map<String, Object> userInfo = userResponse.getBody();
        Map<String, Object> properties = (Map<String, Object>) userInfo.get("properties");
        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");

        String nickname = (String) properties.get("nickname");
        String profileImg = (String) properties.get("profile_image");
        String email = (String) kakaoAccount.get("email");
        String gender = kakaoAccount.containsKey("gender") ? (String) kakaoAccount.get("gender") : null;
        String birthday = kakaoAccount.containsKey("birthday") ? (String) kakaoAccount.get("birthday") : null;

        // 4. DB 에서 가입여부 확인
        try {
            Map<String, Object> param = new HashMap<>();
            param.put("userEmail", email);
            User existingUser = userMapper.loginUser(param);

            if (existingUser != null) {
                HttpSession session = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession();
                session.setAttribute("userSession", existingUser);

                return new RedirectView("http://localhost:3000/"); // 가입한 사용자는 로그인으로
            } else {
                String frontendRedirectUri = "http://localhost:3000/register/person"  // 미가입 사용자는 회원가입으로
                        + "?nickname=" + URLEncoder.encode(nickname, StandardCharsets.UTF_8)
                        + "&email=" + email;

                if (gender != null) {
                    frontendRedirectUri += "&gender=" + gender;
                }
                if (birthday != null) {
                    frontendRedirectUri += "&birthday=" + birthday;
                }
                if (profileImg != null) {
                    frontendRedirectUri += "&profileImage=" + URLEncoder.encode(profileImg, StandardCharsets.UTF_8);
                }

                return new RedirectView(frontendRedirectUri);
            }
        } catch (Exception e) {
            return new RedirectView("http://localhost:3000/error?message=Login failed: " + e.getMessage());
        }
    }

}