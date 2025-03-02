import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const JobPostEdit = () => {
    const navigate = useNavigate();
    const { jobPostId } = useParams();

    // Get company ID from local storage (set during login)
    const companyId = localStorage.getItem('companyId');

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

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Categories and job types for dropdown options
    const jobCategories = ['사무직', '서비스직', '판매직', '기술직', 'IT', '교육', '의료', '기타'];
    const jobTypes = ['정규직', '계약직', '파트타임', '인턴', '일용직'];

    useEffect(() => {
        // Fetch the job post data to edit
        const fetchJobPost = async () => {
            try {
                const response = await axios.get(`/api/jobs/${jobPostId}`);

                // Format the date to YYYY-MM-DD for the date input
                const dueDate = new Date(response.data.jobPostDueDate).toISOString().split('T')[0];

                setFormData({
                    ...response.data,
                    jobPostDueDate: dueDate
                });

                // Check if this job post belongs to the logged-in company
                if (response.data.companyId.toString() !== companyId) {
                    setError('접근 권한이 없습니다.');
                    setTimeout(() => {
                        navigate('/company/jobs');
                    }, 2000);
                }

                setLoading(false);
            } catch (err) {
                setError('채용공고를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
                console.error('Error fetching job post:', err);
            }
        };

        fetchJobPost();
    }, [jobPostId, companyId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // API call to update the job post
            await axios.put(`/api/jobs/${jobPostId}`, formData);

            setSubmitting(false);
            // Redirect to the job post detail page after successful update
            navigate(`/company/jobs/${jobPostId}`);
        } catch (err) {
            setSubmitting(false);
            setError('채용공고 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
            console.error('Error updating job post:', err);
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to previous page
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">채용공고 수정</h1>
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    취소
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6 space-y-6">
                    {/* 채용공고 제목 */}
                    <div>
                        <label htmlFor="jobPostTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            채용공고 제목 *
                        </label>
                        <input
                            type="text"
                            id="jobPostTitle"
                            name="jobPostTitle"
                            value={formData.jobPostTitle}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="채용 제목을 입력하세요"
                        />
                    </div>

                    {/* 채용공고 이미지 URL */}
                    <div>
                        <label htmlFor="jobPostOptionalImage" className="block text-sm font-medium text-gray-700 mb-1">
                            이미지 URL (선택사항)
                        </label>
                        <input
                            type="text"
                            id="jobPostOptionalImage"
                            name="jobPostOptionalImage"
                            value={formData.jobPostOptionalImage || ''}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="이미지 URL을 입력하세요"
                        />
                    </div>

                    {/* 연락처 */}
                    <div>
                        <label htmlFor="jobPostContactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            연락처 *
                        </label>
                        <input
                            type="text"
                            id="jobPostContactNumber"
                            name="jobPostContactNumber"
                            value={formData.jobPostContactNumber}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="연락 가능한 전화번호를 입력하세요"
                        />
                    </div>

                    {/* 학력요건 */}
                    <div>
                        <label htmlFor="jobPostRequiredEducations" className="block text-sm font-medium text-gray-700 mb-1">
                            필요 학력
                        </label>
                        <input
                            type="text"
                            id="jobPostRequiredEducations"
                            name="jobPostRequiredEducations"
                            value={formData.jobPostRequiredEducations || ''}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="필요한 학력 요건을 입력하세요 (예: 고졸 이상, 무관 등)"
                        />
                    </div>

                    {/* 직종 카테고리 */}
                    <div>
                        <label htmlFor="jobPostJobCategory" className="block text-sm font-medium text-gray-700 mb-1">
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
                            <option value="">카테고리 선택</option>
                            {jobCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* 고용형태 */}
                    <div>
                        <label htmlFor="jobPostJobType" className="block text-sm font-medium text-gray-700 mb-1">
                            고용형태 *
                        </label>
                        <select
                            id="jobPostJobType"
                            name="jobPostJobType"
                            value={formData.jobPostJobType}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">고용형태 선택</option>
                            {jobTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* 근무기간 */}
                    <div>
                        <label htmlFor="jobPostWorkingPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                            근무기간 *
                        </label>
                        <input
                            type="text"
                            id="jobPostWorkingPeriod"
                            name="jobPostWorkingPeriod"
                            value={formData.jobPostWorkingPeriod}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="근무기간을 입력하세요 (예: 3개월, 6개월, 1년 등)"
                        />
                    </div>

                    {/* 근무요일 */}
                    <div>
                        <label htmlFor="jobWorkSchedule" className="block text-sm font-medium text-gray-700 mb-1">
                            근무요일 *
                        </label>
                        <input
                            type="text"
                            id="jobWorkSchedule"
                            name="jobWorkSchedule"
                            value={formData.jobWorkSchedule}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="근무요일을 입력하세요 (예: 월-금, 주말, 협의 가능 등)"
                        />
                    </div>

                    {/* 근무시간 */}
                    <div>
                        <label htmlFor="jobPostShiftHours" className="block text-sm font-medium text-gray-700 mb-1">
                            근무시간 *
                        </label>
                        <input
                            type="text"
                            id="jobPostShiftHours"
                            name="jobPostShiftHours"
                            value={formData.jobPostShiftHours}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="근무시간을 입력하세요 (예: 9:00-18:00, 유연근무 등)"
                        />
                    </div>

                    {/* 급여 */}
                    <div>
                        <label htmlFor="jobPostSalary" className="block text-sm font-medium text-gray-700 mb-1">
                            급여 *
                        </label>
                        <input
                            type="text"
                            id="jobPostSalary"
                            name="jobPostSalary"
                            value={formData.jobPostSalary}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="급여를 입력하세요 (예: 시급 10,000원, 월 250만원 등)"
                        />
                    </div>

                    {/* 근무지 */}
                    <div>
                        <label htmlFor="jobPostWorkPlace" className="block text-sm font-medium text-gray-700 mb-1">
                            근무지 *
                        </label>
                        <input
                            type="text"
                            id="jobPostWorkPlace"
                            name="jobPostWorkPlace"
                            value={formData.jobPostWorkPlace}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="근무지 주소를 입력하세요"
                        />
                    </div>

                    {/* 채용 마감일 */}
                    <div>
                        <label htmlFor="jobPostDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                            채용 마감일 *
                        </label>
                        <input
                            type="date"
                            id="jobPostDueDate"
                            name="jobPostDueDate"
                            value={formData.jobPostDueDate}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 공고 상태 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            공고 상태
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="jobPostStatus"
                                    value="true"
                                    checked={formData.jobPostStatus === true}
                                    onChange={() => setFormData({ ...formData, jobPostStatus: true })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-gray-700">활성화</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="jobPostStatus"
                                    value="false"
                                    checked={formData.jobPostStatus === false}
                                    onChange={() => setFormData({ ...formData, jobPostStatus: false })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-gray-700">비활성화</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 text-right">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 mr-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {submitting ? '처리 중...' : '저장하기'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobPostEdit;