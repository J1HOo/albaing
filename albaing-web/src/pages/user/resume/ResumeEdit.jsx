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
            const existingCareerHistory = Array.isArray(prev.careerHistory)
                ? prev.careerHistory
                : [];

            const updatedCareerHistory = careerData.careerId && existingCareerHistory.some(c => c.careerId === careerData.careerId)
                ? existingCareerHistory.map(c =>
                    c.careerId === careerData.careerId ? { ...careerData, resumeId: prev.resumeId } : c
                )
                : [
                    ...existingCareerHistory,
                    { ...careerData, careerId: `temp-${Date.now()}`, resumeId: prev.resumeId }
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
            console.log("✅ 수정 대상 경력:", foundCareer);
            setCurrentCareer(foundCareer);
            setShowCareerModal(true);
        } else {
            console.warn("❌ 수정하려는 경력 항목을 찾을 수 없습니다.", careerId);
        }
    };


    const handleAddCareer = () => {
        setCurrentCareer(null);
        setShowCareerModal(true);
    };

    const handleDeleteCareer = (index) => {
        if (!window.confirm('이 경력 항목을 삭제하시겠습니까?')) return;
        const careerToDelete = resumeData.careerHistory[index];
        if (!careerToDelete?.careerId || !resumeId) return alert("삭제할 수 없습니다.");
        apiResumeService.deleteCareer(careerToDelete.careerId, Number(resumeId))
            .then(() => {
                setResumeData(prev => ({
                    ...prev,
                    careerHistory: prev.careerHistory.filter((_, i) => i !== index)
                }));
            })
            .catch(error => {
                console.error("경력 삭제 중 오류:", error);
                alert("삭제 중 오류가 발생했습니다.");
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
        const careerHistoryData = resumeData.careerHistory.map(career => {
            const processedCareer = { ...career };
            if (typeof processedCareer.careerId === 'string' && processedCareer.careerId.startsWith('temp-')) {
                processedCareer.careerId = null; // 서버에 insert 요청
            }
            return processedCareer;
        });



        console.log("💾 최종 저장될 careerHistory:", careerHistoryData);

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

            <div className="mb-6 flex justify-between space-x-2">
                {['basic', 'education', 'career', 'skills', 'introduction'].map(section => (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`flex-1 py-2 rounded ${activeSection === section ? 'bg-blue-500 text-white' : 'bg-white border'}`}
                    >
                        {{
                            basic: '기본 정보',
                            education: '학력 정보',
                            career: '경력 정보',
                            skills: '보유 스킬',
                            introduction: '자기소개'
                        }[section]}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded shadow-md">
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
                        onDelete={handleDeleteCareer}
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
                <div className="p-6 text-right">
                    <button
                        onClick={handleSaveResume}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? '저장 중...' : '이력서 저장'}
                    </button>
                </div>
            </div>

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

        </div>
    );
};

export default ResumeEdit;
