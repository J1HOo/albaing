import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '../../components';

const ResumeViewEditModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        resumeTitle: '',
        resumeLocation: '',
        resumeJobCategory: '',
        resumeJobType: '',
        resumeJobDuration: '',
        resumeWorkSchedule: '',
        resumeWorkTime: '',
        resumeJobSkill: '',
        resumeIntroduction: '',
        // 학력 정보
        eduDegree: '',
        eduStatus: '',
        eduSchool: '',
        eduMajor: '',
        eduAdmissionYear: '',
        eduGraduationYear: '',
        // 경력 정보
        careerIsCareer: '',
        careerCompanyName: '',
        careerJoinDate: '',
        careerQuitDate: '',
        careerJobDescription: ''
    });

    // 이력서 정보 가져오기
    useEffect(() => {
        if (isOpen && user && user.userId) {
            fetchResumeData();
        }
    }, [isOpen, user]);

    const fetchResumeData = () => {
        setLoading(true);
        setError(null);

        axios.get(`/api/admin/resumes/user/${user.userId}`)
            .then(response => {
                setResume(response.data);

                initFormData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('이력서 데이터 로딩 실패:', error);
                setError('이력서 정보를 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    // 폼 데이터 초기화
    const initFormData = (resumeData) => {
        if (!resumeData) return;

        setFormData({
            resumeTitle: resumeData.resumeTitle || '',
            resumeLocation: resumeData.resumeLocation || '',
            resumeJobCategory: resumeData.resumeJobCategory || '',
            resumeJobType: resumeData.resumeJobType || '',
            resumeJobDuration: resumeData.resumeJobDuration || '',
            resumeWorkSchedule: resumeData.resumeWorkSchedule || '',
            resumeWorkTime: resumeData.resumeWorkTime || '',
            resumeJobSkill: resumeData.resumeJobSkill || '',
            resumeIntroduction: resumeData.resumeIntroduction || '',
            // 학력 정보
            eduDegree: resumeData.educationHistory?.eduDegree || '',
            eduStatus: resumeData.educationHistory?.eduStatus || '',
            eduSchool: resumeData.educationHistory?.eduSchool || '',
            eduMajor: resumeData.educationHistory?.eduMajor || '',
            eduAdmissionYear: resumeData.educationHistory?.eduAdmissionYear || '',
            eduGraduationYear: resumeData.educationHistory?.eduGraduationYear || '',
            // 경력 정보
            careerIsCareer: resumeData.careerHistory?.careerIsCareer || '신입',
            careerCompanyName: resumeData.careerHistory?.careerCompanyName || '',
            careerJoinDate: resumeData.careerHistory?.careerJoinDate || '',
            careerQuitDate: resumeData.careerHistory?.careerQuitDate || '',
            careerJobDescription: resumeData.careerHistory?.careerJobDescription || ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const updateData = {
            resume: {
                resumeId: resume.resumeId,
                userId: resume.userId,
                resumeTitle: formData.resumeTitle,
                resumeLocation: formData.resumeLocation,
                resumeJobCategory: formData.resumeJobCategory,
                resumeJobType: formData.resumeJobType,
                resumeJobDuration: formData.resumeJobDuration,
                resumeWorkSchedule: formData.resumeWorkSchedule,
                resumeWorkTime: formData.resumeWorkTime,
                resumeJobSkill: formData.resumeJobSkill,
                resumeIntroduction: formData.resumeIntroduction
            },
            educationHistory: {
                educationId: resume.educationHistory?.educationId,
                resumeId: resume.resumeId,
                eduDegree: formData.eduDegree,
                eduStatus: formData.eduStatus,
                eduSchool: formData.eduSchool,
                eduMajor: formData.eduMajor,
                eduAdmissionYear: formData.eduAdmissionYear,
                eduGraduationYear: formData.eduGraduationYear
            },
            careerHistory: {
                careerId: resume.careerHistory?.careerId,
                resumeId: resume.resumeId,
                careerIsCareer: formData.careerIsCareer,
                careerCompanyName: formData.careerCompanyName,
                careerJoinDate: formData.careerJoinDate,
                careerQuitDate: formData.careerQuitDate,
                careerJobDescription: formData.careerJobDescription
            }
        };

        axios.put(`/api/admin/resumes/update/${resume.resumeId}`, updateData)
            .then(() => {
                fetchResumeData();
                setIsEditing(false);
                if (onUpdate) onUpdate();
            })
            .catch(error => {
                console.error('이력서 수정 실패:', error);
                setError('이력서 정보를 수정하는데 실패했습니다.');
                setLoading(false);
            });
    };

    if (!isOpen) return null;

    const jobCategories = ["외식/음료", "유통/판매", "문화/여가생활", "서비스", "사무/회계", "고객상담/리서치", "생산/건설/노무", "IT/기술", "디자인", "미디어", "운전/배달", "병원/간호/연구", "교육/강사"];

    const jobTypes = ["알바", "정규직", "계약직", "파견직", "인턴"];

    const jobDurations = ["무관", "하루", "1일~1개월", "1~3개월", "3~6개월", "6개월이상"];

    const workSchedules = ["무관", "평일", "주말"];

    const workTimes = ["무관", "오전(06:00~12:00)", "오후(12:00~18:00)", "저녁(18:00~24:00)", "새벽(00:00~06:00)"];

    const eduDegrees = ["고등학교", "전문학사", "학사", "석사", "박사", "기타"];

    const eduStatuses = ["졸업", "재학중", "휴학중", "수료", "중퇴", "자퇴", "졸업예정"];

    const careerTypes = ["신입", "경력"];


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {user?.userName}님의 이력서 {isEditing ? '수정' : '정보'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="p-6">
                        <LoadingSpinner message="이력서 정보를 불러오는 중..." fullScreen={false} />
                    </div>
                ) : error ? (
                    <div className="p-6">
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                            <p>{error}</p>
                        </div>
                    </div>
                ) : resume ? (
                    <div className="p-6">
                        {isEditing ? (
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* 기본 정보 섹션 */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">기본 정보</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                                    이력서 제목
                                                </label>
                                                <input
                                                    type="text"
                                                    id="resumeTitle"
                                                    name="resumeTitle"
                                                    value={formData.resumeTitle}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="resumeLocation" className="block text-sm font-medium text-gray-700 mb-1">
                                                    희망 근무지
                                                </label>
                                                <input
                                                    type="text"
                                                    id="resumeLocation"
                                                    name="resumeLocation"
                                                    value={formData.resumeLocation}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="resumeJobCategory" className="block text-sm font-medium text-gray-700 mb-1">
                                                    희망 직종
                                                </label>
                                                <select
                                                    id="resumeJobCategory"
                                                    name="resumeJobCategory"
                                                    value={formData.resumeJobCategory}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">선택</option>
                                                    {jobCategories.map(category => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="resumeJobType" className="block text-sm font-medium text-gray-700 mb-1">
                                                    고용형태
                                                </label>
                                                <select
                                                    id="resumeJobType"
                                                    name="resumeJobType"
                                                    value={formData.resumeJobType}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">선택</option>
                                                    {jobTypes.map(type => (
                                                        <option key={type} value={type}>{type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="resumeJobDuration" className="block text-sm font-medium text-gray-700 mb-1">
                                                    근무 기간
                                                </label>
                                                <select
                                                    id="resumeJobDuration"
                                                    name="resumeJobDuration"
                                                    value={formData.resumeJobDuration}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">선택</option>
                                                    {jobDurations.map(duration => (
                                                        <option key={duration} value={duration}>{duration}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="resumeWorkSchedule" className="block text-sm font-medium text-gray-700 mb-1">
                                                    근무 요일
                                                </label>
                                                <select
                                                    id="resumeWorkSchedule"
                                                    name="resumeWorkSchedule"
                                                    value={formData.resumeWorkSchedule}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">선택</option>
                                                    {workSchedules.map(schedule => (
                                                        <option key={schedule} value={schedule}>{schedule}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="resumeWorkTime" className="block text-sm font-medium text-gray-700 mb-1">
                                                    근무 시간
                                                </label>
                                                <select
                                                    id="resumeWorkTime"
                                                    name="resumeWorkTime"
                                                    value={formData.resumeWorkTime}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">선택</option>
                                                    {workTimes.map(time => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="resumeJobSkill" className="block text-sm font-medium text-gray-700 mb-1">
                                                    보유 기술/자격증
                                                </label>
                                                <input
                                                    type="text"
                                                    id="resumeJobSkill"
                                                    name="resumeJobSkill"
                                                    value={formData.resumeJobSkill}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                    placeholder="쉼표(,)로 구분하여 입력"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="resumeIntroduction" className="block text-sm font-medium text-gray-700 mb-1">
                                                    자기소개
                                                </label>
                                                <textarea
                                                    id="resumeIntroduction"
                                                    name="resumeIntroduction"
                                                    value={formData.resumeIntroduction}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 학력 정보 섹션 */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">학력 정보</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="eduDegree" className="block text-sm font-medium text-gray-700 mb-1">
                                                    학위
                                                </label>
                                                <select
                                                    id="eduDegree"
                                                    name="eduDegree"
                                                    value={formData.eduDegree}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">선택</option>
                                                    {eduDegrees.map(degree => (
                                                        <option key={degree} value={degree}>{degree}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="eduStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                                    상태
                                                </label>
                                                <select
                                                    id="eduStatus"
                                                    name="eduStatus"
                                                    value={formData.eduStatus}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">선택</option>
                                                    {eduStatuses.map(status => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="eduSchool" className="block text-sm font-medium text-gray-700 mb-1">
                                                    학교명
                                                </label>
                                                <input
                                                    type="text"
                                                    id="eduSchool"
                                                    name="eduSchool"
                                                    value={formData.eduSchool}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="eduMajor" className="block text-sm font-medium text-gray-700 mb-1">
                                                    전공
                                                </label>
                                                <input
                                                    type="text"
                                                    id="eduMajor"
                                                    name="eduMajor"
                                                    value={formData.eduMajor}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="eduAdmissionYear" className="block text-sm font-medium text-gray-700 mb-1">
                                                    입학년도
                                                </label>
                                                <input
                                                    type="text"
                                                    id="eduAdmissionYear"
                                                    name="eduAdmissionYear"
                                                    value={formData.eduAdmissionYear}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                    placeholder="YYYY"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="eduGraduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                                                    졸업년도
                                                </label>
                                                <input
                                                    type="text"
                                                    id="eduGraduationYear"
                                                    name="eduGraduationYear"
                                                    value={formData.eduGraduationYear}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                    placeholder="YYYY"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 경력 정보 섹션 */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">경력 정보</h2>
                                        <div className="mb-4">
                                            <div className="flex space-x-4 mb-4">
                                                {careerTypes.map(type => (
                                                    <label key={type} className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="careerIsCareer"
                                                            value={type}
                                                            checked={formData.careerIsCareer === type}
                                                            onChange={handleChange}
                                                            className="mr-2"
                                                        />
                                                        {type}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {formData.careerIsCareer === '경력' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="careerCompanyName" className="block text-sm font-medium text-gray-700 mb-1">
                                                        회사명
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="careerCompanyName"
                                                        name="careerCompanyName"
                                                        value={formData.careerCompanyName}
                                                        onChange={handleChange}
                                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="careerJoinDate" className="block text-sm font-medium text-gray-700 mb-1">
                                                        입사일
                                                    </label>
                                                    <input
                                                        type="month"
                                                        id="careerJoinDate"
                                                        name="careerJoinDate"
                                                        value={formData.careerJoinDate}
                                                        onChange={handleChange}
                                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="careerQuitDate" className="block text-sm font-medium text-gray-700 mb-1">
                                                        퇴사일
                                                    </label>
                                                    <input
                                                        type="month"
                                                        id="careerQuitDate"
                                                        name="careerQuitDate"
                                                        value={formData.careerQuitDate}
                                                        onChange={handleChange}
                                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">현재 재직중인 경우 비워두세요</p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label htmlFor="careerJobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                                        직무 내용
                                                    </label>
                                                    <textarea
                                                        id="careerJobDescription"
                                                        name="careerJobDescription"
                                                        value={formData.careerJobDescription}
                                                        onChange={handleChange}
                                                        rows="3"
                                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
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
                        ) : (
                            <>
                                {/* 조회 모드 */}
                                <div className="space-y-8">
                                    {/* 기본 정보 */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">기본 정보</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">이력서 제목</h3>
                                                <p className="mt-1">{resume.resumeTitle || '-'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">희망 근무지</h3>
                                                <p className="mt-1">{resume.resumeLocation || '-'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">희망 직종</h3>
                                                <p className="mt-1">{resume.resumeJobCategory || '-'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">고용형태</h3>
                                                <p className="mt-1">{resume.resumeJobType || '-'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">근무 기간</h3>
                                                <p className="mt-1">{resume.resumeJobDuration || '-'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">근무 요일</h3>
                                                <p className="mt-1">{resume.resumeWorkSchedule || '-'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">근무 시간</h3>
                                                <p className="mt-1">{resume.resumeWorkTime || '-'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">보유 기술/자격증</h3>
                                                <p className="mt-1">{resume.resumeJobSkill || '-'}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <h3 className="text-sm font-medium text-gray-500">자기소개</h3>
                                                <p className="mt-1 whitespace-pre-line">{resume.resumeIntroduction || '-'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 학력 정보 */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">학력 정보</h2>
                                        {resume.educationHistory ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">학위</h3>
                                                    <p className="mt-1">{resume.educationHistory.eduDegree || '-'}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">상태</h3>
                                                    <p className="mt-1">{resume.educationHistory.eduStatus || '-'}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">학교명</h3>
                                                    <p className="mt-1">{resume.educationHistory.eduSchool || '-'}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">전공</h3>
                                                    <p className="mt-1">{resume.educationHistory.eduMajor || '-'}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">입학년도</h3>
                                                    <p className="mt-1">{resume.educationHistory.eduAdmissionYear || '-'}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">졸업년도</h3>
                                                    <p className="mt-1">{resume.educationHistory.eduGraduationYear || '-'}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">학력 정보가 없습니다.</p>
                                        )}
                                    </div>

                                    {/* 경력 정보 */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">경력 정보</h2>
                                        {resume.careerHistory ? (
                                            <div>
                                                <div className="mb-4">
                                                    <h3 className="text-sm font-medium text-gray-500">경력 유형</h3>
                                                    <p className="mt-1">{resume.careerHistory.careerIsCareer || '신입'}</p>
                                                </div>

                                                {resume.careerHistory.careerIsCareer === '경력' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">회사명</h3>
                                                            <p className="mt-1">{resume.careerHistory.careerCompanyName || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">입사일</h3>
                                                            <p className="mt-1">{resume.careerHistory.careerJoinDate || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">퇴사일</h3>
                                                            <p className="mt-1">
                                                                {resume.careerHistory.careerQuitDate || '재직중'}
                                                            </p>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <h3 className="text-sm font-medium text-gray-500">직무 내용</h3>
                                                            <p className="mt-1 whitespace-pre-line">
                                                                {resume.careerHistory.careerJobDescription || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">경력 정보가 없습니다.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                                    >
                                        이력서 수정
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        닫기
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                            <p>이력서 정보가 없습니다.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResumeViewEditModal;