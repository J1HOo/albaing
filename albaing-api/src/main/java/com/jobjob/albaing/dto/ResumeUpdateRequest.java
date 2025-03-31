package com.jobjob.albaing.dto;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ResumeUpdateRequest {
    private Resume resume;
    private EducationHistory educationHistory;
    private CareerHistory careerHistory;
}