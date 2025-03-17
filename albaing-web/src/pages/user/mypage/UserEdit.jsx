import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiMyPageService from "../../../service/apiMyPageService";
import defaultProfileImage from "../mypage/default-profile.png"// 기본 프로필 이미지
import {useModal,AlertModal} from "../../../components";

const EditUserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const alertModal = useModal();

    // 사용자 정보 상태
    const [user, setUser] = useState({
        userName: "",
        userEmail: "",
        userPhone: "",
        userGender: "",
        userBirthdate: "",
        userAddress: "",
        userProfileImage: null,
        originalProfileUrl : ""
    });

// 이미지 미리보기 URL 상태
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        apiMyPageService.getUserById(userId, (data) => {
            setUser({
                ...data,
                userProfileImage: null,
                originalProfileUrl: data.userProfileImage // 기존 이미지 URL 저장
            });
            // 기존 이미지가 있으면 미리보기 설정
            if (data.userProfileImage) {
                setPreviewImage(data.userProfileImage);
            }
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

            // 이미지 미리보기 생성
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUpdate = () => {
        // FormData 객체 생성
        const formData = new FormData();

        // 사용자 정보를 JSON 문자열로 변환하여 추가
        const userData = {
            userId: userId,
            userName: user.userName,
            userEmail: user.userEmail,
            userPhone: user.userPhone,
            userGender: user.userGender,
            userBirthdate: user.userBirthdate,
            userAddress: user.userAddress,
            userProfileImage: user.originalProfileUrl // 기존 이미지 URL 유지
        };

        formData.append('user', new Blob([JSON.stringify(userData)], {
            type: 'application/json'
        }));

        // 새 프로필 이미지가 있을 경우 formData에 추가
        if (user.userProfileImage) {
            formData.append("userProfileImage", user.userProfileImage);
        }

        // 업데이트 요청 보내기
        apiMyPageService.updateUser(userId, formData,
            (response) => {
                alertModal.openModal({
                    title: "수정 완료",
                    message: "사용자 정보가 성공적으로 업데이트되었습니다.",
                    type: "success"
                });
                // 2초 후 마이페이지로 이동
                setTimeout(() => {
                    navigate(`/mypage/${userId}`);
                }, 2000);
            },
            (error) => {
                // 실패 시
                alertModal.openModal({
                    title: "오류",
                    message: "사용자 정보 업데이트에 실패했습니다. 다시 시도해주세요.",
                    type: "error"
                });
            }
        );
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-[#0066FF] text-center">내 정보 수정</h1>

            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center mb-6">
                <img
                    src={previewImage || defaultProfileImage}
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
                    <option value="male">남성</option>
                    <option value="female">여성</option>
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
            {/* 알림 모달 */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={alertModal.closeModal}
                title={alertModal.modalProps.title || '알림'}
                message={alertModal.modalProps.message}
                confirmText="확인"
                type={alertModal.modalProps.type || 'info'}
            />
        </div>
    );
};

export default EditUserPage;