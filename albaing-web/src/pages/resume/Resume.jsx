import {useEffect, useState} from "react";
import apiResumeService from "./apiResumeService";


const Resume = () => {

    const [user, setUser] = useState([]);

    useEffect(() => {
        //useEffect로 뜨게 할 것들 작성하기
        apiResumeService.getUserInfo(setUser); // user정보

    }, []);


return(
    <div>
        <div className="resume-top">이력서 작성</div>

    </div>
)

}
export default Resume;