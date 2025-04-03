import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import defaultProfileImage from "../mypage/default-profile.png";
import { useModal, AlertModal } from "../../../components";
import axios from "axios";
import KakaoPostcodeModal from "../../auth/register/KakaoPostcodeModal";

const EditUserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const alertModal = useModal();

    const [loading, setLoading] = useState(true);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [detailAddress, setDetailAddress] = useState('');
    const [userAddress, setUserAddress] = useState("");

        const [user, setUserData] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        userPhone: "",
        userGender: "",
        userBirthdate: "",
        userAddress: "",
        userProfileImage: ""
    });

    useEffect(() => {
        axios.get(`/api/user/${userId}`)
            .then((res) => {
                setUserData({
                    userEmail: res.data.userEmail || "",
                    userPassword: res.data.userPassword || "",
                    userName: res.data.userName || "",
                    userPhone: res.data.userPhone || "",
                    userGender: res.data.userGender || "",
                    userBirthdate: res.data.userBirthdate || "",
                    userAddress: res.data.userAddress || "",
                    userProfileImage: res.data.userProfileImage || ""
                });
                setLoading(false);
            })
            .catch(() => {
                alertModal.openModal({
                    title: '오류',
                    message: '사용자 정보를 불러오는데 실패했습니다.',
                });
                setLoading(false);
            });
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 제한 (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alertModal.openModal({
                    title: '파일 크기 제한',
                    message: '파일 크기는 5MB를 초과할 수 없습니다.',
                    type: 'warning'
                });
                return;
            }
            // 파일 유형 제한
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alertModal.openModal({
                    title: '파일 형식 제한',
                    message: '지원되는 이미지 형식은 JPEG, PNG, GIF입니다.',
                    type: 'warning'
                });
                return;
            }
            setProfileImageFile(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append(
            'user',
            new Blob([JSON.stringify(user)], { type: 'application/json' })
        );

        if (profileImageFile) {
            formDataToSend.append('userProfileImage', profileImageFile);
        }

        axios.put(`/api/user/update/${userId}`, formDataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                alertModal.openModal({
                    title: '성공',
                    message: '사용자 정보가 성공적으로 수정되었습니다!',
                    type: 'success',
                    onClose: () => navigate(`/mypage/${userId}`)
                });
                setUserData(res.data);
            })
            .catch((error) => {
                alertModal.openModal({
                    title: '오류',
                    message: error.response?.data || "사용자 정보를 수정하는 데 실패했습니다.",
                    type: 'error'
                });
            });
    };
    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm("정말 탈퇴하시겠습니까?\n탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.");
        if (!confirmDelete) return;

        axios.delete(`/api/user/${userId}`)
            .then(() => {
                alertModal.openModal({
                    title: '탈퇴 완료',
                    message: '회원 탈퇴가 정상적으로 처리되었습니다.',
                    type: 'success',
                    onClose: () => navigate('/login')
                });
            })
            .catch(() => {
                alertModal.openModal({
                    title: '오류',
                    message: '회원 탈퇴 중 오류가 발생했습니다.',
                    type: 'error'
                });
            });
    };


    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-[#0066FF]">내 정보 수정</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                    &larr; 돌아가기
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 프로필 이미지 섹션 */}
                <div className="flex flex-col items-center">
                    <div className="relative group">
                        <img
                            src={profileImagePreview || (user.userProfileImage || defaultProfileImage)}
                            alt="프로필 이미지"
                            className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-md transition duration-300"
                        />
                        <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                            <label
                                className="w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer">
                                <span className="text-white text-sm font-medium">이미지 변경</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">프로필 이미지를 변경하려면 클릭하세요</p>
                </div>

                {/* 개인 정보 섹션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 이름 */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">이름</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="userName"
                                value={user.userName}
                                disabled
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">이름은 변경할 수 없습니다</p>
                    </div>

                    {/* 이메일 */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">이메일</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="userEmail"
                                value={user.userEmail}
                                disabled
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다</p>
                    </div>

                    {/* 전화번호 */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">전화번호</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="userPhone"
                                value={user.userPhone}
                                onChange={handleInputChange}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="010-0000-0000"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path
                                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                            </svg>
                        </div>
                    </div>

                    {/* 성별 */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">성별</label>
                        <div className="relative">
                            <select
                                name="userGender"
                                value={user.userGender}
                                onChange={handleInputChange}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition"
                            >
                                <option value="female">여성</option>
                                <option value="male">남성</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                      clipRule="evenodd"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5 text-gray-400 absolute right-3 top-3.5 pointer-events-none"
                                 viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>

                    {/* 생년월일 */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">생년월일</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="userBirthdate"
                                value={user.userBirthdate}
                                onChange={handleInputChange}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>

                    {/* 주소 */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">주소</label>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="상세 주소를 입력하세요"
                                value={user.userAddress}
                                onClick={() => setIsPostcodeOpen(true)}
                                onChange={(e) => setDetailAddress(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>

                    <KakaoPostcodeModal
                        isOpen={isPostcodeOpen}
                        onClose={() => setIsPostcodeOpen(false)}
                        onComplete={(selectedAddress) => {
                            setUserAddress(selectedAddress);
                            setUserData(prevUser => ({
                                ...prevUser,
                                userAddress: selectedAddress
                            }));
                        }}
                    />
                </div>

                {/* 버튼 섹션 */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                        onClick={handleSubmit}
                    >
                        수정 완료
                    </button>
                </div>
            </form>

            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={alertModal.closeModal}
                title={alertModal.modalProps.title || '알림'}
                message={alertModal.modalProps.message}
                confirmText="확인"
                type={alertModal.modalProps.type || 'info'}
            />
            <div className="text-center mt-10">
                <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="text-sm text-gray-400 hover:text-red-500 transition"
                >
                    회원탈퇴
                </button>
            </div>

        </div>

    );
};

export default EditUserPage;