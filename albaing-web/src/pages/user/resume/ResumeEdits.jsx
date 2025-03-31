import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from '../../../contexts/AuthContext';
import EducationModal from '../../../components/modals/EducationModal';
import CareerModal from '../../../components/modals/CareerModal';
import apiResumeService from "../../../service/apiResumeService";
import {ErrorMessage, LoadingSpinner, SuccessMessage} from "../../../components";
import {AddressModal} from "../../../components/modals/AddressModal";

const ResumeEdits = () => {
    const [resumeData, setResumeData] = useState({
        resumeId: null,
        userId: null,
        resumeTitle: '',
        resumeLocation: '',
        resumeJobCategory: '',
        resumeJobType: '',
        resumeJobDuration: '',
        resumeWorkSchedule: '',
        resumeWorkTime: '',
        resumeJobSkill: '',
        resumeIntroduction: '',
        educationHistory: null,
        careerHistory: []
    });

    const [showEducationModal, setShowEducationModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [preferredLocation, setPreferredLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [activeSection, setActiveSection] = useState('basic');

    //경력
    const [currentCareer, setCurrentCareer] = useState(null);
    const [showCareerModal, setShowCareerModal] = useState(false);

    //근무지
    const location = useLocation();
    const {userData} = useAuth();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const resumeId = queryParams.get('resumeId');

    const jobCategories = [
        '외식/음료', '유통/판매', '문화/여가생활', '서비스', '사무/회계',
        '고객상담/리서치', '생산/건설/노무', 'IT/기술', '디자인', '미디어',
        '운전/배달', '병원/간호/연구', '교육/강사'
    ];

    const jobTypes = ['알바', '정규직', '계약직', '파견직', '인턴'];
    const workingPeriods = ['무관', '하루', '1일~1개월', '1~3개월', '3~6개월', '6개월이상'];
    const workSchedules = ['무관', '평일', '주말'];
    const shiftHours = ['무관', '오전(06:00~12:00)', '오후(12:00~18:00)', '저녁(18:00~24:00)', '새벽(00:00~06:00)'];


    const handleAddressComplete = (addressData) => {
        setPreferredLocation(addressData.cityDistrict);
        setResumeData(prev => ({
            ...prev,
            resumeLocation: addressData.cityDistrict
        }));
        setShowAddressModal(false);
    };

    useEffect(() => {

        const fetchResume = () => {
            setLoading(true);
            setError(null);

            // resumeId가 있고 undefined가 아닌 경우
            if (resumeId && resumeId !== 'undefined') {
                apiResumeService.getResume(resumeId)
                    .then(data => {
                        setResumeData(
                            data || resumeData
                        );
                        setPreferredLocation(data.resumeLocation || "");
                        setLoading(false);
                    })
            } else if (userData?.userId) {
                apiResumeService.getResumeByUserId(userData.userId)
                    .then(data => {
                        setResumeData(data || resumeData);
                        setLoading(false);
                    })
                    .catch(error => {
                        setError(`이력서 정보를 불러오는 중 오류가 발생했습니다: ${error.message}`);
                        setLoading(false);
                    });
            }
        };

        fetchResume();
    }, [userData, resumeId]);


    const validateForm = () => {
        const errors = {};

        if (!resumeData.resumeTitle?.trim()) {
            errors.resumeTitle = '이력서 제목을 입력해주세요.';
        }

        if (!resumeData.resumeId) {
            errors.resumeId = '이력서 ID가 없습니다. 다시 로그인 후 시도해주세요.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setResumeData(prev => ({
            ...prev,
            [name]: value
        }));


        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleEducationUpdate = (educationData) => {

        setResumeData(prev => {
            const updated = {
                ...prev,
                educationHistory: {
                    ...educationData,
                    resumeId: prev.resumeId
                }
            };
            return updated;
        });
        setShowEducationModal(false);
    };

    // 경력 추가/수정 함수
    const handleCareerUpdate = (careerData) => {
        setResumeData(prev => {
            // careerHistory가 배열인지 확인하고, 아니면 빈 배열로 초기화
            const currentCareerHistory = Array.isArray(prev.careerHistory) ? [...prev.careerHistory] : [];

            // 현재 편집 중인 경력이 있는지 확인
            if (currentCareer && currentCareer.careerId) {
                // 기존 항목 업데이트
                const existingIndex = currentCareerHistory.findIndex(career =>
                    career.careerId === currentCareer.careerId
                );

                if (existingIndex >= 0) {
                    currentCareerHistory[existingIndex] = {
                        ...careerData,
                        careerId: currentCareer.careerId,
                        resumeId: prev.resumeId
                    };
                }
            } else {
                // 새 항목 추가
                currentCareerHistory.push({
                    ...careerData,
                    careerId: `temp-${Date.now()}`, // 임시 ID
                    resumeId: prev.resumeId
                });
            }
            console.log("추가된 경력 : ", currentCareerHistory);

            return {
                ...prev,
                careerHistory: currentCareerHistory
            };
        });
        // 편집 완료 후 상태 초기화
        setCurrentCareer(null);
        setShowCareerModal(false);
    };

    // 경력 수정 함수
    const handleEditCareer = (index) => {
        // 배열이 존재하는지 확인
        if (Array.isArray(resumeData.careerHistory) && resumeData.careerHistory[index]) {
            const careerToEdit = resumeData.careerHistory[index];
            setCurrentCareer(careerToEdit);
            setShowCareerModal(true);
        }
    };

    // 새 경력 추가
    const handleAddCareer = () => {
        // 현재 편집 중인 경력을 초기화
        setCurrentCareer(null);
        setShowCareerModal(true);
    };

    // 경력 삭제 함수
    const handleDeleteCareer = (index) => {
        if (!window.confirm('이 경력 항목을 삭제하시겠습니까?')) {
            return;
        }

        // resumeData.careerHistory에서 직접 삭제할 항목 참조
        const careerToDelete = resumeData.careerHistory[index];

        if (!careerToDelete || !careerToDelete.careerId) {
            alert("삭제할 경력의 ID가 없습니다.");
            return;
        }

        if (!resumeId) {
            alert("이력서 ID를 찾을 수 없습니다.");
            return;
        }

        apiResumeService.deleteCareer(careerToDelete.careerId, Number(resumeId))
            .then(() => {
                // 성공 시 상태 업데이트
                setResumeData(prev => ({
                    ...prev,
                    careerHistory: prev.careerHistory.filter((_, i) => i !== index)
                }));
            })
            .catch(error => {
                console.error("경력 삭제 중 오류 발생:", error);
                alert("경력 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
            });
    };

    const handleSaveResume = () => {
        if (!validateForm()) {
            window.scrollTo(0, 0);
            return;
        }

        setSaving(true);
        setError(null);
        setSuccess(false);

        // careerHistory가 배열인지 확인하고 임시 ID 처리
        const careerHistoryData = Array.isArray(resumeData.careerHistory)
            ? resumeData.careerHistory.map(career => {
                const processedCareer = {...career};
                // 임시 ID 제거
                if (typeof processedCareer.careerId === 'string' && processedCareer.careerId.startsWith('temp-')) {
                    delete processedCareer.careerId;
                }
                return processedCareer;
            })
            : [];

        const requestData = {
            resume: {
                resumeId: resumeData.resumeId,
                userId: resumeData.userId,
                resumeTitle: resumeData.resumeTitle,
                resumeLocation: resumeData.resumeLocation,
                resumeJobCategory: resumeData.resumeJobCategory,
                resumeJobType: resumeData.resumeJobType,
                resumeJobDuration: resumeData.resumeJobDuration,
                resumeWorkSchedule: resumeData.resumeWorkSchedule,
                resumeWorkTime: resumeData.resumeWorkTime,
                resumeJobSkill: resumeData.resumeJobSkill,
                resumeIntroduction: resumeData.resumeIntroduction
            },
            educationHistory: resumeData.educationHistory || null,
            careerHistory: careerHistoryData
        };

        apiResumeService.updateResume(resumeData.resumeId, requestData)
            .then(() => {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/resumes');
                }, 2000);
            })
            .catch(error => {
                setError('이력서를 저장하는 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
                window.scrollTo(0, 0);
            })
            .finally(() => {
                setSaving(false);
            });
    };

    if (loading) {
        return <LoadingSpinner message="이력서 정보를 불러오는 중..."/>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">이력서 수정</h1>
                <p className="text-gray-600">이력서를 수정하여 다양한 일자리에 지원해보세요.</p>
            </div>

            {error && <ErrorMessage message={error}/>}
            {success && <SuccessMessage message="이력서가 성공적으로 저장되었습니다. 잠시 후 이력서 페이지로 이동합니다."/>}

            {/* 섹션 네비게이션 */}
            <div className="mb-8 bg-white rounded-lg shadow-sm p-2 flex flex-wrap justify-between">
                <button
                    onClick={() => setActiveSection('basic')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        activeSection === 'basic'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    기본 정보
                </button>
                <button
                    onClick={() => setActiveSection('education')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        activeSection === 'education'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    학력 정보
                </button>
                <button
                    onClick={() => setActiveSection('career')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        activeSection === 'career'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    경력 정보
                </button>
                <button
                    onClick={() => setActiveSection('skills')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        activeSection === 'skills'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    보유 스킬
                </button>
                <button
                    onClick={() => setActiveSection('introduction')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        activeSection === 'introduction'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    자기소개
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                {/* 기본 정보 섹션 */}
                {activeSection === 'basic' && (
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">기본
                            정보</h2>

                        <div className="mb-6">
                            <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                이력서 제목 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="resumeTitle"
                                name="resumeTitle"
                                value={resumeData.resumeTitle || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="이력서 제목을 입력하세요"
                                required
                            />
                            {formErrors.resumeTitle && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.resumeTitle}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    희망 근무지
                                </label>
                                <input
                                    type="text"
                                    id="resumeLocation"
                                    name="resumeLocation"
                                    value={preferredLocation}
                                    readOnly
                                    placeholder="희망 근무지역을 검색하세요"
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                    onClick={() => setShowAddressModal(true)}
                                />


                                {showAddressModal && (
                                    <AddressModal
                                        onComplete={handleAddressComplete}
                                        onClose={() => setShowAddressModal(false)}
                                    />
                                )}
                            </div>

                            <div>
                                <label htmlFor="resumeJobCategory"
                                       className="block text-sm font-medium text-gray-700 mb-1">
                                    희망 직종 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="resumeJobCategory"
                                    name="resumeJobCategory"
                                    value={resumeData.resumeJobCategory || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
                                >
                                    <option value="">선택</option>
                                    {jobCategories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="resumeJobType" className="block text-sm font-medium text-gray-700 mb-1">
                                    희망 고용형태 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="resumeJobType"
                                    name="resumeJobType"
                                    value={resumeData.resumeJobType || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
                                >
                                    <option value="">선택</option>
                                    {jobTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="resumeJobDuration"
                                       className="block text-sm font-medium text-gray-700 mb-1">
                                    희망 근무기간 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="resumeJobDuration"
                                    name="resumeJobDuration"
                                    value={resumeData.resumeJobDuration || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
                                >
                                    <option value="">선택</option>
                                    {workingPeriods.map((period, index) => (
                                        <option key={index} value={period}>{period}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="resumeWorkSchedule"
                                       className="block text-sm font-medium text-gray-700 mb-1">
                                    희망 근무요일 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="resumeWorkSchedule"
                                    name="resumeWorkSchedule"
                                    value={resumeData.resumeWorkSchedule || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
                                >
                                    <option value="">선택</option>
                                    {workSchedules.map((schedule, index) => (
                                        <option key={index} value={schedule}>{schedule}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="resumeWorkTime"
                                       className="block text-sm font-medium text-gray-700 mb-1">
                                    희망 근무시간 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="resumeWorkTime"
                                    name="resumeWorkTime"
                                    value={resumeData.resumeWorkTime || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
                                >
                                    <option value="">선택</option>
                                    {shiftHours.map((hour, index) => (
                                        <option key={index} value={hour}>{hour}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* 학력 정보 섹션 */}
                {activeSection === 'education' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">학력 정보</h2>
                            <button
                                type="button"
                                onClick={() => setShowEducationModal(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm transition-all flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                                {resumeData.educationHistory ? '수정' : '추가'}
                            </button>
                        </div>

                        {resumeData.educationHistory ? (
                            <div
                                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center mb-4">
                                    <span className="inline-block bg-blue-100 text-blue-800 p-3 rounded-full mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                                            <path
                                                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
                                        </svg>
                                    </span>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{resumeData.educationHistory.eduSchool || '학교명 미입력'}</h3>
                                        <p className="text-gray-600">
                                            {resumeData.educationHistory.eduDegree ? resumeData.educationHistory.eduDegree : ''}
                                            {resumeData.educationHistory.eduDegree && resumeData.educationHistory.eduMajor ? ' - ' : ''}
                                            {resumeData.educationHistory.eduMajor ? resumeData.educationHistory.eduMajor : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">재학상태</div>
                                        <div className="font-medium">
                                            {resumeData.educationHistory.eduStatus ? (
                                                <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                                                    resumeData.educationHistory.eduStatus === '졸업' ? 'bg-green-100 text-green-800' :
                                                        resumeData.educationHistory.eduStatus === '재학중' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {resumeData.educationHistory.eduStatus}
                                                </span>
                                            ) : '미입력'}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">학위</div>
                                        <div className="font-medium">
                                            {resumeData.educationHistory.eduDegree || '미입력'}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">전공</div>
                                        <div className="font-medium">
                                            {resumeData.educationHistory.eduMajor || '미입력'}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">기간</div>
                                        <div className="font-medium">
                                            {resumeData.educationHistory.eduAdmissionYear ? (
                                                <>
                                                    {resumeData.educationHistory.eduAdmissionYear} ~ {
                                                    resumeData.educationHistory.eduStatus === '재학중' ||
                                                    resumeData.educationHistory.eduStatus === '휴학중'
                                                        ? '현재'
                                                        : resumeData.educationHistory.eduGraduationYear || '미입력'
                                                }
                                                </>
                                            ) : '미입력'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3"
                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                                <p className="text-lg font-medium text-gray-500 mb-1">등록된 학력 정보가 없습니다.</p>
                                <p className="text-sm text-gray-400 mb-4">위에 있는 '추가' 버튼을 눌러 학력 정보를 등록해주세요.</p>
                                <button
                                    type="button"
                                    onClick={() => setShowEducationModal(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-sm transition-all inline-flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg>
                                    학력 정보 추가하기
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 경력 */}
                {activeSection === 'career' && (
                    <div className="p-6">
                        {/* 헤더 영역 */}
                        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">경력 정보</h2>
                            <button
                                type="button"
                                onClick={handleAddCareer}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm transition-all flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                                추가
                            </button>
                        </div>

                        {/* 경력 데이터 배열 변환 처리 */}
                        {(() => {
                            const careerList = Array.isArray(resumeData?.careerHistory)
                                ? resumeData.careerHistory
                                : resumeData.careerHistory
                                    ? [resumeData.careerHistory]  // 객체라면 배열로 변환
                                    : [];
                            return careerList.length > 0 ? (
                                careerList.map((career, index) => (
                                    <div key={index}
                                         className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all mb-4">
                                        {/* 회사명 & 직무 정보 */}
                                        <div className="flex items-center mb-4">
                            <span className="inline-block bg-blue-100 text-blue-800 p-3 rounded-full mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </span>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{career.careerCompanyName || '회사명 미입력'}</h3>
                                                <p className="text-gray-600">{career.careerJobDescription || '직무 미입력'}</p>
                                            </div>
                                        </div>

                                        {/* 입사/퇴사일 & 직무 내용 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="text-sm text-gray-500 mb-1">입사일</div>
                                                <div className="font-medium">{career.careerJoinDate || '미입력'}</div>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="text-sm text-gray-500 mb-1">퇴사일</div>
                                                <div className="font-medium">{career.careerQuitDate || '재직중'}</div>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                                                <div className="text-sm text-gray-500 mb-1">직무 내용</div>
                                                <div
                                                    className="font-medium">{career.careerJobDescription || '미입력'}</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-auto">
                                            <button
                                                type="button"
                                                onClick={() => handleEditCareer(index)}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all"
                                            >
                                                수정
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteCareer(index)}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* 경력 정보가 없을 때 */
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         className="h-12 w-12 mx-auto text-gray-400 mb-3"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg>
                                    <p className="text-lg font-medium text-gray-500 mb-1">등록된 경력 정보가 없습니다.</p>
                                    <p className="text-sm text-gray-400 mb-4">위에 있는 '추가' 버튼을 눌러 경력 정보를 등록해주세요.</p>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 보유 스킬 섹션 */}
                {activeSection === 'skills' && (
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">보유
                            스킬</h2>

                        <div className="mb-6">
                            <label htmlFor="resumeJobSkill" className="block text-sm font-medium text-gray-700 mb-2">
                                보유 스킬 <span className="text-gray-500 font-normal">(쉼표로 구분하여 입력)</span>
                            </label>
                            <textarea
                                id="resumeJobSkill"
                                name="resumeJobSkill"
                                value={resumeData.resumeJobSkill || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="예: MS Office, 운전면허, 영어회화, 프레젠테이션 능력"
                                rows={3}
                            ></textarea>
                            <p className="mt-2 text-sm text-gray-500">
                                보유하고 계신 스킬을 쉼표(,)로 구분하여 입력해주세요. 자신의 역량과 강점을 나타낼 수 있는 스킬을 작성하면 취업에 도움이 됩니다.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                            <h3 className="font-medium text-gray-800 mb-3">스킬 작성 예시</h3>
                            <div className="flex flex-wrap gap-2">
                                {['MS Office', 'Python', 'Java', '영어회화', '운전면허', 'Photoshop', 'Excel 고급기능', '데이터분석', '외국어능력', 'CAD'].map((skill, index) => (
                                    <span key={index}
                                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {resumeData.resumeJobSkill && (
                            <div className="mt-6">
                                <h3 className="text-md font-medium text-gray-700 mb-3">현재 등록된 스킬</h3>
                                <div className="flex flex-wrap gap-2">
                                    {resumeData.resumeJobSkill.split(',').map((skill, index) => (
                                        skill.trim() && (
                                            <span key={index}
                                                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                {skill.trim()}
                                            </span>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 자기소개 섹션 */}
                {activeSection === 'introduction' && (
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">자기소개</h2>

                        <div className="mb-6">
                            <label htmlFor="resumeIntroduction"
                                   className="block text-sm font-medium text-gray-700 mb-2">
                                자기소개
                            </label>
                            <textarea
                                id="resumeIntroduction"
                                name="resumeIntroduction"
                                value={resumeData.resumeIntroduction || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="자신을 나타낼 수 있는 간단한 자기소개를 작성해주세요."
                                rows={6}
                            ></textarea>
                            <p className="mt-2 text-sm text-gray-500">
                                본인의 경험, 역량, 성격, 지원 동기 등을 포함하여 작성하면 채용 담당자에게 좋은 인상을 줄 수 있습니다.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-medium text-gray-800 mb-2">자기소개 작성 팁</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                <li>지원하는 직무와 관련된 본인의 경험을 구체적으로 작성하세요.</li>
                                <li>어떤 역량과 강점을 가지고 있는지 어필하세요.</li>
                                <li>해당 직무에 지원하게 된 동기와 열정을 표현하세요.</li>
                                <li>불필요하게 길지 않게 핵심 내용을 중심으로 작성하세요.</li>
                            </ul>
                        </div>
                    </div>
                )}
                {/* 저장 버튼 */}
                <div className="p-6 bg-gray-50 rounded-md flex justify-end">
                    <button
                        type="button"
                        onClick={handleSaveResume}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? '저장 중...' : '이력서 저장'}
                    </button>
                </div>

                {/* 학력 정보 모달 */}
                {showEducationModal && (
                    <EducationModal
                        educationData={resumeData.educationHistory}
                        majorData={resumeData.educationHistory}
                        onSave={handleEducationUpdate}
                        onCancel={() => setShowEducationModal(false)}
                    />
                )}

                {/* 경력 정보 모달 */}
                {showCareerModal && (
                    <CareerModal
                        careerData={currentCareer} // 수정: careerData -> currentCareer
                        onSave={handleCareerUpdate}
                        onCancel={() => {
                            setShowCareerModal(false);
                            setCurrentCareer(null); // 모달을 닫을 때 현재 편집 중인 경력 초기화
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ResumeEdits;