import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from '../../../../components';
import {useErrorHandler} from "../../../../components/ErrorHandler";

const AdminJobPostDetail = () => {
    const { jobPostId } = useParams();
    const [jobPost, setJobPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const navigate = useNavigate();
    const { handleError, handleSuccess } = useErrorHandler();

    useEffect(() => {
        fetchJobPostDetail();
    }, [jobPostId]);

    const fetchJobPostDetail = () => {
        setLoading(true);

        axios.get(`/api/admin/job-posts/${jobPostId}`)
            .then(response => {
                setJobPost(response.data);
                setEditForm({...response.data});
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '공고 정보를 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleStatusChange = (status) => {
        setLoading(true);

        axios.patch(`/api/admin/job-posts/${jobPostId}/status`, {
            status: status
        })
            .then(() => {
                setJobPost(prev => ({
                    ...prev,
                    jobPostStatus: status
                }));
                handleSuccess(`공고가 ${status ? '공개' : '비공개'}로 변경되었습니다.`);
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '공고 상태 변경에 실패했습니다.');
                setLoading(false);
            });
    };

    const handleDelete = () => {
        if (!window.confirm(`${jobPost.jobPostTitle} 공고를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
            return;
        }

        setLoading(true);

        // 관련 지원내역 먼저 삭제
        axios.delete(`/api/admin/job-posts/${jobPostId}/applications`)
            .then(() => {
                // 공고 삭제
                return axios.delete(`/api/admin/job-posts/${jobPostId}`);
            })
            .then(() => {
                handleSuccess('공고가 성공적으로 삭제되었습니다.');
                navigate('/admin/job-posts');
            })
            .catch(error => {
                handleError(error, '공고 삭제에 실패했습니다.');
                setLoading(false);
            });
    };

    const handleUpdateJobPost = () => {
        setLoading(true);

        axios.put(`/api/admin/job-posts/${jobPostId}`, editForm)
            .then(() => {
                handleSuccess('공고 정보가 성공적으로 수정되었습니다.');
                setJobPost(editForm);
                setIsEditing(false);
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '공고 정보 수정에 실패했습니다.');
                setLoading(false);
            });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    if (loading) return <LoadingSpinner message="공고 정보를 불러오는 중..." />;
    if (!jobPost) return <div>공고 정보를 찾을 수 없습니다.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">공고 상세 정보</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate('/admin/job-posts')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        목록으로
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* 공고 헤더 */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            {jobPost.companyLogo && (
                                <img
                                    src={jobPost.companyLogo}
                                    alt={`${jobPost.companyName} 로고`}
                                    className="w-16 h-16 mr-4 object-cover"
                                />
                            )}
                            <div>
                                <h3 className="text-xl font-bold">{jobPost.jobPostTitle}</h3>
                                <div className="mt-1 text-sm text-gray-600">
                                    <span className="mr-2">{jobPost.companyName}</span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${jobPost.jobPostStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {jobPost.jobPostStatus ? '공개' : '비공개'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            {jobPost.jobPostStatus ? (
                                <button
                                    onClick={() => handleStatusChange(false)}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                                >
                                    비공개로 변경
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleStatusChange(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    공개로 변경
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>

                {/* 공고 상세 정보 */}
                <div className="p-6">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">카테고리</dt>
                            <dd className="mt-1 text-sm text-gray-900">{jobPost.jobPostJobCategory}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">근무 형태</dt>
                            <dd className="mt-1 text-sm text-gray-900">{jobPost.jobPostJobType}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">근무 기간</dt>
                            <dd className="mt-1 text-sm text-gray-900">{jobPost.jobPostWorkingPeriod}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">근무 요일</dt>
                            <dd className="mt-1 text-sm text-gray-900">{jobPost.jobWorkSchedule}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">근무 시간</dt>
                            <dd className="mt-1 text-sm text-gray-900">{jobPost.jobPostShiftHours}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">급여</dt>
                            <dd className="mt-1 text-sm text-gray-900">{jobPost.jobPostSalary}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">근무지</dt>
                            <dd className="mt-1 text-sm text-gray-900">{jobPost.jobPostWorkPlace}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">마감일</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(jobPost.jobPostDueDate)}</dd>
                        </div>
                    </dl>

                    {/* 지원자 목록 링크 */}
                    <div className="mt-8">
                        <button
                            onClick={() => navigate(`/admin/applications?jobPostId=${jobPost.jobPostId}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            지원자 목록 보기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminJobPostDetail;