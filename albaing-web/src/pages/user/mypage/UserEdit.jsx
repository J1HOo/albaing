import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiMyPageService from "../../../service/apiMyPageService";
import defaultProfileImage from "../mypage/default-profile.png"// 기본 프로필 이미지

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
        userProfileImage: "" // 프로필 이미지 URL 대신 파일로 변경
    });


    useEffect(() => {
        apiMyPageService.getUserById(userId, (data) => {
            setUser({ ...data, userProfileImage: null });
        });
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 프로필 이미지 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser((prev) => ({
                ...prev,
                userProfileImage: file
            }));
        }
    };

    const handleUpdate = () => {
        const formData = new FormData();
        Object.entries(user).forEach(([key, value]) => {
            formData.append(key, value);
        });

        apiMyPageService.updateUser(userId, formData);
        alert("정보가 수정되었습니다.");
        navigate(`/mypage/${userId}`);
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-[#0066FF] text-center">내 정보 수정</h1>

            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center mb-6">
                <img
                    src={
                        user.userProfileImage instanceof File
                            ? URL.createObjectURL(user.userProfileImage)
                            : user.userProfileImage || defaultProfileImage
                    }
                    alt="프로필 이미지"
                    className="w-32 h-32 rounded-full border border-gray-300 object-cover mb-3"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-gray-600"
                />
            </div>

            {/* 이름 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">이름</label>
                <input
                    type="text"
                    name="userName"
                    value={user.userName}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-[#A0A0A0] cursor-not-allowed"
                />
            </div>

            {/* 이메일 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">이메일</label>
                <input
                    type="email"
                    name="userEmail"
                    value={user.userEmail}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-[#A0A0A0] cursor-not-allowed"
                />
            </div>

            {/* 전화번호 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">전화번호</label>
                <input
                    type="text"
                    name="userPhone"
                    value={user.userPhone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-black"
                />
            </div>

            {/* 성별 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">성별</label>
                <select
                    name="userGender"
                    value={user.userGender}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-black"
                >
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="OTHER">기타</option>
                </select>
            </div>

            {/* 생년월일 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">생년월일</label>
                <input
                    type="date"
                    name="userBirthdate"
                    value={user.userBirthdate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-black"
                />
            </div>

            {/* 주소 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">주소</label>
                <input
                    type="text"
                    name="userAddress"
                    value={user.userAddress}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-black"
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
};

export default EditUserPage;
