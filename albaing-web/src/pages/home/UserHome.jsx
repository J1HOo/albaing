// Route 에서 유저 정보를 전달받고 전달받은 정보로 로그인 유무 설정

import {useNavigate} from "react-router-dom";
import axios from "axios";

const UserHome = ({user}) => {
    // Link 태그 이외 경로 이동 설정 hook
    // useNavigate 리액트에서 사용 가능
    // 기본 자바스크립트에서는 window.location.href 형식 사용
    const navigate = useNavigate();

    const handleLogout = () => {
        axios
            .post("http://localhost:8080/api/user/logout")
            .then( // 로그아웃 주소로 연결하고 controller에서 로그아웃에 대한 정보 전달받았다면
                () => {
                    localStorage.removeItem("user");
                    alert("로그아웃 완료");
                    navigate("/login");
                }
            )
            .catch(
                (err) => {
                    alert("로그아웃을 할 수 없습니다.");
                    console.log("로그아웃 오류 : ", err);
                }
            )


    }
    const handleLoginPage = () => {
        navigate("/login");
    }
    return (
        <div>
            <h1>유저 홈페이지</h1>
            {user ? (
                <div>
                    <p>환영합니다.{user}님!</p>
                    <button onClick={handleLogout}>로그아웃</button>
                </div>


            ) : (

                <div>
                    <button onClick={handleLoginPage}>로그인</button>

                </div>


            )}
        </div>
    )

}

export default UserHome;