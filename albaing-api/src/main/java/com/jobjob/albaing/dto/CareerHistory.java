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
public class CareerHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int careerId;
    private int resumeId;
    private String careerCompanyName;
    private String careerJoinDate;
    private String careerQuitDate;
    private String careerJobDescription;
    public enum careerHistoryType {
        신입,경력
    }
    private careerHistoryType careerIsCareer;//enum 설정

}
