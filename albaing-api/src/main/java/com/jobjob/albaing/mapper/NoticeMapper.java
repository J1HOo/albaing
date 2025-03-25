package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Notice;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NoticeMapper {

    /**
     * 모든 공지사항 목록 조회
     */
    List<Notice> getAllNotices();

    /**
     * 공지사항 상세 조회
     */
    Notice getNoticeById(@Param("noticeId") Long noticeId);

    /**
     * 공지사항 등록
     */
    void createNotice(Notice notice);

    /**
     * 공지사항 수정
     */
    void updateNotice(Notice notice);

    /**
     * 공지사항 삭제
     */
    void deleteNotice(@Param("noticeId") Long noticeId);
}