package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Notice;
import com.jobjob.albaing.mapper.NoticeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NoticeServiceImpl implements NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;

    @Override
    public List<Notice> getAllNotices() {
        return noticeMapper.getAllNotices();
    }

    @Override
    public Notice getNoticeById(Long noticeId) {
        return noticeMapper.getNoticeById(noticeId);
    }

    @Override
    public Notice createNotice(Notice notice) {
        // 현재 시간 설정
        LocalDateTime now = LocalDateTime.now();
        notice.setNoticeCreatedAt(now);
        notice.setNoticeUpdatedAt(now);

        // DB에 저장
        noticeMapper.createNotice(notice);

        // 저장된 공지사항 반환
        return notice;
    }

    @Override
    public Notice updateNotice(Notice notice) {
        // 기존 공지사항 조회
        Notice existingNotice = noticeMapper.getNoticeById(notice.getNoticeId());
        if (existingNotice == null) {
            return null;
        }

        // 수정 시간 업데이트
        notice.setNoticeCreatedAt(existingNotice.getNoticeCreatedAt()); // 생성 시간은 유지
        notice.setNoticeUpdatedAt(LocalDateTime.now());

        // DB 업데이트
        noticeMapper.updateNotice(notice);

        // 업데이트된 공지사항 반환
        return notice;
    }

    @Override
    public boolean deleteNotice(Long noticeId) {
        // 기존 공지사항 조회
        Notice existingNotice = noticeMapper.getNoticeById(noticeId);
        if (existingNotice == null) {
            return false;
        }

        // DB에서 삭제
        noticeMapper.deleteNotice(noticeId);

        return true;
    }
}