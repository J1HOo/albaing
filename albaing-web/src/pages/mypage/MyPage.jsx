import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import apiMyPageService from "./apiMyPageService";

const MyPage= () => {
    const {userId} = useParams();  // URL 파라미터에서 userId를 받기
    console.log("userId : ", userId);
    console.log("API URL: ", `http://localhost:8080/api/resume/user/${userId}`);
    const [user, setUser] = useState(null);  // 사용자 정보를 담을 상태
    const [resume, setResume] = useState(null);  // 이력서 정보를 담을 상태

    // userId가 존재하면 API 호출하여 사용자 정보 불러오기
    useEffect(() => {
        apiMyPageService.getUserById(userId, setUser)
        apiMyPageService.getResumeById(userId, setResume)
    }, [userId]);

    if (!user) return <div className="text-center mt-10">사용자 정보를 불러오는 중...</div>;
    if (!resume) return <div className="text-center mt-10">이력서를 불러오는 중...</div>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* 사용자 정보 */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">{user.userName} 님</h1>
                <Link to={`/mypage/user/${userId}/edit`} className="text-blue-500 hover:underline">
                    내 정보 수정하기
                </Link>

            </div>

            {/* 이력서 목록 */}
            <div className="mt-6 p-4 border rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        <Link to="/resumes" className="hover:underline text-blue-600">
                            {resume.resumeTitle}
                        </Link>
                    </h2>
                    <Link
                        to="/resumes/edit"
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        수정
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default MyPage;
