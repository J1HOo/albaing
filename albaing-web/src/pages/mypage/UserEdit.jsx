import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiMyPageService from "./apiMyPageService";

const EditUserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    // 사용자 정보 상태
    const [user, setUser] = useState({
        userName: "",
        userEmail: "",
        userPhone: "",
        userGender: "",
        userBirthdate: "",
        userAddress: "",
        userProfileImage: ""
    });

    // 사용자 정보 불러오기
    useEffect(() => {
        apiMyPageService.getUserById(userId, setUser);
    }, [userId]);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 사용자 정보 업데이트
    const handleUpdate = () => {
        apiMyPageService.updateUser(userId, user);
        console.log("사용자 정보 수정 성공 : ");
        alert("정보가 수정되었습니다.");
        navigate(`/mypage/${userId}`); // 수정 후 마이페이지로 이동
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">내 정보 수정</h1>

            {/* 이름 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">이름</label>
                <input
                    type="text"
                    name="userName"
                    value={user.userName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {/* 이메일 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">이메일</label>
                <input
                    type="email"
                    name="userEmail"
                    value={user.userEmail}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {/* 전화번호 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">전화번호</label>
                <input
                    type="text"
                    name="userPhone"
                    value={user.userPhone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {/* 성별 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">성별</label>
                <select
                    name="userGender"
                    value={user.userGender}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="OTHER">기타</option>
                </select>
            </div>

            {/* 생년월일 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">생년월일</label>
                <input
                    type="date"
                    name="userBirthdate"
                    value={user.userBirthdate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {/* 주소 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">주소</label>
                <input
                    type="text"
                    name="userAddress"
                    value={user.userAddress}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {/* 프로필 이미지 URL */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">프로필 이미지 URL</label>
                <input
                    type="text"
                    name="userProfileImage"
                    value={user.userProfileImage}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {/* 수정 버튼 */}
            <div className="text-center mt-6">
                <button
                    onClick={handleUpdate}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    수정 완료
                </button>
            </div>
        </div>
    );
}

export default EditUserPage;
