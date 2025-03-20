import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, useModal } from '../../../../components';
import {useErrorHandler} from "../../../../components/ErrorHandler";

const AdminNoticeManage = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
    const { handleError, handleSuccess } = useErrorHandler();

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = () => {
        setLoading(true);

        axios.get('/api/admin/notices')
            .then(response => {
                setNotices(response.data);
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '공지사항 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleDelete = (noticeId) => {
        if (!window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
            return;
        }

        setLoading(true);

        axios.delete(`/api/admin/notices/${noticeId}`)
            .then(() => {
                setNotices(notices.filter(notice => notice.noticeId !== noticeId));
                handleSuccess('공지사항이 성공적으로 삭제되었습니다.');
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '공지사항 삭제에 실패했습니다.');
                setLoading(false);
            });
    };

    const filteredNotices = notices.filter(notice =>
        notice.noticeTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    if (loading) return <LoadingSpinner message="공지사항 목록을 불러오는 중..." />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">공지사항 관리</h2>
                <button
                    onClick={() => navigate('/admin/notices/new')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    공지사항 등록
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="공지사항 제목 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNotices.length > 0 ? (
                        filteredNotices.map((notice) => (
                            <tr key={notice.noticeId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {notice.noticeId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {notice.noticeTitle}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(notice.noticeCreatedAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/admin/notices/${notice.noticeId}/edit`)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDelete(notice.noticeId)}
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
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                {searchTerm ? '검색 결과가 없습니다.' : '등록된 공지사항이 없습니다.'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminNoticeManage;