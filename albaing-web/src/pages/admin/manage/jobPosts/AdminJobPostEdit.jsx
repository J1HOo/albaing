import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, ErrorMessage } from '../../../../components';
import AdminLayout from '../../AdminLayout';

const AdminJobPostEdit = () => {
    const { jobPostId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        jobPostTitle: '',
        jobPostWorkPlace: '',
        jobPostRequiredEducations: '',
        jobPostSalary: '',
        jobPostJobCategory: '',
        jobPostJobType: '',
        jobPostWorkingPeriod: '',
        jobWorkSchedule: '',
        jobPostShiftHours: '',
        jobPostDueDate: '',
        jobPostStatus: true,
        jobPostDescription: ''
    });

    // 카테고리 옵션
    const jobCategories = ["외식/음료", "유통/판매", "문화/여가생활", "서비스", "사무/회계", "고객상담/리서치", "생산/건설/노무", "IT/기술", "디자인", "미디어", "운전/배달", "병원/간호/연구", "교육/강사"];
    const jobTypes = ["알바", "정규직", "계약직", "파견직", "인턴"];
    const jobDurations = ["하루", "1일~1개월", "1~3개월", "3~6개월", "6개월이상"];
    const workSchedules = ["평일", "주말", "평일+주말"];

    useEffect(() => {
        fetchJobPostDetail();
    }, [jobPostId]);

    const fetchJobPostDetail = () => {
        setLoading(true);
        axios.get(`/api/admin/job-posts/${jobPostId}`)
            .then(response => {
                const jobPost = response.data;

                // 날짜 형식 변환
                let formattedDueDate = '';
                if (jobPost.jobPostDueDate) {
                    try {
                        const date = new Date(jobPost.jobPostDueDate);
                        formattedDueDate = date.toISOString().split('T')[0];
                    } catch (error) {
                        formattedDueDate = '';
                    }
                }

                setFormData({
                    ...jobPost,
                    jobPostDueDate: formattedDueDate
                });

                setLoading(false);
            })
            .catch(error => {
                console.error('공고 상세 정보 로딩 실패:', error);
                setError('공고 정보를 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        // 수정된 데이터 준비
        const updatedData = {
            ...formData,
            jobPostId: parseInt(jobPostId),
            jobPostUpdatedAt: new Date()
        };

        axios.put(`/api/admin/job-posts/${jobPostId}`, updatedData)
            .then(response => {
                navigate(`/admin/jobposts/${jobPostId}`);
            })
            .catch(error => {
                console.error('공고 수정 실패:', error);
                setError('공고를 수정하는데 실패했습니다.');
                setSubmitting(false);
            });
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">공고 수정</h1>
                <p className="text-gray-600 mt-1">채용공고 정보를 수정합니다.</p>
            </div>

            {loading ? (
                <LoadingSpinner message="공고 정보를 불러오는 중..." />
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {error && <ErrorMessage message={error} className="m-6" />}

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="jobPostTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                    공고 제목 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="jobPostTitle"
                                    name="jobPostTitle"
                                    value={formData.jobPostTitle}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="jobPostJobCategory" className="block text-sm font-medium text-gray-700 mb-1">
                                    직무 분류 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="jobPostJobCategory"
                                    name="jobPostJobCategory"
                                    value={formData.jobPostJobCategory}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">선택</option>
                                    {jobCategories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="jobPostJobType" className="block text-sm font-medium text-gray-700 mb-1">
                                    고용 형태 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="jobPostJobType"
                                    name="jobPostJobType"
                                    value={formData.jobPostJobType}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">선택</option>
                                    {jobTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="jobPostWorkPlace" className="block text-sm font-medium text-gray-700 mb-1">
                                    근무지 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="jobPostWorkPlace"
                                    name="jobPostWorkPlace"
                                    value={formData.jobPostWorkPlace}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="jobPostSalary" className="block text-sm font-medium text-gray-700 mb-1">
                                    급여 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="jobPostSalary"
                                    name="jobPostSalary"
                                    value={formData.jobPostSalary}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="예) 시급 9,620원"
                                />
                            </div>

                            <div>
                                <label htmlFor="jobPostWorkingPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                                    근무 기간
                                </label>
                                <select
                                    id="jobPostWorkingPeriod"
                                    name="jobPostWorkingPeriod"
                                    value={formData.jobPostWorkingPeriod}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">선택</option>
                                    {jobDurations.map(duration => (
                                        <option key={duration} value={duration}>{duration}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="jobWorkSchedule" className="block text-sm font-medium text-gray-700 mb-1">
                                    근무 요일
                                </label>
                                <select
                                    id="jobWorkSchedule"
                                    name="jobWorkSchedule"
                                    value={formData.jobWorkSchedule}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">선택</option>
                                    {workSchedules.map(schedule => (
                                        <option key={schedule} value={schedule}>{schedule}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="jobPostShiftHours" className="block text-sm font-medium text-gray-700 mb-1">
                                    근무 시간
                                </label>
                                <input
                                    type="text"
                                    id="jobPostShiftHours"
                                    name="jobPostShiftHours"
                                    value={formData.jobPostShiftHours}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="예) 09:00~18:00"
                                />
                            </div>

                            <div>
                                <label htmlFor="jobPostRequiredEducations" className="block text-sm font-medium text-gray-700 mb-1">
                                    요구 학력
                                </label>
                                <input
                                    type="text"
                                    id="jobPostRequiredEducations"
                                    name="jobPostRequiredEducations"
                                    value={formData.jobPostRequiredEducations}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="예) 고졸 이상"
                                />
                            </div>

                            <div>
                                <label htmlFor="jobPostDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    마감일 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="jobPostDueDate"
                                    name="jobPostDueDate"
                                    value={formData.jobPostDueDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="jobPostStatus"
                                        checked={formData.jobPostStatus}
                                        onChange={handleChange}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">공개 상태로 설정</span>
                                </label>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="jobPostDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                    상세 설명
                                </label>
                                <textarea
                                    id="jobPostDescription"
                                    name="jobPostDescription"
                                    value={formData.jobPostDescription || ''}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Link
                                to={`/admin/jobposts/${jobPostId}`}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                취소
                            </Link>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                disabled={submitting}
                            >
                                {submitting ? '저장 중...' : '저장'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminJobPostEdit;