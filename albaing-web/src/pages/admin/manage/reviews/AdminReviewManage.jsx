import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from '../../../../components';
import {useErrorHandler} from "../../../../components/ErrorHandler";

const AdminReviewManage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { handleError, handleSuccess } = useErrorHandler();
    const navigate = useNavigate();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = () => {
        setLoading(true);
        axios.get('/api/admin/reviews')
            .then(response => {
                setReviews(response.data);
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '리뷰 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleDelete = (reviewId) => {
        if (!window.confirm("이 리뷰를 삭제하시겠습니까?")) return;

        axios.delete(`/api/admin/reviews/${reviewId}`)
            .then(() => {
                setReviews(prev => prev.filter(review => review.reviewId !== reviewId));
                handleSuccess('리뷰가 삭제되었습니다.');
            })
            .catch(error => {
                handleError(error, '리뷰 삭제에 실패했습니다.');
            });
    };

    const filteredReviews = searchTerm ? reviews.filter(review =>
        (review.reviewTitle && review.reviewTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (review.userName && review.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (review.companyName && review.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : reviews;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    if (loading) return <LoadingSpinner message="리뷰 목록을 불러오는 중..." />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">리뷰 관리</h2>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="리뷰 제목, 작성자, 기업명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            {reviews && reviews.length > 0 ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회사명</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => (
                                <tr key={review.reviewId || review.review_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {review.reviewId || review.review_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {review.reviewTitle || review.review_title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {review.companyName || review.company_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {review.userName || review.user_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(review.reviewCreatedAt || review.review_created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => navigate(`/companies/${review.companyId || review.company_id}/reviews/${review.reviewId || review.review_id}`)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                보기
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/reviews/${review.reviewId || review.review_id}/edit`)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review.reviewId || review.review_id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    {searchTerm ? '검색 결과가 없습니다.' : '등록된 리뷰가 없습니다.'}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500">등록된 리뷰가 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default AdminReviewManage;