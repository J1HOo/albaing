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
public class ViewComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int commentId;
    private int reviewId;
    private int userId;
    private LocalDateTime commentCreatedAt;
    private LocalDateTime commentUpdatedAt;
    private String commentContent;
    private String reviewTitle;
    private String userName;

    private String sortOrderBy;
    private Boolean isDESC;
}
