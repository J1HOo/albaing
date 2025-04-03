import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiResumeService from '../../../service/apiResumeService';
import { useAuth } from '../../../contexts/AuthContext';

const Resume = () => {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userData } = useAuth();

    useEffect(() => {
        const fetchResume = () => {
            if (!userData?.userId) {
                setLoading(false);
                setError('사용자 정보를 찾을 수 없습니다.');
                return;
            }

            setLoading(true);
            setError(null);

            // 이력서 ID로 조회 시도
            if (userData.resumeId) {
                apiResumeService.getResume(userData.resumeId)
                    .then(resumeData => {
                        setResume(resumeData);
                        setLoading(false);
                    })
                    .catch(error => {
                        // 실패할 경우 사용자 ID로 조회 시도
                        apiResumeService.getResumeByUserId(userData.userId)
                            .then(resumeData => {
                                setResume(resumeData);
                                setLoading(false);
                            })
                            .catch(error => {
                                setError('이력서를 불러오는 중 오류가 발생했습니다.');
                                setLoading(false);
                            });
                    });
            } else {
                // 사용자 ID로 조회 시도
                apiResumeService.getResumeByUserId(userData.userId)
                    .then(resumeData => {
                        setResume(resumeData);
                        setLoading(false);
                    })
                    .catch(error => {
                        setError('이력서를 불러오는 중 오류가 발생했습니다.');
                        setLoading(false);
                    });
            }
        };

        fetchResume();
    }, [userData]);


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                <p className="text-lg text-gray-600">이력서 정보를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6 max-w-lg w-full">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-medium text-red-800">오류가 발생했습니다</h3>
                            <p className="text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    새로고침
                </button>
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md mb-6 max-w-lg w-full">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-medium text-yellow-800">이력서를 찾을 수 없습니다</h3>
                            <p className="text-yellow-700 mt-1">이력서 정보를 불러오는데 문제가 발생했습니다. 이력서를 새로 작성해보세요.</p>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <Link
                        to="/resumes/new"
                        className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        이력서 작성하기
                    </Link>
                    <Link
                        to="/"
                        className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 shadow-sm transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
                        </svg>
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row items-center md:items-start">
                    <div className="mb-4 md:mb-0 md:mr-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                            {userData?.userProfileImage ? (
                                <img
                                    src={userData.userProfileImage}
                                    alt="프로필 사진"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{userData?.userName || '사용자'}</h1>
                        <div className="text-gray-600">
                            <div className="flex items-center justify-center md:justify-start mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>{userData?.userEmail || '이메일 정보 없음'}</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{userData?.userPhone || '연락처 정보 없음'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center bg-blue-50 p-6 rounded-lg mb-8">
                <div className="mb-4 md:mb-0 text-center md:text-left">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">이력서</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{resume.resumeTitle}</h1>
                    <p className="text-sm text-gray-600 mt-1">최종 수정일: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-3">
                    <Link
                        to={`/resumes/edit?resumeId=${resume.resumeId}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        수정하기
                    </Link>
                    <button
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm flex items-center"
                        onClick={() => window.print()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        인쇄
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">기본 정보</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-sm text-gray-600">희망 근무지</p>
                            </div>
                            <p className="text-lg font-medium">{resume.resumeLocation || '미등록'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-600">희망 직종</p>
                            </div>
                            <p className="text-lg font-medium">{resume.resumeJobCategory || '미등록'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-sm text-gray-600">희망 고용형태</p>
                            </div>
                            <p className="text-lg font-medium">{resume.resumeJobType || '미등록'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-gray-600">희망 근무기간</p>
                            </div>
                            <p className="text-lg font-medium">{resume.resumeJobDuration || '미등록'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-600">희망 근무요일</p>
                            </div>
                            <p className="text-lg font-medium">{resume.resumeWorkSchedule || '미등록'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-gray-600">희망 근무시간</p>
                            </div>
                            <p className="text-lg font-medium">{resume.resumeWorkTime || '미등록'}</p>
                        </div>
                    </div>
                </div>

                {/* 학력 정보 */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">학력 정보</h2>
                    {resume.educationHistory ? (
                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex items-center mb-3">
                                <span className="inline-block bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7" />
                                    </svg>
                                </span>
                                <div>
                                    <div className="text-lg font-semibold">{resume.educationHistory.eduSchool || '미입력'}</div>
                                    <div className="text-sm text-gray-600">
                                        {resume.educationHistory.eduDegree || ''}{' '}
                                        {resume.educationHistory.eduDegree && resume.educationHistory.eduMajor ? '- ' : ''}
                                        {resume.educationHistory.eduMajor || ''}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                <div className="bg-white p-3 rounded-md border border-gray-100">
                                    <div className="text-sm text-gray-500">재학상태</div>
                                    <div className="font-medium mt-1">
                                        {resume.educationHistory.eduStatus ?
                                            <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                                                resume.educationHistory.eduStatus === '졸업' ? 'bg-green-100 text-green-800' :
                                                    resume.educationHistory.eduStatus === '재학중' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                                {resume.educationHistory.eduStatus}
                                            </span> : '미입력'
                                        }
                                    </div>
                                </div>

                                <div className="bg-white p-3 rounded-md border border-gray-100">
                                    <div className="text-sm text-gray-500">기간</div>
                                    <div className="font-medium mt-1">
                                        {resume.educationHistory.eduAdmissionYear ? (
                                            <>
                                                {resume.educationHistory.eduAdmissionYear} ~ {
                                                resume.educationHistory.eduStatus === '재학중' || resume.educationHistory.eduStatus === '휴학중'
                                                    ? '현재'
                                                    : resume.educationHistory.eduGraduationYear || '미입력'
                                            }
                                            </>
                                        ) : '미입력'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">등록된 학력 정보가 없습니다.</p>
                    )}
                </div>

                {/* 경력 정보 */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">경력 정보</h2>

                    {resume?.careerHistory?.length > 0 ? (
                        resume.careerHistory.map((career, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                                {career.careerIsCareer === '신입' ? (
                                    <div className="text-center py-4">
                                        <span className="text-3xl mb-2 inline-block">🌱</span>
                                        <p className="text-lg font-semibold text-blue-700">신입</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-lg font-semibold">{career.careerCompanyName || "미입력"}</p>
                                        <p className="text-sm text-gray-600">
                                            {career.careerJoinDate} {career.careerJoinDate && career.careerQuitDate ? '~' : ''} {career.careerQuitDate || (career.careerJoinDate ? "재직중" : "")}
                                        </p>

                                        {/* 직무 내용이 있을 경우만 렌더링 */}
                                        {career.careerJobDescription && (
                                            <div className="mt-4 p-3 bg-white rounded-md border border-gray-100">
                                                <div className="text-sm text-gray-500 mb-1">직무 내용</div>
                                                <div className="whitespace-pre-line">
                                                    {career.careerJobDescription}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">등록된 경력 정보가 없습니다.</p>
                    )}
                </div>


                {/* 보유 스킬 */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">보유 스킬</h2>
                    {resume.resumeJobSkill ? (
                        <div className="flex flex-wrap gap-2">
                            {resume.resumeJobSkill.split(',').map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-200 inline-flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-md text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <p className="text-gray-500">등록된 스킬이 없습니다.</p>
                            <p className="text-sm text-gray-400 mt-1">이력서 수정 페이지에서 보유 스킬을 추가해보세요.</p>
                        </div>
                    )}
                </div>

                {/* 자기소개 */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">자기소개</h2>
                    {resume.resumeIntroduction ? (
                        <div className="bg-gray-50 p-5 rounded-md border-l-4 border-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <p className="text-gray-800 whitespace-pre-line leading-relaxed">{resume.resumeIntroduction}</p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-6 rounded-md text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <p className="text-gray-500">등록된 자기소개가 없습니다.</p>
                            <p className="text-sm text-gray-400 mt-1">이력서 수정 페이지에서 자기소개를 작성해보세요.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 공고 지원 안내 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm mt-8">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="mb-4 md:mb-0 md:mr-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="md:flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold text-blue-900 mb-2">알바잉에서 채용 공고를 확인해보세요!</h3>
                        <p className="text-blue-800 mb-4 max-w-xl">이력서를 작성했다면 다양한 채용 공고에 지원할 수 있습니다. 지금 바로 알바잉에서 준비된 다양한 일자리를 확인해보세요!</p>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                            채용공고 보러가기
                            <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resume;