import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from '../../components';
import Pagination from '../../components/common/Pagination';
import { format } from 'date-fns';

const NoticeItem = ({ notice, onView }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'yyyy-MM-dd');
    };

    return (
        <div
            className="border-b border-gray-200 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onView(notice)}
        >
            <h3 className="text-lg font-medium text-gray-900 mb-1">{notice.noticeTitle}</h3>
            <div className="flex text-sm text-gray-500">
                <span>{formatDate(notice.noticeCreatedAt)}</span>
                {notice.noticeUpdatedAt && (
                    <span className="ml-4">(수정됨: {formatDate(notice.noticeUpdatedAt)})</span>
                )}
            </div>
        </div>
    );
};

const NoticeDetailModal = ({ isOpen, onClose, notice }) => {
    if (!isOpen || !notice) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h3 className="text-xl font-semibold text-gray-800">공지사항</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{notice.noticeTitle}</h2>
                        <div className="flex text-sm text-gray-500 mb-4">
                            <span>작성일: {formatDate(notice.noticeCreatedAt)}</span>
                            {notice.noticeUpdatedAt && (
                                <span className="ml-4">수정일: {formatDate(notice.noticeUpdatedAt)}</span>
                            )}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line min-h-[200px]">
                            {notice.noticeContent}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchNotices = () => {
            setLoading(true);

            axios.get('/api/notices')
                .then(response => {
                    setNotices(response.data);
                    setTotalItems(response.data.length);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('공지사항 목록 불러오기 실패:', error);
                    setLoading(false);
                });
        }

        fetchNotices();
    }, []);

    const getCurrentNotices = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return notices.slice(indexOfFirstItem, indexOfLastItem);
    };

    const handleViewNotice = (notice) => {
        setSelectedNotice(notice);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-[1200px] mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">공지사항</h1>
                <p className="mt-2 text-gray-600">알바잉 서비스의 최신 공지사항을 확인하세요.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="min-h-[300px] flex items-center justify-center">
                        <LoadingSpinner message="공지사항을 불러오는 중..." fullScreen={false} />
                    </div>
                ) : notices.length > 0 ? (
                    <div className="divide-y divide-gray-200 px-6">
                        {getCurrentNotices().map((notice) => (
                            <NoticeItem
                                key={notice.noticeId}
                                notice={notice}
                                onView={handleViewNotice}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        <p>등록된 공지사항이 없습니다.</p>
                    </div>
                )}

                <div className="px-6 py-4">
                    <Pagination
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>

            {/* 공지사항 상세 모달 */}
            <NoticeDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                notice={selectedNotice}
            />
        </div>
    );
};

export default Notices;