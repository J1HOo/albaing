import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

import {useAuth} from "../../../../../contexts/AuthContext";
import {ErrorMessage, LoadingSpinner} from "../../../../../components";
import {
    UserIcon,
    EnvelopeIcon as MailIcon,
    PhoneIcon,
    CalendarIcon,
    DocumentArrowDownIcon as DocumentDownloadIcon
} from '@heroicons/react/24/outline';
import apiMyPageService from "../../../../../service/apiMyPageService";

const ResumeView = () => {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData , setUserData] =useState(null);


    const { resumeId,userId } = useParams();
    const navigate = useNavigate();
    const { userType} = useAuth();

    useEffect(() => {

        if (userType !== 'company') {
            navigate('/');
            return;

        }


        const fetchResumeDetail = () => {
            axios.get(`/api/resume/${resumeId}`)
                .then(response => {
                    setResumeData(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('이력서 조회 오류:', err);
                    setError('이력서를 불러오는 중 오류가 발생했습니다.');
                    setLoading(false);
                });
        };

        apiMyPageService.getUserById(userId, setUserData);
        fetchResumeDetail();
    }, [resumeId,userId,userType,navigate]);

    // PDF 다운로드 함수
    const handleDownloadPDF = () => {
        const element = document.getElementById('resume-detail-container');
        const opt = {
            margin: 10,
            filename: `${resumeData.resumeTitle || '이력서'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    if (loading) return <LoadingSpinner message="로딩 중..." />
    if (error) return <ErrorMessage message={error} />

    if (!resumeData) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-gray-500">이력서 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">이력서 상세</h1>
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <DocumentDownloadIcon className="h-5 w-5 mr-2" />
                    PDF 다운로드
                </button>
            </div>

            <div
                id="resume-detail-container"
                className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto"
            >
                {/* 개인 정보 섹션 */}
                <div className="border-b pb-6 mb-6">
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                            {userData.profileImage ? (
                                <img
                                    src={userData.profileImage}
                                    alt="프로필 사진"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <UserIcon className="h-12 w-12 text-blue-500" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{userData.userName}</h2>
                            <div className="mt-2 space-y-1 text-gray-600">
                                <div className="flex items-center">
                                    <MailIcon className="h-4 w-4 mr-2 text-blue-500" />
                                    <span>{userData.userEmail}</span>
                                </div>
                                <div className="flex items-center">
                                    <PhoneIcon className="h-4 w-4 mr-2 text-blue-500" />
                                    <span>{userData.userPhone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 이력서 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">기본 정보</h3>
                        <div className="space-y-2 text-gray-600">
                            <p><strong>이력서 제목:</strong> {resumeData.resumeTitle}</p>
                            <p><strong>희망 직종:</strong> {resumeData.resumeJobCategory || '미입력'}</p>
                            <p><strong>희망 근무지:</strong> {resumeData.resumeLocation || '미입력'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">근무 조건</h3>
                        <div className="space-y-2 text-gray-600">
                            <p><strong>고용 형태:</strong> {resumeData.resumeJobType || '미입력'}</p>
                            <p><strong>근무 기간:</strong> {resumeData.resumeJobDuration || '미입력'}</p>
                            <p><strong>근무 요일:</strong> {resumeData.resumeWorkSchedule || '미입력'}</p>
                            <p><strong>근무 시간:</strong> {resumeData.resumeWorkTime || '미입력'}</p>
                        </div>
                    </div>
                </div>

                {/* 학력 정보 */}
                <div className="border-b pb-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">학력 정보</h3>
                    {resumeData.educationHistory ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-3">
                                <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                                <h4 className="text-lg font-medium">
                                    {resumeData.educationHistory.eduSchool}
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <strong>학위:</strong> {resumeData.educationHistory.eduDegree || '미입력'}
                                </div>
                                <div>
                                    <strong>전공:</strong> {resumeData.educationHistory.eduMajor || '미입력'}
                                </div>
                                <div>
                                    <strong>상태:</strong> {resumeData.educationHistory.eduStatus || '미입력'}
                                </div>
                                <div>
                                    <strong>기간:</strong> {resumeData.educationHistory.eduAdmissionYear || '미입력'}
                                    {' ~ '}
                                    {resumeData.educationHistory.eduStatus === '재학중'
                                        ? '현재'
                                        : (resumeData.educationHistory.eduGraduationYear || '미입력')
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">학력 정보가 없습니다.</p>
                    )}
                </div>

                {/* 경력 정보 */}
                <div className="border-b pb-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">경력 정보</h3>
                    {resumeData.careerHistory ? (
                        resumeData.careerHistory.careerIsCareer === '신입' ? (
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <p className="text-blue-800 font-medium">신입</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center mb-3">
                                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                                    <h4 className="text-lg font-medium">
                                        {resumeData.careerHistory.careerCompanyName}
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <strong>입사일:</strong> {resumeData.careerHistory.careerJoinDate || '미입력'}
                                    </div>
                                    <div>
                                        <strong>퇴사일:</strong> {resumeData.careerHistory.careerQuitDate || '재직중'}
                                    </div>
                                    <div className="md:col-span-2">
                                        <strong>직무 내용:</strong>
                                        <p className="mt-1 text-gray-700">
                                            {resumeData.careerHistory.careerJobDescription || '미입력'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        <p className="text-gray-500">경력 정보가 없습니다.</p>
                    )}
                </div>

                {/* 보유 스킬 */}
                <div className="border-b pb-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">보유 스킬</h3>
                    {resumeData.resumeJobSkill ? (
                        <div className="flex flex-wrap gap-2">
                            {resumeData.resumeJobSkill.split(',').map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">등록된 스킬이 없습니다.</p>
                    )}
                </div>

                {/* 자기소개 */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">자기소개</h3>
                    {resumeData.resumeIntroduction ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700 whitespace-pre-line">
                                {resumeData.resumeIntroduction}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500">자기소개가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeView;