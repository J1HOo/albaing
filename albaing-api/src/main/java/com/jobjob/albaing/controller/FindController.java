package com.jobjob.albaing.controller;

import com.jobjob.albaing.service.FindServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FindController {

    @Autowired
    private FindServiceImpl findService;

    // 이메일 찾기
    @GetMapping("/find/email")
    public String findEmailForm() {
        return "findEmail";
    }

    @PostMapping("/find/email")
    public String findEmail(
            @RequestParam("userName") String userName,
            @RequestParam("userPhone") String userPhone,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        try {
            String userEmail = findService.findEmail(userName, userPhone);
            model.addAttribute("userEmail", userEmail);
            return "findEmailResult";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "회원 정보를 찾을 수 없습니다.");
            return "redirect:/find/email";
        }
    }

    // 비밀번호 찾기
    @GetMapping("/find/password")
    public String findPasswordForm() {
        return "findPassword";
    }

    @PostMapping("/find/password")
    public String findPassword(
            @RequestParam("userEmail") String userEmail,
            @RequestParam("userPhone") String userPhone,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        try {
            String userPassword = findService.findPassword(userEmail, userPhone);
            model.addAttribute("userPassword", userPassword);
            return "findPasswordResult";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "회원 정보를 찾을 수 없습니다.");
            return "redirect:/find/password";
        }
    }

}
