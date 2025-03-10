import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiMyPageService from "./apiMyPageService";

const EditUserPage= ()=> {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userGender, setUserGender] = useState("");
    const [userBirthdate, setUserBirthdate] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userProfileImage, setUserProfileImage] = useState("");

    // 사용자 정보 가져오기
    useEffect(() => {
        if (userId) {
            apiMyPageService.getUserById(userId)
                .then((data) => {
                    setUser(data);
                    setUserGender(data.userGender);
                    setUserBirthdate(data.userBirthdate);
                    setUserAddress(data.address);
                    setUserProfileImage(data.userProfileImage);
                })
                .catch((err) => {
                    console.error("사용자 정보 조회 실패:", err);
                });
        }
    }, [userId]);

    // 사용자 정보 수정 처리
    const handleUpdate = () => {
        if (userId) {
            apiMyPageService.updateUser(userId, userGender, userBirthdate, userAddress, userProfileImage)
                .then(() => {
                    // 수정 완료 후 마이 페이지로 리디렉션
                    navigate(`/mypage/${userId}`);
                })
                .catch((err) => {
                    console.error("사용자 정보 수정 실패:", err);
                });
        }
    };

    if (!user) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">내 정보 수정</h1>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="gender">성별</label>
                <select
                    id="gender"
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="OTHER">기타</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="birthdate">생년월일</label>
                <input
                    id="birthdate"
                    type="date"
                    value={userBirthdate}
                    onChange={(e) => setUserBirthdate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="address">주소</label>
                <input
                    id="address"
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="profileImage">프로필 이미지 URL</label>
                <input
                    id="profileImage"
                    type="text"
                    value={userProfileImage}
                    onChange={(e) => setUserProfileImage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={handleUpdate}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    수정 완료
                </button>
            </div>
        </div>
    );
}

export default EditUserPage;
