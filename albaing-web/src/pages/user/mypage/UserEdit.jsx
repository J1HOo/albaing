import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiMyPageService from "../../../service/apiMyPageService";
import defaultProfileImage from "../mypage/default-profile.png";
import AlertModal from "../../../components/modals/AlertModal"; // 기본 프로필 이미지

const EditUserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [alertModal, setAlertModal] = useState(null);
    const [user, setUser] = useState({
        userName: "",
        userEmail: "",
        userPhone: "",
        userGender: "",
        userBirthdate: "",
        userAddress: "",
        userProfileImage: null, // 파일 업로드를 위한 상태
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
        setAlertModal({ message: "정보가 수정되었습니다." });
        navigate(`/mypage/${userId}`);
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">내 정보 수정</h1>

            {/* 프로필 이미지 */}
            <div className="mb-4 flex flex-col items-center">
                <img
                    src={user.userProfileImage ? URL.createObjectURL(user.userProfileImage) : defaultProfileImage}
                    alt="프로필"
                    className="w-32 h-32 rounded-full object-cover mb-2 border border-gray-300"
                />
                <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
            </div>

            {/* 이름 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-[#0066FF] mb-2">이름</label>
                <input
                    type="text"
                    name="userName"
                    value={user.userName}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-gray-500"
                />
            </div>

            {/* 이메일 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-[#0066FF] mb-2">이메일</label>
                <input
                    type="email"
                    name="userEmail"
                    value={user.userEmail}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-gray-500"
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
            {alertModal && (
                <AlertModal
                    message={alertModal.message}
                    onClose={() => {
                        if (alertModal.onClose) {
                            alertModal.onClose();
                        } else {
                            setAlertModal(null);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default EditUserPage;
