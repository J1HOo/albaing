import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';

const UserEditModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userPhone: '',
        userBirthdate: '',
        userGender: '',
        userAddress: '',
        userIsAdmin: false
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            // 날짜 형식 변환 (서버에서 받은 형식을 input[type="date"]에 맞게)
            let formattedBirthdate = '';
            if (user.userBirthdate) {
                try {
                    formattedBirthdate = format(new Date(user.userBirthdate), 'yyyy-MM-dd');
                } catch (error) {
                    console.error('날짜 형식 변환 오류:', error);
                }
            }

            setFormData({
                userId: user.userId,
                userName: user.userName || '',
                userEmail: user.userEmail || '',
                userPhone: user.userPhone || '',
                userBirthdate: formattedBirthdate,
                userGender: user.userGender || 'male',
                userAddress: user.userAddress || '',
                userIsAdmin: user.userIsAdmin || false,
                // 필수 필드 추가 - 데이터 누락 방지
                userPassword: user.userPassword || '',
                userProfileImage: user.userProfileImage || '',
                userTermsAgreement: user.userTermsAgreement || false
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.userName.trim()) {
            newErrors.userName = '이름을 입력해주세요';
        }
        if (!formData.userEmail.trim()) {
            newErrors.userEmail = '이메일을 입력해주세요';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
            newErrors.userEmail = '유효한 이메일 형식이 아닙니다';
        }
        if (formData.userPhone && !/^01[016789]-?\d{3,4}-?\d{4}$/.test(formData.userPhone)) {
            newErrors.userPhone = '유효한 전화번호 형식이 아닙니다';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);

            // 기존 사용자 데이터와 새 데이터 병합하여 필수 필드 누락 방지
            const updatedData = {
                ...user, // 기존 데이터 모두 포함
                ...formData, // 수정된 데이터로 덮어쓰기
                // 날짜 데이터는 특별히 처리
                userBirthdate: formData.userBirthdate || null,
                // 서버에서 필요한 다른 필드 유지
                userCreatedAt: user.userCreatedAt,
                userUpdatedAt: new Date()
            };

            onUpdate(updatedData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h3 className="text-xl font-semibold text-gray-800">회원 정보 수정</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                                이름 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg ${errors.userName ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.userName && <p className="mt-1 text-sm text-red-500">{errors.userName}</p>}
                        </div>

                        <div>
                            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                이메일 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="userEmail"
                                name="userEmail"
                                value={formData.userEmail}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-lg ${errors.userEmail ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.userEmail && <p className="mt-1 text-sm text-red-500">{errors.userEmail}</p>}
                        </div>

                        <div>
                            <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                전화번호
                            </label>
                            <input
                                type="text"
                                id="userPhone"
                                name="userPhone"
                                value={formData.userPhone}
                                onChange={handleChange}
                                placeholder="01012345678"
                                className={`w-full p-2 border rounded-lg ${errors.userPhone ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.userPhone && <p className="mt-1 text-sm text-red-500">{errors.userPhone}</p>}
                        </div>

                        <div>
                            <label htmlFor="userBirthdate" className="block text-sm font-medium text-gray-700 mb-1">
                                생년월일
                            </label>
                            <input
                                type="date"
                                id="userBirthdate"
                                name="userBirthdate"
                                value={formData.userBirthdate}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="userGender"
                                        value="male"
                                        checked={formData.userGender === 'male'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    남성
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="userGender"
                                        value="female"
                                        checked={formData.userGender === 'female'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    여성
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="userAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                주소
                            </label>
                            <input
                                type="text"
                                id="userAddress"
                                name="userAddress"
                                value={formData.userAddress}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="userIsAdmin"
                                    checked={formData.userIsAdmin}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700">관리자 권한</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            disabled={loading}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;