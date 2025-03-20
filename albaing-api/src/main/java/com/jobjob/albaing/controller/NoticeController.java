package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Notice;
import com.jobjob.albaing.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @GetMapping("/notices")
    public ResponseEntity<List<Notice>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    @GetMapping("/notices/{noticeId}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable Integer noticeId) {
        return ResponseEntity.ok(noticeService.getNoticeById(noticeId));
    }

    @GetMapping("/notices/search")
    public ResponseEntity<List<Notice>> searchNotices(@RequestParam String keyword) {
        return ResponseEntity.ok(noticeService.searchNotices(keyword));
    }

}