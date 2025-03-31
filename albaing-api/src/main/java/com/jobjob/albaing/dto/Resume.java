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
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int resumeId;
    private int userId;
    private String resumeTitle;
    private String resumeLocation;
    private String resumeJobCategory;
    private String resumeJobType;
    private String resumeJobDuration;
    private String resumeWorkSchedule;
    private String resumeWorkTime;
    private String resumeJobSkill;
    private String resumeIntroduction;

    private EducationHistory educationHistory;
    private CareerHistory careerHistory;
}