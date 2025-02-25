package com.jobjob.albaing.dto;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@ToString
@NoArgsConstructor
public class JobApplication {
    private long jobApplicationId;
    private long jobPostId;
    private long resumeId;
    private LocalDateTime applicationAt;
    private ApplicationStatus approveStatus;

    public enum ApplicationStatus {
        APPROVED, APPROVING, DENIED;

        public static ApplicationStatus fromString(String status) {
            try {
                return ApplicationStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + status);
            }
        }
    }
}
