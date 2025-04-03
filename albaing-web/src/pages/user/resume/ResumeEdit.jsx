import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../../../contexts/AuthContext';
import EducationModal from '../../../components/modals/EducationModal';
import CareerModal from '../../../components/modals/CareerModal';
import apiResumeService from "../../../service/apiResumeService";
import {ErrorMessage, LoadingSpinner, SuccessMessage} from "../../../components";
import {AddressModal} from "../../../components/modals/AddressModal";
import ResumeCareer from "./ResumeCareer";
import ResumeEducation from "./ResumeEducation";
import ResumeSkills from "./ResumeSkills";
import ResumeIntroduction from "./ResumeIntroduction";
import ResumeBasicInfo from "./ResumeBasicInfo";
import { ConfirmModal, AlertModal } from '../../../components';
import useModal from '../../../components/modals/useModal';

const ResumeEdit = () => {
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
    const [currentCareer, setCurrentCareer] = useState(null);
    const [showCareerModal, setShowCareerModal] = useState(false);

    // 모달 관련 상태
    const confirmModal = useModal();
    const alertModal = useModal();
    const [careerToDelete, setCareerToDelete] = useState(null);

    const location = useLocation();
    const {userData} = useAuth();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const resumeId = queryParams.get('resumeId');

    const jobCategories = ['외식/음료', '유통/판매', '문화/여가생활', '서비스', '사무/회계', '고객상담/리서치', '생산/건설/노무', 'IT/기술', '디자인', '미디어', '운전/배달', '병원/간호/연구', '교육/강사'];
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
            if (resumeId && resumeId !== 'undefined') {
                apiResumeService.getResume(resumeId)
                    .then(data => {
                        setResumeData(data || resumeData);
                        setPreferredLocation(data.resumeLocation || "");
                        setLoading(false);
                    });
            } else if (userData?.userId) {
                apiResumeService.getResumeByUserId(userData.userId)
                    .then(data => {
                        setResumeData(data || resumeData);
                        setPreferredLocation(data.resumeLocation || "");
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
        if (!resumeData.resumeTitle?.trim()) errors.resumeTitle = '이력서 제목을 입력해주세요.';
        if (!resumeData.resumeId) errors.resumeId = '이력서 ID가 없습니다. 다시 로그인 후 시도해주세요.';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setResumeData(prev => ({...prev, [name]: value}));
        if (formErrors[name]) {
            setFormErrors(prev => ({...prev, [name]: null}));
        }
    };

    const handleEducationUpdate = (educationData) => {
        setResumeData(prev => ({
            ...prev,
            educationHistory: {...educationData, resumeId: prev.resumeId}
        }));
        setShowEducationModal(false);
    };

    const handleCareerUpdate = (careerData) => {
        setResumeData(prev => {
            if (careerData.careerIsCareer === '신입') {
                const updatedData = {
                    ...prev,
                    careerHistory: [{
                        ...careerData,
                        careerId: careerData.careerId || `temp-${Date.now()}`,
                        resumeId: prev.resumeId
                    }]
                };
                return updatedData;
            }

            const existingCareerHistory = Array.isArray(prev.careerHistory)
                ? prev.careerHistory.filter(c => c.careerIsCareer !== '신입')
                : [];

            const updatedCareerHistory = careerData.careerId && existingCareerHistory.some(c => c.careerId === careerData.careerId)
                ? existingCareerHistory.map(c =>
                    c.careerId === careerData.careerId ? { ...careerData, resumeId: prev.resumeId } : c
                )
                : [
                    ...existingCareerHistory,
                    { ...careerData, careerId: careerData.careerId || `temp-${Date.now()}`, resumeId: prev.resumeId }
                ];

            return {
                ...prev,
                careerHistory: updatedCareerHistory
            };
        });

        setCurrentCareer(null);
        setShowCareerModal(false);
    };

    const handleEditCareer = (careerId) => {
        const list = Array.isArray(resumeData.careerHistory)
            ? resumeData.careerHistory
            : resumeData.careerHistory
                ? [resumeData.careerHistory]
                : [];

        const foundCareer = list.find(c => c.careerId === careerId);

        if (foundCareer) {
            setCurrentCareer(foundCareer);
            setShowCareerModal(true);
        } else {
            alertModal.openModal({
                title: '오류',
                message: '수정하려는 경력 항목을 찾을 수 없습니다.',
                type: 'error'
            });
        }
    };

    const handleAddCareer = () => {
        const isCurrentlyNewbie = resumeData.careerHistory?.some(c => c.careerIsCareer === '신입');

        if (isCurrentlyNewbie) {
            setCurrentCareer({
                careerIsCareer: '경력',
                careerCompanyName: '',
                careerJoinDate: '',
                careerQuitDate: '',
                careerJobDescription: ''
            });
        } else {
            setCurrentCareer(null);
        }

        setShowCareerModal(true);
    };

    const confirmDeleteCareer = (index) => {
        confirmModal.openModal({
            title: '경력 삭제',
            message: '이 경력 항목을 삭제하시겠습니까?',
            type: 'warning',
            onConfirm: () => handleDeleteCareer(index)
        });
    };

    const handleDeleteCareer = (index) => {
        if (index === null || index === undefined) return;

        const careerToDelete = resumeData.careerHistory[index];

        if (typeof careerToDelete?.careerId === 'string' && careerToDelete.careerId.startsWith('temp-')) {
            if (resumeData.careerHistory.length === 1) {
                setResumeData(prev => ({
                    ...prev,
                    careerHistory: [{
                        careerIsCareer: '신입',
                        careerCompanyName: '',
                        careerJoinDate: '',
                        careerQuitDate: '',
                        careerJobDescription: '',
                        careerId: `temp-${Math.random().toString(36).substr(2, 9)}`,
                        resumeId: prev.resumeId
                    }]
                }));
            } else {
                setResumeData(prev => ({
                    ...prev,
                    careerHistory: prev.careerHistory.filter((_, i) => i !== index)
                }));
            }
        }
        else if (careerToDelete?.careerId && resumeId) {
            apiResumeService.deleteCareer(careerToDelete.careerId, Number(resumeId))
                .then(() => {
                    if (resumeData.careerHistory.length === 1) {
                        setResumeData(prev => ({
                            ...prev,
                            careerHistory: [{
                                careerIsCareer: '신입',
                                careerCompanyName: '',
                                careerJoinDate: '',
                                careerQuitDate: '',
                                careerJobDescription: '',
                                careerId: `temp-${Math.random().toString(36).substr(2, 9)}`,
                                resumeId: prev.resumeId
                            }]
                        }));
                    } else {
                        setResumeData(prev => ({
                            ...prev,
                            careerHistory: prev.careerHistory.filter((_, i) => i !== index)
                        }));
                    }
                })
                .catch(error => {
                    alertModal.openModal({
                        title: '삭제 오류',
                        message: '경력 정보 삭제 중 오류가 발생했습니다.',
                        type: 'error'
                    });
                });
        }
        else {
            alertModal.openModal({
                title: '삭제 오류',
                message: '삭제할 수 없는 경력 정보입니다.',
                type: 'error'
            });
        }
    };

    const handleSaveResume = () => {
        if (!validateForm()) {
            window.scrollTo(0, 0);
            return;
        }
        setSaving(true);
        setError(null);
        setSuccess(false);
        const careerHistoryData = resumeData.careerHistory.map(career => {
            const processedCareer = { ...career };
            if (typeof processedCareer.careerId === 'string' && processedCareer.careerId.startsWith('temp-')) {
                processedCareer.careerId = null; // 서버에 insert 요청
            }
            return processedCareer;
        });

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
                setTimeout(() => navigate('/resumes'), 2000);
            })
            .catch(error => {
                setError('저장 오류: ' + (error.response?.data?.message || error.message));
                window.scrollTo(0, 0);
            })
            .finally(() => setSaving(false));
    };

    if (loading) return <LoadingSpinner message="이력서 정보를 불러오는 중..."/>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">이력서 수정</h1>
            {error && <ErrorMessage message={error}/>}
            {success && <SuccessMessage message="이력서가 저장되었습니다."/>}

            {/* 탭 네비게이션 - 개선된 디자인 */}
            <div className="mb-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="flex flex-wrap">
                        {[
                            { id: 'basic', label: '기본 정보', icon: '📝' },
                            { id: 'education', label: '학력 정보', icon: '🎓' },
                            { id: 'career', label: '경력 정보', icon: '💼' },
                            { id: 'skills', label: '보유 스킬', icon: '🛠️' },
                            { id: 'introduction', label: '자기소개', icon: '✨' }
                        ].map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center justify-center py-4 px-3 flex-1 min-w-[100px] transition-all
                                    ${activeSection === section.id
                                    ? 'bg-blue-500 text-white font-medium'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                <span className="mr-2">{section.icon}</span>
                                <span>{section.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="bg-white rounded-lg shadow-md mb-8">
                {activeSection === 'basic' && (
                    <ResumeBasicInfo
                        resumeData={resumeData}
                        preferredLocation={preferredLocation}
                        jobCategories={jobCategories}
                        jobTypes={jobTypes}
                        workingPeriods={workingPeriods}
                        workSchedules={workSchedules}
                        shiftHours={shiftHours}
                        onChange={handleChange}
                        onAddressClick={() => setShowAddressModal(true)}
                        formErrors={formErrors}
                    />
                )}
                {activeSection === 'education' && (
                    <ResumeEducation
                        educationHistory={resumeData.educationHistory}
                        onEditClick={() => setShowEducationModal(true)}
                    />
                )}
                {activeSection === 'career' && (
                    <ResumeCareer
                        careerHistory={resumeData.careerHistory}
                        onAdd={handleAddCareer}
                        onEdit={handleEditCareer}
                        onDelete={confirmDeleteCareer}
                    />
                )}
                {activeSection === 'skills' && (
                    <ResumeSkills
                        skills={resumeData.resumeJobSkill}
                        onChange={handleChange}
                    />
                )}
                {activeSection === 'introduction' && (
                    <ResumeIntroduction
                        introduction={resumeData.resumeIntroduction}
                        onChange={handleChange}
                    />
                )}
            </div>

            {/* 하단 저장 버튼 - 고정 위치 */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleSaveResume}
                    disabled={saving}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                         disabled:opacity-50 flex items-center justify-center shadow-lg
                         transition-all duration-300 font-medium min-w-[200px]"
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            저장 중...
                        </>
                    ) : (
                        <>
                            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 13l4 4L19 7" clipRule="evenodd" />
                            </svg>
                            이력서 저장
                        </>
                    )}
                </button>
            </div>

            {/* 모달 컴포넌트들 */}
            {showAddressModal && (
                <AddressModal
                    onComplete={handleAddressComplete}
                    onClose={() => setShowAddressModal(false)}
                />
            )}

            {showEducationModal && (
                <EducationModal
                    educationData={resumeData.educationHistory}
                    majorData={resumeData.educationHistory}
                    onSave={handleEducationUpdate}
                    onCancel={() => setShowEducationModal(false)}
                />
            )}

            {showCareerModal && (
                <CareerModal
                    careerData={currentCareer}
                    onSave={handleCareerUpdate}
                    onCancel={() => {
                        setShowCareerModal(false);
                        setCurrentCareer(null);
                    }}
                />
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.closeModal}
                onConfirm={() => confirmModal.modalProps.onConfirm && confirmModal.modalProps.onConfirm()}
                title={confirmModal.modalProps.title}
                message={confirmModal.modalProps.message}
                type={confirmModal.modalProps.type}
            />

            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={alertModal.closeModal}
                title={alertModal.modalProps.title}
                message={alertModal.modalProps.message}
                type={alertModal.modalProps.type}
            />
        </div>
    );
};

export default ResumeEdit;