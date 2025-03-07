import {useEffect} from "react";
import apiMyPageService from "./apiMyPageService";

const UserEdit = () => {

    useEffect(() => {
        apiMyPageService.getUserById();
    }, []);


    return (
        <div className="-container">
            <h2>회원정보 수정</h2>


        </div>
    )

};

export default UserEdit;