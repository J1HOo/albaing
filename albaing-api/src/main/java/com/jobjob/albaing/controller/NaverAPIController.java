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
@RequestMapping("/oauth/naver")
public class NaverAPIController {

    @Autowired
    private UserMapper userMapper;

    @Value("${naver.client-id}")
    private String naverClientId;

    @Value("${naver.client-secret}")
    private String naverClientSecret;

    @Value("${naver.redirect-url}")
    private String naverRedirectUrl;

    @GetMapping("/login")
    public ResponseEntity<?> getNaverLoginUrl() {
        String url = "https://nid.naver.com/oauth2.0/authorize?response_type=code" +
                "&client_id=" + naverClientId + "&redirect_uri=" + naverRedirectUrl +
                "&state=xyz123";
        return ResponseEntity.ok(url);
    }

    @GetMapping("/callback")
    public RedirectView handleCallback(@RequestParam("code") String code,
                                       @RequestParam("state") String state) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // 1. 네이버에서 액세스 토큰 요청
            String tokenUrl = "https://nid.naver.com/oauth2.0/token"
                    + "?grant_type=authorization_code"
                    + "&client_id=" + naverClientId
                    + "&client_secret=" + naverClientSecret
                    + "&code=" + code
                    + "&state=" + state;

            ResponseEntity<Map> tokenResponse = restTemplate.getForEntity(tokenUrl, Map.class);

            if (tokenResponse.getBody() == null || !tokenResponse.getBody().containsKey("access_token")) {
                return new RedirectView("http://localhost:3000/error?message=Failed to get access token");
            }

            String accessToken = (String) tokenResponse.getBody().get("access_token");

            // 2. 네이버 사용자 정보 요청
            String userInfoUrl = "https://openapi.naver.com/v1/nid/me";
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);

            HttpEntity<String> userRequest = new HttpEntity<>(headers);
            ResponseEntity<Map> userResponse = restTemplate.postForEntity(userInfoUrl, userRequest, Map.class);

            if (userResponse.getBody() == null || !userResponse.getBody().containsKey("response")) {
                return new RedirectView("http://localhost:3000/error?message=Failed to fetch user info");
            }

            Map<String, Object> userInfo = (Map<String, Object>) userResponse.getBody().get("response");

            // 3. 사용자 정보 파싱
            String name = (String) userInfo.get("name");
            String nickname = (String) userInfo.get("nickname");
            String email = (String) userInfo.get("email");
            String gender = (String) userInfo.get("gender");
            String birthday = (String) userInfo.get("birthday");
            String profileImage = (String) userInfo.get("profile_image");

            // 4. DB에서 사용자 존재 여부 확인
            try {
                Map<String, Object> param = new HashMap<>();
                param.put("userEmail", email);
                User existingUser = userMapper.loginUser(param);

                if (existingUser != null) {
                    HttpSession session = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession();
                    session.setAttribute("userSession", existingUser);
                    return new RedirectView("http://localhost:3000/");
                } else {
                    StringBuilder frontendRedirectUri = new StringBuilder("http://localhost:3000/register/person");
                    frontendRedirectUri.append("?name=").append(URLEncoder.encode(name, StandardCharsets.UTF_8));
                    frontendRedirectUri.append("&email=").append(email);

                    if (nickname != null && !nickname.isEmpty()) {
                        frontendRedirectUri.append("&nickname=").append(URLEncoder.encode(nickname, StandardCharsets.UTF_8));
                    }
                    if (gender != null && !gender.isEmpty()) {
                        frontendRedirectUri.append("&gender=").append(gender);
                    }
                    if (birthday != null && !birthday.isEmpty()) {
                        frontendRedirectUri.append("&birthday=").append(birthday);
                    }
                    if (profileImage != null && !profileImage.isEmpty()) {
                        frontendRedirectUri.append("&profileImage=").append(URLEncoder.encode(profileImage, StandardCharsets.UTF_8));
                    }

                    return new RedirectView(frontendRedirectUri.toString());
                }
            } catch (Exception e) {
                return new RedirectView("http://localhost:3000/error?message=Login failed: " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("🚨 네이버 로그인 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return new RedirectView("/error?message=네이버 로그인 오류 발생");
        }
    }
}
