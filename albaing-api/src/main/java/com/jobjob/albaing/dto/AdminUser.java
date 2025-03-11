package com.jobjob.albaing.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AdminUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String userEmail;
    private String userPassword;
    private String userName;
    private Date userBirthdate;
    private Gender userGender;
    private String userPhone;
    private String userAddress;
    private String userProfileImage;
    private LocalDateTime userCreatedAt;
    private LocalDateTime userUpdatedAt;
    private Boolean userTermsAgreement;
    private Boolean userIsAdmin;

    public enum Gender {
        male, female
    }

    private String sortOrderBy;
    private Boolean isDESC;
}
