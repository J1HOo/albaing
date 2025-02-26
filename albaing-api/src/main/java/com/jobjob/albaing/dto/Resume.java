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

public class Resume {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)

    private int resumeId;
    private int userId;
    private String resumeTitle;
    private String resumeLocation;
    public enum JobCategory {
        외식_음료("외식/음료"),
        유통_판매("유통/판매"),
        문화_여가생활("문화/여가생활"),
        서비스("서비스"),
        사무_회계("사무/회계"),
        고객상담_리서치("고객상담/리서치"),
        생산_건설_노무("생산/건설/노무"),
        IT_기술("IT/기술"),
        디자인("디자인"),
        미디어("미디어"),
        운전_배달("운전/배달"),
        병원_간호_연구("병원/간호/연구"),
        교육_강사("교육/강사");

        private final String category;
        JobCategory(String category) {
            this.category = category;
        }
        public String getCategory() {
            return category;
        }
    }
    private JobCategory resumeJobCategory;
    public enum ResumeJobType {
        정규직, 계약직, 인턴, 알바, 파견직
    }
    private ResumeJobType resumeJobType;

    public enum JobDuration {
        무관("무관"),
        하루("하루"),
        일일_1개월("1일~1개월"),
        월_3개월("1~3개월"),
        월_6개월("3~6개월"),
        육개월이상("6개월이상");

        private final String duration;

        JobDuration(String duration) {
            this.duration = duration;
        }

        public String getDuration() {
            return duration;
        }
    }
    private JobDuration resumeJobDuration;

    public enum workSchedule {
        무관, 평일, 주말
    }
    private workSchedule resumeWorkSchedule;

    public enum WorkTime {
        무관("무관"),
        오전("오전(06:00~12:00)"),
        오후("오후(12:00~18:00)"),
        저녁("저녁(18:00~24:00)"),
        새벽("새벽(00:00~06:00)");

        private final String time;

        WorkTime(String time) {
            this.time = time;
        }

        public String getTime() {
            return time;
        }
    }
    private WorkTime resumeWorkTime;

    private String resumeJobSkill;
    private String resumeIntroduction;

}
