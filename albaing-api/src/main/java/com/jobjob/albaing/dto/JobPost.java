package com.jobjob.albaing.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class JobPost {
    private long jobPostId;                  // 공고 등록 번호
    private long companyId;                  // 기업 등록 번호
    private String jobPostTitle;             // 공고 제목
    private String jobPostOptionalImage;     // 공고 내용 이미지 주소
    private String jobPostContactNumber;     // 담당자(기업) 연락처
    private String jobPostRequiredEducations;// 요구 학력
    private String jobPostJobCategory;       // 직군 분류
    private String jobPostJobType;           // 근무 형태
    private String jobPostWorkingPeriod;     // 근무 기간
    private String jobWorkSchedule;          // 근무 요일
    private String jobPostShiftHours;        // 근무 시간
    private String jobPostSalary;            // 급여
    private String jobPostWorkPlace;         // 근무지
    private Boolean jobPostStatus;           // 공고 상태
    private LocalDate jobPostDueDate;        // 마감일
    private LocalDateTime jobPostCreatedAt;  // 공고 게시일
    private LocalDateTime jobPostUpdatedAt;  // 공고 최종 수정일
}
