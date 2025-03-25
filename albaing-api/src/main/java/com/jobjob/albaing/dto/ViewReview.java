package com.jobjob.albaing.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ViewReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int reviewId;
    int userId;
    int companyId;
    String reviewTitle;
    String reviewContent;
    LocalDateTime reviewCreatedAt;
    LocalDateTime reviewUpdatedAt;
    String userName;
    String userProfileImage;
    String companyName;
    String companyProfileImage;

    private String sortOrderBy;
    private Boolean isDESC;
}
