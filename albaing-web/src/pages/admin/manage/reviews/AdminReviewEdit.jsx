import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, Link, useSearchParams} from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, ErrorMessage } from '../../../../components';
import AdminLayout from '../../AdminLayout';

const AdminReviewEdit = () => {
    const { reviewId } = useParams();
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get('companyId');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        reviewTitle: '',
        reviewContent: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (reviewId && companyId) {
            fetchReviewDetail();
        }
    }, [reviewId, companyId]);

    const fetchReviewDetail = () => {
        setLoading(true);

        axios.get(`/api/companies/${companyId}/reviews/${reviewId}`)
            .then(response => {
                const data = response.data;
                setFormData({
                    reviewTitle: data.reviewTitle || data.review_title || '',
                    reviewContent: data.reviewContent || data.review_content || ''
                });
                setLoading(false);
            })
            .catch(error => {
                setError(`리뷰 조회 실패: ${error.message}`);
                setLoading(false);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.reviewTitle.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!formData.reviewContent.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        setSubmitting(true);
        setError(null);

        axios.put(`/api/admin/reviews/${reviewId}`, {
            reviewId: parseInt(reviewId),
            reviewTitle: formData.reviewTitle,
            reviewContent: formData.reviewContent
        })
            .then(() => {
                navigate(`/admin/reviews/${reviewId}?companyId=${companyId}`);
            })
            .catch(error => {
                console.error('리뷰 수정 실패:', error);
                setError('리뷰 수정에 실패했습니다: ' + (error.response?.data?.message || error.message));
                setSubmitting(false);
            });
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">리뷰 수정</h1>
            </div>

            {loading ? (
                <LoadingSpinner message="리뷰 정보를 불러오는 중..." />
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {error && <ErrorMessage message={error} className="m-6" />}

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="mb-4">
                            <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                제목 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="reviewTitle"
                                name="reviewTitle"
                                value={formData.reviewTitle}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="리뷰 제목"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="reviewContent" className="block text-sm font-medium text-gray-700 mb-1">
                                내용 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="reviewContent"
                                name="reviewContent"
                                value={formData.reviewContent}
                                onChange={handleChange}
                                rows="10"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="리뷰 내용"
                                required
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Link
                                to={`/admin/reviews/${reviewId}`}
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

export default AdminReviewEdit;