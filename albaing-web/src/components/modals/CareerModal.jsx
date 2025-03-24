import React, { useState, useEffect } from 'react';

const CareerModal = ({ careerData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        careerIsCareer: '신입',
        careerCompanyName: '',
        careerJoinDate: '',
        careerQuitDate: '',
        careerJobDescription: ''
    });

    const careerTypes = ['신입', '경력'];

    useEffect(() => {
        if (careerData) {
            setFormData({
                careerIsCareer: careerData.careerIsCareer || '신입',
                careerCompanyName: careerData.careerCompanyName || '',
                careerJoinDate: careerData.careerJoinDate || '',
                careerQuitDate: careerData.careerQuitDate || '',
                careerJobDescription: careerData.careerJobDescription || ''
            });
        }
    }, [careerData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'careerIsCareer') {
            if (value === '신입') {
                setFormData({
                    careerIsCareer: '신입',
                    careerCompanyName: '',
                    careerJoinDate: '',
                    careerQuitDate: '',
                    careerJobDescription: ''
                });
            } else {
                setFormData(prev => ({
                    ...prev,
                    careerIsCareer: value
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 경력직인 경우 회사명과 입사일 필수
        if (formData.careerIsCareer === '경력') {
            if (!formData.careerCompanyName.trim()) {
                alert('회사명을 입력해주세요.');
                return;
            }

            if (!formData.careerJoinDate) {
                alert('입사일을 선택해주세요.');
                return;
            }
        }

        onSave({ ...formData });
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';

        if (/^\d{4}-\d{2}$/.test(dateString)) {
            return dateString;
        }

        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${year}-${month}`;
        } catch (error) {
            return '';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 animate-slideIn">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">
                        <span className="text-blue-600 mr-2">💼</span>
                        경력 정보 {careerData ? '수정' : '추가'}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">경력 유형</label>
                            <div className="flex gap-4">
                                {careerTypes.map((type) => (
                                    <label
                                        key={type}
                                        className={`flex-1 px-4 py-3 rounded-lg cursor-pointer border ${
                                            formData.careerIsCareer === type
                                                ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                        } transition-all flex items-center justify-center`}
                                    >
                                        <input
                                            type="radio"
                                            name="careerIsCareer"
                                            value={type}
                                            checked={formData.careerIsCareer === type}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        {type === '신입' ? '🌱 신입' : '🚀 경력'}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {formData.careerIsCareer === '경력' ? (
                            <div className="space-y-5 animate-fadeIn">
                                <div className="space-y-2">
                                    <label htmlFor="careerCompanyName" className="block text-sm font-medium text-gray-700">
                                        회사명 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="careerCompanyName"
                                        name="careerCompanyName"
                                        value={formData.careerCompanyName}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                        placeholder="회사명을 입력하세요"
                                        required={formData.careerIsCareer === '경력'}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="careerJoinDate" className="block text-sm font-medium text-gray-700">
                                            입사일 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="month"
                                            id="careerJoinDate"
                                            name="careerJoinDate"
                                            value={formatDateForInput(formData.careerJoinDate)}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                            required={formData.careerIsCareer === '경력'}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="careerQuitDate" className="block text-sm font-medium text-gray-700">
                                            퇴사일
                                        </label>
                                        <input
                                            type="month"
                                            id="careerQuitDate"
                                            name="careerQuitDate"
                                            value={formatDateForInput(formData.careerQuitDate)}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            현재 재직 중인 경우 비워두세요.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="careerJobDescription" className="block text-sm font-medium text-gray-700">
                                        직무 내용
                                    </label>
                                    <textarea
                                        id="careerJobDescription"
                                        name="careerJobDescription"
                                        value={formData.careerJobDescription}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                        placeholder="담당했던 직무와 주요 업무를 입력하세요"
                                    ></textarea>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100 text-center">
                                <div className="text-5xl mb-3">🌱</div>
                                <p className="text-blue-800 font-medium">신입으로 설정되었습니다.</p>
                                <p className="text-blue-600 text-sm mt-1">첫 직장에서 새로운 시작을 응원합니다!</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all font-medium"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all font-medium"
                        >
                            저장하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CareerModal;