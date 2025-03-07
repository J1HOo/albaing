import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import apiMyPageService from "./apiMyPageService";


const Mypage = () => {

    const {userId}=useParams();
    const {resumeId} =useParams();
    const [resumeTitle, setResumeTitle] =useState("");


    useEffect(() => {
        apiMyPageService.getUserById(userId);
        apiMyPageService.getResumeById(resumeId);
    }, []);

    return (
        <div className="myPage-container">
            {/* 메뉴 */}
            <div className="myPageMenu-container">
                <h2>My Page</h2>
                <ul>
                    <li>
                       나의 이력서 정보
                    </li>
                    <li >
                        스크랩한 공고
                    </li>
                    <li >
                        지원 현황
                    </li>
                    <li>
                        리뷰/댓글 관리
                    </li>
                </ul>
            </div>

            <div className="userInfo-container">


            </div>

        </div>


    )
};

export default Mypage;
