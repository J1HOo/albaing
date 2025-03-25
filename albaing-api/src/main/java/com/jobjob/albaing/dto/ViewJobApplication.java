package com.jobjob.albaing.dto;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@ToString
@NoArgsConstructor
public class ViewJobApplication {
    private int jobApplicationId;
    private Timestamp applicationAt;
    private String approveStatus;
    private int companyId;
    private String companyName;
    private String companyLogo;
    private int jobPostId;
    private String jobPostTitle;
    private int userId;
    private String userName;
    private String userEmail;
    private int resumeId;
    private String resumeTitle;

    private String sortOrderBy;
    private Boolean isDESC;
}