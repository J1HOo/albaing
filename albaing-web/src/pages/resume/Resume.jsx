import {useEffect, useState} from "react";
import apiResumeService from "./apiResumeService";
import DatePicker from "react-datepicker";
import {Select} from "@headlessui/react";
import Major from "./Major";
import {useParams} from "react-router-dom";


const Resume = () => {
    const {resumeId} = useParams();



    const initialResumeData = {
        resume:
            {
                resumeId: "26",
                userId: "26",
                resumeTitle: "",
                resumeLocation: "",
                resumeJobCategory: "",
                resumeJobType: "",
                resumeJobDuration: "",
                resumeWorkSchedule: "",
                resumeWorkTime: "",
                resumeJobSkill: "",
                resumeIntroduction: ""
            }
        ,
        career:
            {
                careerId: "",
                resumeId: "26",
                careerCompanyName: "",
                careerJoinDate: "",
                careerQuitDate: "",
                careerJobDescription: "",
                careerIsCareer: ""
            }
        ,
        education:
            {
                educationId: "",
                resumeId: "26",
                eduDegree: "",
                eduStatus: "",
                eduSchool: "",
                eduMajor: "",
                eduAdmissionYear: "",
                eduGraduationYear: ""
            }

    }
    const [resumeData, setResumeData] = useState(initialResumeData);


    useEffect(() => {
        apiResumeService.updateResume(resumeId, resumeData);
    }, []);


    // 이력서 수정 API 호출
    const handleUpdate = () => {
        apiResumeService.updateResume(resumeId,resumeData);
    };


    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const {name, value} = e.target;
        setResumeData(
            {
                ...resumeData, [name]: value
            }
        )
        //     if (section === "resume") {
        //         return {...prev, resume: {...prev.resume, [name]: type === "checkbox" ? checked : value}};
        //     } else {
        //         const updatedSection = [...prev[section]];
        //         updatedSection[index] = {...updatedSection[index], [name]: type === "checkbox" ? checked : value};
        //         return {...prev, [section]: updatedSection};
        //     }
        // });
    };



    return (
        <div>
            <h1>이력서 정보</h1>
            <br/>
            <div>
                <ResumeInput label="이력서 제목" name="resumeTitle" value={resumeData.resume.resumeTitle}
                             onChange={(e) => handleChange("resume", null, e)}/>

                <h2>학력 사항</h2>
                <button>+추가</button>
                {resumeData.education.map(
                    (edu) => (
                        <div key={edu.education.educationId}>
                            <label>학교명</label>
                            <input type="text" name="eduSchool"
                                   value={edu.education.eduSchool}
                                   onChange={handleChange}/>
                            {/*onChange={(e) => handleChange("education",e)}/>*/}
                            <label>전공</label>
                            <input name="eduMajor"
                                   value={edu.education.eduMajor}
                                   onChange={handleChange}/>
                            {/*onChange={(e) => handleChange("education",e)}/>*/}
                            <input label="학위" name="eduDegree"
                                   value={edu.education.eduDegree}
                                   onChange={handleChange}/>
                            {/*onChange={(e) => handleChange("education",e)}/>*/}
                            <ResumeInput
                                label="학력 상태"
                                name="eduStatus"
                                value={resumeData.education.eduStatus}
                                onChange={handleChange}
                                // onChange={(e) => handleChange("education",e)}
                                type="select"
                                options={[
                                    {value: "졸업", label: "졸업"},
                                    {value: "재학중", label: "재학중"},
                                    {value: "휴학중", label: "휴학중"},
                                    {value: "수료", label: "수료"},
                                    {value: "중퇴", label: "중퇴"},
                                    {value: "자퇴", label: "자퇴"},
                                    {value: "졸업예정", label: "졸업예정"},
                                ]}
                            />
                            <ResumeInput label="입학 연도" name="eduAdmissionYear"
                                         value={resumeData.education.eduAdmissionYear}
                                         onChange={handleChange}/>
                            {/*onChange={(e) => handleChange("education", e)} type="month"/>*/}
                            <ResumeInput label="졸업 연도" name="eduGraduationYear"
                                         value={resumeData.education.eduGraduationYear}
                                         onChange={handleChange}/>
                            {/*onChange={(e) => handleChange("education",e)} type="month"/>*/}

                        </div>
                    ))}

                <h2>경력</h2>
                {resumeData.career.map((career) => (
                    <div key={career.careerId}>
                        <ResumeInput
                            label="경력 구분"
                            name="careerIsCareer"
                            value={resumeData.careerIsCareer}
                            onChange={(e) => handleChange("career",e)}
                            type="radio"
                            radioGroup={[
                                {value: "신입", label: "신입"},
                                {value: "경력", label: "경력"},
                            ]}
                        />
                        <ResumeInput label="회사명" name="careerCompanyName"
                                     value={resumeData.careerCompanyName}
                                     onChange={(e) => handleChange("career", e)}/>
                        <ResumeInput label="입사일" name="careerJoinDate"
                                     value={resumeData.careerJoinDate}
                                     onChange={(e) => handleChange("career",e)} type="month"/>
                        <ResumeInput label="퇴사일" name="careerQuitDate"
                                     value={resumeData.careerQuitDate}
                                     onChange={(e) => handleChange("career",e)} type="month"/>
                        <ResumeInput label="담당업무" name="careerJobDescription"
                                     value={resumeData.careerJobDescription}
                                     onChange={(e) => handleChange("career",e)} type="textarea"/>
                    </div>
                ))}

                <h2>희망 근무 조건</h2>
                <ResumeInput
                    label="업직종"
                    name="resumeJobCategory"
                    value={resumeData.resumeJobCategory}
                    onChange={(e) => handleChange("resume", null, e)}
                    type="select"
                    options={[
                        {value: "외식/음료", label: "외식/음료"},
                        {value: "유통/판매", label: "유통/판매"},
                        {value: "문화/여가생활", label: "문화/여가생활"},
                        {value: "서비스", label: "서비스"},
                        {value: "사무/회계", label: "사무/회계"},
                        {value: "고객상담/리서치", label: "고객상담/리서치"},
                        {value: "생산/건설/노무", label: "생산/건설/노무"},
                        {value: "IT/기술", label: "IT/기술"},
                        {value: "디자인", label: "디자인"},
                        {value: "미디어", label: "미디어"},
                        {value: "운전/배달", label: "운전/배달"},
                        {value: "병원/간호/연구", label: "병원/간호/연구"},
                        {value: "교육/강사", label: "교육/강사"},
                    ]}
                />
                <ResumeInput label="근무지" name="resumeLocation" value={resumeData.resume.resumeLocation}
                             onChange={(e) => handleChange("resume", null, e)} input/>
                <ResumeInput
                    label="근무 형태"
                    name="resumeJobType"
                    value={resumeData.resume.resumeJobType}
                    onChange={(e) => handleChange("resume", null, e)}
                    type="radio"
                    radioGroup={[
                        {value: "알바", label: "알바"},
                        {value: "정규직", label: "정규직"},
                        {value: "계약직", label: "계약직"},
                        {value: "파견직", label: "파견직"},
                        {value: "인턴", label: "인턴"},

                    ]}
                />
                <ResumeInput
                    label="근무 기간"
                    name="resumeJobDuration"
                    value={resumeData.resume.resumeJobDuration}
                    onChange={(e) => handleChange("resume", null, e)}
                    type="radio"
                    radioGroup={[
                        {value: "단기", label: "단기"},
                        {value: "장기", label: "장기"},
                    ]}
                />
                <h3>근무 일시</h3>
                <ResumeInput label="근무 요일" name="resumeWorkSchedule"
                             value={resumeData.resume.resumeWorkSchedule}
                             onChange={(e) => handleChange("resume", null, e)}
                             type="select" options={[{value: "무관", label: "무관"}, {value: "평일", label: "평일"},
                    {value: "주말", label: "주말"}]}/>
                <ResumeInput label="희망 근무 시간" name="resumeWorkTime"
                             value={resumeData.resume.resumeWorkTime}
                             onChange={(e) => handleChange("resume", null, e)}
                             type="select" options={
                    [{value: "무관", label: "무관"},
                        {value: "오전(06:00~12:00)", label: "오전(06:00~12:00)"},
                        {value: "오후(12:00~18;00)", label: "오후(12:00~18;00)"}, {
                        value: "저녁(18:00~24:00)",
                        label: "저녁(18:00~24:00)"
                    },
                        {value: "새벽(00:00~06:00)", label: "새벽(00:00~06:00)"}]}/>


                <h2>자기소개, 스킬</h2>
                <ResumeInput label="업무 스킬" name="resumeJobSkill" value={resumeData.resume.resumeJobSkill}
                             onChange={(e) => handleChange("resume", null, e)}/>
                <ResumeInput label="자기소개" name="resumeIntroduction" value={resumeData.resume.resumeIntroduction}
                             onChange={(e) => handleChange("resume", null, e)} type="textarea"/>

            </div>


            <button onClick={handleUpdate}>이력서 저장</button>

        </div>
    )

}


const ResumeInput = ({label, name, value, onChange, type = "text", options = [], radioGroup = []}) => {
    return (
        <div className="resume-field">
            <h3>{label}</h3>
            {type === "textarea" ? (
                <textarea name={name} value={value} onChange={onChange}></textarea>
            ) : type === "select" ? (
                <select name={name} value={value} onChange={onChange}>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : type === "radio" ? (
                radioGroup.map((option) => (
                    <label key={option.value}>
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={onChange}
                        />
                        {option.label}
                    </label>
                ))
            ) : type === "checkbox" ? (
                <label>
                    <input type="checkbox" name={name} checked={value} onChange={onChange}/>
                    {label}
                </label>
            ) : type === "date" ? (
                <input type="date" name={name} value={value} onChange={onChange}/>
            ) : (
                <input type="text" name={name} value={value} onChange={onChange}/>
            )}
        </div>
    );
};


export default Resume;