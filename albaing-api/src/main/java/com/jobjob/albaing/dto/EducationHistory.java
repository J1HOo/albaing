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
    private String eduStatus;//
    private String eduSchool;//
    private String eduMajor;//
    private String eduAdmissionYear;//
    private String eduGraduationYear;//

}
