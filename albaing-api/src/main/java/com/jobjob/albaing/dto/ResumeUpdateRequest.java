package com.jobjob.albaing.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ResumeUpdateRequest {
    private Resume resume;
    private EducationHistory educationHistory;
    private List<CareerHistory> careerHistory;
}