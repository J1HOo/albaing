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

    // careerHistories 필드를 위한 getter/setter 추가
    public List<CareerHistory> getCareerHistories() {
        return careerHistory;
    }

    public void setCareerHistories(List<CareerHistory> careerHistories) {
        this.careerHistory = careerHistories;
    }
}