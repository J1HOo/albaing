package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Notice;

import java.util.List;

public interface NoticeService {

    /**
     * 모든 공지사항 목록 조회
     */
    List<Notice> getAllNotices();

    /**
     * 공지사항 상세 조회
     */
    Notice getNoticeById(Long noticeId);

    /**
     * 공지사항 등록
     */
    Notice createNotice(Notice notice);

    /**
     * 공지사항 수정
     */
    Notice updateNotice(Notice notice);

    /**
     * 공지사항 삭제
     */
    boolean deleteNotice(Long noticeId);
}