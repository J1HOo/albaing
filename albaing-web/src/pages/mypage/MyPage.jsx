import React, {useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import apiMyPageService from "./apiMyPageService";

const MyPage = () => {
    const {userId, resumeId} = useParams();

    // const [userData, seUserData] = useState("");
    // const [resumeData, setResumeData] = useState("");
    const [resumeTitle, setResumeTitle] = useState("");
    const [userName,setUserName] = useState("");


    useEffect(() => {
        apiMyPageService.getUserById(userId)
            .then(
                (userData)=>{
                    if(userData && userData.name){
                        setUserName(userData.name);
                    }
                }
            )
            .catch((err)=>{
                console.error("사용자 이름 불러오기 실패",err);
            })


        apiMyPageService.getResumeById(resumeId)
            .then(
                (resumeData) => {
                    if (resumeData && resumeData.title) {
                        setResumeTitle(resumeData.title);
                    }
                }
            )
            .catch(
                (error) => {
                    console.error("이력서불러오기 실패", error);
                }
            )

    }, [userId,resumeId]);

    return (
        <div className="myPage-container">
            {/* 메뉴 바 */}
            <div className="myPageMenu-container">
                <h2>My Page</h2>
                <ul>
                    <li>
                        <Link to="/mypage">나의 이력서 정보</Link>
                    </li>
                    <li>
                        <Link to="/mypage/scraps">스크랩한 공고</Link>
                    </li>
                    <li>
                        <Link to="/mypage/applications">지원 현황</Link>
                    </li>
                    <li>
                        <Link to="/mypage/reviews">리뷰/댓글 관리</Link>
                    </li>
                </ul>
            </div>

            {/* 사용자 정보 및 이력서 정보 */}
            <div className="userInfo-container">
                    <div>
                        <p>{userName}</p>
                        <button><Link to="/mypage/user/edit">내 정보 수정</Link></button>
                    </div>

                <div>
                    <p>이력서</p>
                    <p>{resumeTitle}</p>
                </div>

            </div>
        </div>
    );
};

export default MyPage;
