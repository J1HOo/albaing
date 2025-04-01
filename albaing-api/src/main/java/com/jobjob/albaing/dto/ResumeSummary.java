package com.jobjob.albaing.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class ResumeSummary {
    private int resumeId;
    private String maskedName;
    private String profileImage;
    private String resumeJobCategory;
    private String resumeLocation;

    private int userId;
}