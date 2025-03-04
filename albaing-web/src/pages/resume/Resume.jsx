import {useEffect, useState} from "react";
import apiResumeService from "./apiResumeService";


const Resume = () => {

    const [user, setUser] = useState([]);

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
                <p></p>
            </div>

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