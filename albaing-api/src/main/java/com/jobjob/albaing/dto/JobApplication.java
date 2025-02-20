package com.jobjob.albaing.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {
    private Integer jobApplicationId;
    private Integer jobPostId;
    private Integer resumeId;
    private LocalDateTime applicationAt;
    private String approveStatus;
}