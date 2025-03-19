import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import apiMyPageService from "../../../service/apiMyPageService";

const MyPage = () => {

    const {userId} = useParams();
    const [user, setUser] = useState(null);
    const [resume, setResume] = useState(null);

    const activityStats = {
        scrapCount: "",
        applicationCount: "",
        reviewCount: ""
    };

    useEffect(() => {
        apiMyPageService.getUserById(userId, setUser);
        apiMyPageService.getResumeById(userId, setResume);
    }, [userId]);

    if (!user) return <div className="text-center mt-10">사용자 정보를 불러오는 중...</div>;
    if (!resume) return <div className="text-center mt-10">이력서를 불러오는 중...</div>;


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 프로필 섹션 */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            {user.userProfileImage ? (
                                <img
                                    src={user.userProfileImage}
                                    alt="프로필"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <svg xmlns="<http://www.w3.org/2000/svg>" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.userName}</h2>
                    <br/>
                        <p className="text-gray-600 mb-4">이메일 : {user.userEmail}</p>
                        <p className="text-gray-600 mb-4">생년월일 : {user.userBirthdate}</p>
                        <Link to={`/mypage/user/${userId}/edit`}>
                            <button
                                className="w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                프로필 수정
                            </button>
                        </Link>

                    </div>
                </div>

                {/* 대시보드 섹션 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 이력서 카드 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <svg xmlns="<http://www.w3.org/2000/svg>" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900"><Link to="/resumes">{resume.resumeTitle}</Link></h3>
                            </div>
                            <button
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                            ><Link to = {"/resumes/edit"}> 수정하기</Link>
                            </button>
                        </div>
                        {resume ? (
                            <div>
                                {/*<h5 className="text-lg font-medium text-gray-800"><Link to="/resumes"></Link></h5>*/}
                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div>
                                        <strong>희망 직종:</strong> {resume.resumeJobCategory || '미등록'}
                                    </div>
                                    <div>
                                        <strong>근무 형태:</strong> {resume.resumeJobType || '미등록'}
                                    </div>
                                    <div>
                                        <strong>희망 근무기간 :</strong> {resume.resumeJobDuration || '미등록'}
                                    </div>
                                    <div>
                                        <strong>희망 근무지:</strong> {resume.resumeLocation || '미등록'}
                                    </div>
                                    <div>
                                        <strong>보유스킬 :</strong> {resume.resumeJobSkill || '미등록'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                            <p className="text-gray-500 mb-2">등록된 이력서가 없습니다.</p>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    이력서 작성하기
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 활동 요약 카드 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <svg xmlns="<http://www.w3.org/2000/svg>" className="h-6 w-6 text-green-500 mr-2"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-900">내 활동</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link to={`/mypage/scraps/${userId}`}>
                                <ActivityCard
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"/>
                                        </svg>
                                    }
                                    title="스크랩"
                                    count={activityStats.scrapCount}
                                />
                            </Link>

                            <Link to={`/mypage/applications/${userId}`}>
                                <ActivityCard
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                    }
                                    title="지원 현황"
                                    count={activityStats.applicationCount}
                                />
                            </Link>

                            <Link to={`/mypage/reviews/${userId}`}>
                                <ActivityCard
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                        </svg>
                                    }
                                    title="작성 리뷰"
                                    count={activityStats.reviewCount}
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

// 활동 요약 카드 컴포넌트
const ActivityCard = ({icon, title, count}) => (
    <div
        className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors group"
    >
        <div className="flex justify-center mb-2">
            {icon}
        </div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">{count}</p>
    </div>
);

export default MyPage;