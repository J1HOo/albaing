import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner, ErrorMessage, useModal } from '../../../../components';
import AdminLayout from '../../AdminLayout';
import Pagination from '../../../../components/common/Pagination';
import { format } from 'date-fns';

const NoticeFormModal = ({ isOpen, onClose, notice, onSubmit }) => {
    const [formData, setFormData] = useState({
        noticeTitle: '',
        noticeContent: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (notice) {
            setFormData({
                noticeTitle: notice.noticeTitle || '',
                noticeContent: notice.noticeContent || ''
            });
        } else {
            setFormData({
                noticeTitle: '',
                noticeContent: ''
            });
        }
    }, [notice]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.noticeTitle.trim()) {
            newErrors.noticeTitle = '제목을 입력해주세요';
        }
        if (!formData.noticeContent.trim()) {
            newErrors.noticeContent = '내용을 입력해주세요';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {notice ? '공지사항 수정' : '공지사항 추가'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label htmlFor="noticeTitle" className="block text-sm font-medium text-gray-700 mb-2">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="noticeTitle"
                            name="noticeTitle"
                            value={formData.noticeTitle}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${errors.noticeTitle ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="공지사항 제목"
                        />
                        {errors.noticeTitle && (
                            <p className="mt-1 text-sm text-red-500">{errors.noticeTitle}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="noticeContent" className="block text-sm font-medium text-gray-700 mb-2">
                            내용 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="noticeContent"
                            name="noticeContent"
                            value={formData.noticeContent}
                            onChange={handleChange}
                            rows={10}
                            className={`w-full p-3 border rounded-lg ${errors.noticeContent ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="공지사항 내용"
                        ></textarea>
                        {errors.noticeContent && (
                            <p className="mt-1 text-sm text-red-500">{errors.noticeContent}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {notice ? '수정' : '추가'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 공지사항 상세 모달
const NoticeDetailModal = ({ isOpen, onClose, notice }) => {
    if (!isOpen || !notice) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">공지사항 상세</h3>
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
                        <h2 className="text-2xl font-bold text-gray-800">{notice.noticeTitle}</h2>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span>작성일: {format(new Date(notice.noticeCreatedAt), 'yyyy-MM-dd HH:mm')}</span>
                            {notice.noticeUpdatedAt && (
                                <span className="ml-4">수정일: {format(new Date(notice.noticeUpdatedAt), 'yyyy-MM-dd HH:mm')}</span>
                            )}
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <div className="bg-gray-50 p-4 rounded-lg min-h-[200px] whitespace-pre-wrap">{notice.noticeContent}</div>
                    </div>

                    <div className="flex justify-end mt-6">
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

// 삭제 확인 모달
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, name }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="p-6">
                    <div className="flex items-center justify-center text-red-500 mb-4">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">공지사항 삭제</h3>
                    <p className="text-gray-600 text-center mb-6">
                        '{name}' 공지사항을 삭제하시겠습니까?<br />
                        삭제된 데이터는 복구할 수 없습니다.
                    </p>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminNotices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // 모달 상태 관리
    const formModal = useModal();
    const detailModal = useModal();
    const deleteModal = useModal();

    // 공지사항 목록 가져오기
    const fetchNotices = (page = 1) => {
        setLoading(true);
        setError(null);

        axios.get('/api/admin/notices')
            .then(response => {
                setNotices(response.data);
                setTotalItems(response.data.length);
                setLoading(false);
            })
            .catch(error => {
                console.error('공지사항 목록 로딩 실패:', error);
                setError('공지사항 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    // 공지사항 추가
    const handleAddNotice = (formData) => {
        setLoading(true);

        axios.post('/api/admin/notices', formData)
            .then(() => {
                fetchNotices();
                formModal.closeModal();
            })
            .catch(error => {
                console.error('공지사항 추가 실패:', error);
                setError('공지사항 추가에 실패했습니다.');
                setLoading(false);
            });
    };

    // 공지사항 수정
    const handleEditNotice = (formData) => {
        if (!selectedNotice) return;

        setLoading(true);

        axios.put(`/api/admin/notices/${selectedNotice.noticeId}`, formData)
            .then(() => {
                fetchNotices();
                formModal.closeModal();
                setSelectedNotice(null);
            })
            .catch(error => {
                console.error('공지사항 수정 실패:', error);
                setError('공지사항 수정에 실패했습니다.');
                setLoading(false);
            });
    };

    // 공지사항 삭제
    const handleDeleteNotice = () => {
        if (!selectedNotice) return;

        setLoading(true);

        axios.delete(`/api/admin/notices/${selectedNotice.noticeId}`)
            .then(() => {
                fetchNotices();
                deleteModal.closeModal();
                setSelectedNotice(null);
            })
            .catch(error => {
                console.error('공지사항 삭제 실패:', error);
                setError('공지사항 삭제에 실패했습니다.');
                setLoading(false);
            });
    };

    // 공지사항 상세 보기
    const handleViewNotice = (notice) => {
        setSelectedNotice(notice);
        detailModal.openModal();
    };

    // 공지사항 수정 모달 열기
    const handleOpenEditModal = (notice) => {
        setSelectedNotice(notice);
        formModal.openModal();
    };

    // 공지사항 삭제 모달 열기
    const handleOpenDeleteModal = (notice) => {
        setSelectedNotice(notice);
        deleteModal.openModal();
    };

    // 검색 처리
    const handleSearch = (e) => {
        e.preventDefault();
        fetchNotices();
    };

    // 현재 페이지의 공지사항 목록
    const getCurrentNotices = () => {
        const filtered = searchTerm
            ? notices.filter(notice =>
                notice.noticeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notice.noticeContent.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : notices;

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filtered.slice(indexOfFirstItem, indexOfLastItem);
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">공지사항 관리</h1>
                    <p className="text-gray-600 mt-1">사이트 공지사항을 관리할 수 있습니다.</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedNotice(null);
                        formModal.openModal();
                    }}
                    className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    공지사항 추가
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="공지사항 제목 또는 내용으로 검색"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        검색
                    </button>
                </form>
            </div>

            {error && <ErrorMessage message={error} className="mb-6" />}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <LoadingSpinner message="데이터를 불러오는 중..." fullScreen={false} className="py-12" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        번호
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        제목
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        작성일
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        관리
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentNotices().length > 0 ? (
                                    getCurrentNotices().map((notice) => (
                                        <tr key={notice.noticeId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {notice.noticeId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleViewNotice(notice)}
                                                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                                >
                                                    {notice.noticeTitle}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(notice.noticeCreatedAt), 'yyyy-MM-dd')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewNotice(notice)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        상세
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenEditModal(notice)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(notice)}
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
                                            공지사항이 없습니다.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* 공지사항 추가/수정 모달 */}
            <NoticeFormModal
                isOpen={formModal.isOpen}
                onClose={formModal.closeModal}
                notice={selectedNotice}
                onSubmit={selectedNotice ? handleEditNotice : handleAddNotice}
            />

            {/* 공지사항 상세 모달 */}
            <NoticeDetailModal
                isOpen={detailModal.isOpen}
                onClose={detailModal.closeModal}
                notice={selectedNotice}
            />

            {/* 삭제 확인 모달 */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDeleteNotice}
                name={selectedNotice?.noticeTitle}
            />
        </AdminLayout>
    );
};

export default AdminNotices;