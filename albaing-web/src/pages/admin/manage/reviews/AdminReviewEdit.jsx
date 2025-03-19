import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, useModal } from '../../../../components';

const AdminReviewEdit = () => {
    const { reviewId } = useParams();
    const [review, setReview] = useState({
        reviewTitle: '',
        reviewContent: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const confirmModal = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        fetchReview();
    }, [reviewId]);

    const fetchReview = () => {
        setLoading(true);
        axios.get(`/api/admin/reviews/${reviewId}`)
            .then(response => {
                setReview({
                    reviewTitle: response.data.reviewTitle,
                    reviewContent: response.data.reviewContent
                });
            })
            .catch(error => {
                console.error('리뷰 정보 로딩 실패:', error);
                confirmModal.openModal({
                    title: '오류',
                    message: '리뷰 정보를 불러오는데 실패했습니다.',
                    type: 'error'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!review.reviewTitle.trim()) {
            confirmModal.openModal({
                title: '입력 오류',
                message: '제목을 입력해주세요.',
                type: 'warning'
            });
            return;
        }

        if (!review.reviewContent.trim()) {
            confirmModal.openModal({
                title: '입력 오류',
                message: '내용을 입력해주세요.',
                type: 'warning'
            });
            return;
        }

        setSubmitting(true);
        axios.put(`/api/admin/reviews/${reviewId}`, review)
            .then(() => {
                confirmModal.openModal({
                    title: '성공',
                    message: '리뷰가 수정되었습니다.',
                    type: 'success',
                    onClose: () => navigate('/admin/reviews')
                });
            })
            .catch(error => {
                console.error('리뷰 수정 실패:', error);
                confirmModal.openModal({
                    title: '오류',
                    message: '리뷰 수정에 실패했습니다.',
                    type: 'error'
                });
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    if (loading) return <LoadingSpinner message="리뷰 정보를 불러오는 중..." />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">리뷰 수정</h2>
                <button
                    onClick={() => navigate('/admin/reviews')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    목록으로
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            리뷰 제목
                        </label>
                        <input
                            type="text"
                            id="reviewTitle"
                            name="reviewTitle"
                            value={review.reviewTitle}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="reviewContent" className="block text-sm font-medium text-gray-700 mb-1">
                            리뷰 내용
                        </label>
                        <textarea
                            id="reviewContent"
                            name="reviewContent"
                            value={review.reviewContent}
                            onChange={handleChange}
                            rows={10}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/reviews')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            disabled={submitting}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={submitting}
                        >
                            {submitting ? '저장 중...' : '저장하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminReviewEdit;