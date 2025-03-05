import { useState } from "react";
import ResumeInput from "./ResumeInput";
import apiResumeService from "./apiResumeService";

const ResumeForm = ({ initialData }) => {
    const [resumeData, setResumeData] = useState(initialData);

    // 입력값 변경 핸들러
    const handleChange = (section, index, e) => {
        const { name, value } = e.target;
        setResumeData((prev) => {
            if (section === "resume") {
                return { ...prev, resume: { ...prev.resume, [name]: value } };
            } else {
                const updatedSection = [...prev[section]];
                updatedSection[index] = { ...updatedSection[index], [name]: value };
                return { ...prev, [section]: updatedSection };
            }
        });
    };

    // 이력서 수정 API 호출
    const handleUpdate = () => {
        apiResumeService.updateResume(resumeData.resume.resumeId, resumeData, () => {
            alert("이력서가 수정되었습니다.");
        });
    };

    return (
        <div>
            <h1>이력서 수정</h1>

            <h2>이력서 정보</h2>
            <ResumeInput label="이력서 제목" name="resumeTitle" value={resumeData.resume.resumeTitle} onChange={(e) => handleChange("resume", null, e)} />
            <ResumeInput label="위치" name="resumeLocation" value={resumeData.resume.resumeLocation} onChange={(e) => handleChange("resume", null, e)} />
            <ResumeInput label="직무 카테고리" name="resumeJobCategory" value={resumeData.resume.resumeJobCategory} onChange={(e) => handleChange("resume", null, e)} />
            <ResumeInput label="자기소개" name="resumeIntroduction" value={resumeData.resume.resumeIntroduction} onChange={(e) => handleChange("resume", null, e)} textarea />

            <h2>경력</h2>
            {resumeData.career.map((career, index) => (
                <div key={career.careerId}>
                    <ResumeInput label="회사명" name="careerCompanyName" value={career.careerCompanyName} onChange={(e) => handleChange("career", index, e)} />
                    <ResumeInput label="입사일" name="careerJoinDate" value={career.careerJoinDate} onChange={(e) => handleChange("career", index, e)} />
                    <ResumeInput label="퇴사일" name="careerQuitDate" value={career.careerQuitDate} onChange={(e) => handleChange("career", index, e)} />
                    <ResumeInput label="업무 내용" name="careerJobDescription" value={career.careerJobDescription} onChange={(e) => handleChange("career", index, e)} textarea />
                </div>
            ))}

            <h2>학력</h2>
            {resumeData.education.map((edu, index) => (
                <div key={edu.educationId}>
                    <ResumeInput label="학교명" name="eduSchool" value={edu.eduSchool} onChange={(e) => handleChange("education", index, e)} />
                    <ResumeInput label="전공" name="eduMajor" value={edu.eduMajor} onChange={(e) => handleChange("education", index, e)} />
                    <ResumeInput label="입학년도" name="eduAdmissionYear" value={edu.eduAdmissionYear} onChange={(e) => handleChange("education", index, e)} />
                    <ResumeInput label="졸업년도" name="eduGraduationYear" value={edu.eduGraduationYear} onChange={(e) => handleChange("education", index, e)} />
                </div>
            ))}

            <button onClick={handleUpdate}>수정 완료</button>
        </div>
    );
};

export default ResumeForm;
