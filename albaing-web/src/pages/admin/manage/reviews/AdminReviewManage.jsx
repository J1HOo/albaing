import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, useModal } from '../../../../components';
import {useErrorHandler} from "../../../../components/ErrorHandler";

const AdminReviewManage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [fetchRetries, setFetchRetries] = useState(0);
    const { handleError, handleSuccess } = useErrorHandler();
    const navigate = useNavigate();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = () => {
        setLoading(true);

        // 타임아웃 설정
        const timeoutId = setTimeout(() => {
            if (loading && fetchRetries < 3) {
                console.log(`Retry fetching reviews: attempt ${fetchRetries + 1}`);
                setFetchRetries(prev => prev + 1);
                fetchReviews();
            }
        }, 10000); // 10초 후 재시도

        axios.get('/api/admin/reviews')
            .then(response => {
                clearTimeout(timeoutId);
                setReviews(response.data);
                setLoading(false);
                setFetchRetries(0); // 성공하면 재시도 카운터 초기화
            })
            .catch(error => {
                clearTimeout(timeoutId);
                handleError(error, '리뷰 목록을 불러오는데 실패했습니다.');
                setLoading(false);

                // 오류 발생 시 헤더에 토큰 존재 여부 확인
                if (fetchRetries < 3) {
                    console.log(`Will retry fetching reviews in 3 seconds...`);
                    setTimeout(() => {
                        setFetchRetries(prev => prev + 1);
                        fetchReviews();
                    }, 3000);
                }
            });
    };

    const handleDelete = (reviewId) => {
        if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
            return;
        }

        setLoading(true);

        // 관련 댓글 먼저 삭제
        axios.delete(`/api/admin/reviews/${reviewId}/comments`)
            .then(() => {
                // 리뷰 삭제
                return axios.delete(`/api/admin/reviews/${reviewId}`);
            })
            .then(() => {
                setReviews(reviews.filter(review => review.reviewId !== reviewId));
                handleSuccess('리뷰가 성공적으로 삭제되었습니다.');
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '리뷰 삭제에 실패했습니다.');
                setLoading(false);
            });
    };

    const handleViewReview = (companyId, reviewId) => {
        navigate(`/companies/${companyId}/reviews/${reviewId}`);
    };

    const filteredReviews = reviews.filter(review =>
        review.reviewTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
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
                            <tr key={review.reviewId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {review.reviewId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {review.reviewTitle}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {review.companyName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {review.userName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(review.reviewCreatedAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/companies/${review.companyId}/reviews/${review.reviewId}`)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            보기
                                        </button>
                                        <button
                                            onClick={() => navigate(`/admin/reviews/${review.reviewId}/edit`)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review.reviewId)}
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
        </div>
    );
};

export default AdminReviewManage;