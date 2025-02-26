package com.jobjob.albaing.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class EducationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int educationId;
    private int resumeId;
    private String eduDegree;
    public enum  eduStatus{
        졸업, 재학중, 휴학중, 수료, 중퇴, 자퇴, 졸업예정
    };
    private eduStatus eduStatus; //enum 적용
    private String eduSchool;
    private String eduMajor;
    private String eduAdmissionYear;
    private String eduGraduationYear;

}
