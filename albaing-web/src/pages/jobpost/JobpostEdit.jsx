import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";

// 미리보기 컴포넌트
const PreviewCard = ({ data }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* 상단: 제목 및 주요 정보 (3개씩 2줄) */}
            <div className="border-b pb-4 mb-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {data.jobPostTitle || "제목 없음"}
                </h2>
                <div className="grid grid-cols-3 gap-4 text-gray-600 text-sm">
                    <div>
                        <strong>직종 카테고리:</strong> {data.jobPostJobCategory || "-"}
                    </div>
                    <div>
                        <strong>고용형태:</strong> {data.jobPostJobType || "-"}
                    </div>
                    <div>
                        <strong>근무기간:</strong> {data.jobPostWorkingPeriod || "-"}
                    </div>
                    <div>
                        <strong>근무요일:</strong> {data.jobWorkSchedule || "-"}
                    </div>
                    <div>
                        <strong>근무시간:</strong> {data.jobPostShiftHours || "-"}
                    </div>
                    <div>
                        <strong>급여:</strong> {data.jobPostSalary || "-"}
                    </div>
                </div>
            </div>

            {/* 중단: 세부 정보 */}
            <div className="mb-4 space-y-1 text-sm text-gray-600">
                <p>
                    <strong>연락처:</strong> {data.jobPostContactNumber || "-"}
                </p>
                <p>
                    <strong>학력요건:</strong> {data.jobPostRequiredEducations || "-"}
                </p>
                <p>
                    <strong>근무지:</strong> {data.jobPostWorkPlace || "-"}
                </p>
                <p>
                    <strong>마감일:</strong> {data.jobPostDueDate || "-"}
                </p>
            </div>

            {/* 하단: 이미지 영역 */}
            {data.jobPostOptionalImage && (
                <div className="mt-4">
                    <img
                        src={data.jobPostOptionalImage}
                        alt="채용공고 이미지"
                        className="w-full h-auto object-contain rounded"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://via.placeholder.com/600x400?text=No+Image";
                        }}
                    />
                </div>
            )}
        </div>
    );
};

const JobPostEdit = () => {
    const navigate = useNavigate();
    const { jobPostId } = useParams();
    const { userData } = useAuth();
    const companyId = userData?.companyId;

    const jobCategories = [
        "외식/음료",
        "유통/판매",
        "문화/여가생활",
        "서비스",
        "사무/회계",
        "고객상담/리서치",
        "생산/건설/노무",
        "IT/기술",
        "디자인",
        "미디어",
        "운전/배달",
        "병원/간호/연구",
        "교육/강사"
    ];

    const jobTypes = ['알바', '정규직', '계약직', '파견직', '인턴'];
    const workingPeriods = ['무관', '하루', '1일~1개월', '1~3개월', '3~6개월', '6개월이상'];
    const workSchedules = ['무관', '평일', '주말'];
    const shiftHours = ['무관', '오전(06:00~12:00)', '오후(12:00~18:00)', '저녁(18:00~24:00)', '새벽(00:00~06:00)'];

    const [formData, setFormData] = useState({
        companyId: companyId,
        jobPostTitle: '',
        jobPostOptionalImage: '',
        jobPostContactNumber: '',
        jobPostRequiredEducations: '',
        jobPostJobCategory: '',
        jobPostJobType: '',
        jobPostWorkingPeriod: '',
        jobWorkSchedule: '',
        jobPostShiftHours: '',
        jobPostSalary: '',
        jobPostWorkPlace: '',
        jobPostStatus: true,
        jobPostDueDate: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // 작성/미리보기 탭 상태
    const [activeTab, setActiveTab] = useState("edit");

    useEffect(() => {
        if (!userData) return; // userData가 없으면 실행 안 함

        const validJobPostId = Number(jobPostId);
        const validCompanyId = userData?.companyId ? Number(userData.companyId) : null;

        if (!validJobPostId) {
            setError("올바른 공고 ID가 아닙니다.");
            navigate("/");
            return;
        }

        axios
            .get(`http://localhost:8080/api/jobs/${validJobPostId}`)
            .then((response) => {
                // 본인 회사의 공고인지 확인
                if (Number(response.data.companyId) !== validCompanyId) {
                    setError("수정 권한이 없습니다.");
                    return;
                }
                setFormData(response.data);
                setIsAuthorized(true);
            })
            .catch((error) => {
                setError("채용공고를 불러오는 중 오류가 발생했습니다.");
                console.error("Error fetching job post:", error);
            });
    }, [jobPostId, userData, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.jobPostJobCategory) {
            setError('직종 카테고리를 선택해주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        axios
            .put(`http://localhost:8080/api/jobs/${jobPostId}`, formData)
            .then(() => {
                setLoading(false);
                navigate(`/jobs/${jobPostId}`);
            })
            .catch((error) => {
                setLoading(false);
                setError('채용공고 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
                console.error('Error updating job post:', error);
            });
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-red-100 border border-red-400 text-red-700 rounded mt-8">
                {error}
            </div>
        );
    }

    if (!isAuthorized) {
        return <div className="text-center py-10">loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-50 shadow-lg rounded-lg mt-10">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">채용공고 수정</h1>
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    취소
                </button>
            </div>

            {/* 에러 메시지 표시 */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* 작성 / 미리보기 탭 버튼 */}
            <div className="mb-6">
                <button
                    onClick={() => setActiveTab("edit")}
                    className={`px-4 py-2 mr-2 ${
                        activeTab === "edit"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 border"
                    } rounded`}
                >
                    수정
                </button>
                <button
                    onClick={() => setActiveTab("preview")}
                    className={`px-4 py-2 ${
                        activeTab === "preview"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 border"
                    } rounded`}
                >
                    미리보기
                </button>
            </div>

            {/* 탭에 따라 다른 내용 렌더링 */}
            {activeTab === "edit" ? (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    {/* 채용공고 제목 */}
                    <div>
                        <label
                            htmlFor="jobPostTitle"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            채용공고 제목 *
                        </label>
                        <input
                            type="text"
                            id="jobPostTitle"
                            name="jobPostTitle"
                            value={formData.jobPostTitle}
                            onChange={handleChange}
                            required
                            placeholder="채용 제목을 입력하세요"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 이미지 URL */}
                    <div>
                        <label
                            htmlFor="jobPostOptionalImage"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            이미지 URL
                        </label>
                        <input
                            type="text"
                            id="jobPostOptionalImage"
                            name="jobPostOptionalImage"
                            value={formData.jobPostOptionalImage}
                            onChange={handleChange}
                            placeholder="이미지 URL을 입력하세요"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 연락처 */}
                    <div>
                        <label
                            htmlFor="jobPostContactNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            연락처
                        </label>
                        <input
                            type="text"
                            id="jobPostContactNumber"
                            name="jobPostContactNumber"
                            value={formData.jobPostContactNumber}
                            onChange={handleChange}
                            placeholder="연락처를 입력하세요"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 요구 교육사항 */}
                    <div>
                        <label
                            htmlFor="jobPostRequiredEducations"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            요구 교육사항
                        </label>
                        <input
                            type="text"
                            id="jobPostRequiredEducations"
                            name="jobPostRequiredEducations"
                            value={formData.jobPostRequiredEducations}
                            onChange={handleChange}
                            placeholder="예: 대졸 이상, 관련 전공 우대 등"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 직종 카테고리 */}
                    <div>
                        <label
                            htmlFor="jobPostJobCategory"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            직종 카테고리 *
                        </label>
                        <select
                            id="jobPostJobCategory"
                            name="jobPostJobCategory"
                            value={formData.jobPostJobCategory}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">카테고리를 선택하세요</option>
                            {jobCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 근무 형태 */}
                    <div>
                        <label
                            htmlFor="jobPostJobType"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            근무 형태 *
                        </label>
                        <select
                            id="jobPostJobType"
                            name="jobPostJobType"
                            value={formData.jobPostJobType}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">근무 형태 선택</option>
                            {jobTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 근무 기간 */}
                    <div>
                        <label
                            htmlFor="jobPostWorkingPeriod"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            근무 기간
                        </label>
                        <select
                            id="jobPostWorkingPeriod"
                            name="jobPostWorkingPeriod"
                            value={formData.jobPostWorkingPeriod}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">근무 기간 선택</option>
                            {workingPeriods.map((period) => (
                                <option key={period} value={period}>
                                    {period}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 근무 스케줄 */}
                    <div>
                        <label
                            htmlFor="jobWorkSchedule"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            근무 스케줄
                        </label>
                        <select
                            id="jobWorkSchedule"
                            name="jobWorkSchedule"
                            value={formData.jobWorkSchedule}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">근무 스케줄 선택</option>
                            {workSchedules.map((schedule) => (
                                <option key={schedule} value={schedule}>
                                    {schedule}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 근무 시간 */}
                    <div>
                        <label
                            htmlFor="jobPostShiftHours"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            근무 시간
                        </label>
                        <select
                            id="jobPostShiftHours"
                            name="jobPostShiftHours"
                            value={formData.jobPostShiftHours}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">근무 시간 선택</option>
                            {shiftHours.map((shift) => (
                                <option key={shift} value={shift}>
                                    {shift}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 급여 */}
                    <div>
                        <label
                            htmlFor="jobPostSalary"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            급여
                        </label>
                        <input
                            type="number"
                            id="jobPostSalary"
                            name="jobPostSalary"
                            value={formData.jobPostSalary}
                            onChange={handleChange}
                            placeholder="급여를 입력하세요"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 근무지 */}
                    <div>
                        <label
                            htmlFor="jobPostWorkPlace"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            근무지
                        </label>
                        <input
                            type="text"
                            id="jobPostWorkPlace"
                            name="jobPostWorkPlace"
                            value={formData.jobPostWorkPlace}
                            onChange={handleChange}
                            placeholder="근무지를 입력하세요"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 마감일 */}
                    <div>
                        <label
                            htmlFor="jobPostDueDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            마감일
                        </label>
                        <input
                            type="date"
                            id="jobPostDueDate"
                            name="jobPostDueDate"
                            value={formData.jobPostDueDate}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 버튼 영역 */}
                    <div className="px-6 py-4 bg-gray-50 text-right flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                        >
                            {loading ? '처리 중...' : '수정하기'}
                        </button>
                    </div>
                </form>
            ) : (
                // 미리보기 탭
                <PreviewCard data={formData} />
            )}
        </div>
    );
};

export default JobPostEdit;
