import {useEffect, useState} from "react";
import apiResumeService from "./apiResumeService";
import DatePicker from "react-datepicker";
import {Select} from "@headlessui/react";


const Resume = () => {

    const [user, setUser] = useState([]);

    //학력 , 전공
    const [showModal, setShowModal] = useState(false);
    const [showMajorModal, setShowMajorModal] = useState(null);
    const [educationList, setEducationList] = useState([]);

    const handleAddSchool = (school) => {
        setEducationList((prev) => [
            ...prev,
            { ...school, major: null, startDate: null, endDate: null },
        ]);
        setShowModal(false);
    };

    const handleAddMajor = (index, major) => {
        setEducationList((prev) =>
            prev.map((school, i) => (i === index ? { ...school, major: major.name } : school))
        );
        setShowMajorModal(null);
    };









    useEffect(() => {
        // useEffect 로 뜨게 할 것들 작성하기
        // apiResumeService.getUserInfoById(userId,setUser); // user정보

    }, []);


    return (
        <div>
            <div className="resume-top">이력서 작성</div>
            <div className="user-info">
                <div key={user.userId}>
                    <p>{user.userProfileImage}</p>
                    <p>{user.userName}</p>
                    <p>{user.userGender}</p>
                    <p>{user.userBirthdate}</p>
                    <p>{user.userAddress}</p>
                    <p>{user.userEmail}</p>
                    <p>{user.userPhone}</p>
                </div>
            </div>

            <div className="resume-title">
                <h2>이력서 제목</h2>
                <input type="text"></input>
            </div>

            <div className="education-info">
                <h2>학력</h2>
                <ul>
                {educationList.map(
                    (school, index) => (
                        <li key={index} style={{marginBottom: "15px"}}>
                            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                <DatePicker
                                    selected={school.startDate}
                                    onChange={(date) => handleAddMajor(index, date, "startDate")}
                                    dateFormat="yyyy.MM"
                                    showMonthYearPicker
                                    placeholderText="YYYY.MM"
                                />
                                ~
                                <DatePicker
                                    selected={school.endDate}
                                    onChange={(date) => handleAddMajor(index, date, "endDate")}
                                    dateFormat="yyyy.MM"
                                    showMonthYearPicker
                                    placeholderText="YYYY.MM"
                                />
                            </div>

                            <div>
                                {school.name} ({school.type})
                                <button onClick={() => setShowMajorModal(index)} style={buttonStyle}>
                                    전공 추가
                                </button>
                                {school.major && <p>전공: {school.major}</p>}
                            </div>
                        </li>
                    ))}
            </ul>

            {showModal && <Select onClose={() => setShowModal(false)} onSelect={handleAddSchool}/>}
            {showMajorModal !== null && (
                <Major
                    schoolType={educationList[showMajorModal].type}
                    onClose={() => setShowMajorModal(null)}
                    onSelect={(major) => handleAddMajor(showMajorModal, major)}
                />
            )}

            <div className="career-info">
                <h2>경력</h2>
                <p>d</p>
            </div>

            <div className="workPreference-info">
                <h2>희망 근무 조건</h2>
                <p></p>
            </div>

            <div className="introduce-info">
                <h2>자기소개 및 스킬</h2>
                <p></p>
            </div>

            <button>이력서 저장</button>

        </div>
    )

}
export default Resume;