import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, useModal } from '../../../../components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminNoticeEdit = () => {
    const { noticeId } = useParams();
    const isEditMode = !!noticeId;
    const navigate = useNavigate();
    const alertModal = useModal();

    const [formData, setFormData] = useState({
        noticeTitle: '',
        noticeContent: '',
    });

    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchNotice();
        }
    }, [noticeId]);

    const fetchNotice = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/notices/${noticeId}`);
            setFormData({
                noticeTitle: response.data.noticeTitle,
                noticeContent: response.data.noticeContent,
            });
        } catch (error) {
            console.error('공지사항 로딩 실패:', error);
            alertModal.openModal({
                title: '오류',
                message: '공지사항을 불러오는데 실패했습니다.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({
            ...prev,
            noticeContent: content
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.noticeTitle.trim()) {
            alertModal.openModal({
                title: '입력 오류',
                message: '제목을 입력해주세요.',
                type: 'warning'
            });
            return;
        }

        if (!formData.noticeContent.trim()) {
            alertModal.openModal({
                title: '입력 오류',
                message: '내용을 입력해주세요.',
                type: 'warning'
            });
            return;
        }

        try {
            setSubmitting(true);

            if (isEditMode) {
                await axios.put(`/api/admin/notices/${noticeId}`, formData);
                alertModal.openModal({
                    title: '성공',
                    message: '공지사항이 수정되었습니다.',
                    type: 'success',
                    onClose: () => navigate('/admin/notices')
                });
            } else {
                await axios.post('/api/admin/notices', formData);
                alertModal.openModal({
                    title: '성공',
                    message: '공지사항이 등록되었습니다.',
                    type: 'success',
                    onClose: () => navigate('/admin/notices')
                });
            }
        } catch (error) {
            console.error('공지사항 저장 실패:', error);
            alertModal.openModal({
                title: '오류',
                message: `공지사항 ${isEditMode ? '수정' : '등록'}에 실패했습니다.`,
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner message="공지사항 정보를 불러오는 중..." />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                {isEditMode ? '공지사항 수정' : '공지사항 등록'}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="noticeTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        제목
                    </label>
                    <input
                        type="text"
                        id="noticeTitle"
                        name="noticeTitle"
                        value={formData.noticeTitle}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="공지사항 제목을 입력하세요"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="noticeContent" className="block text-sm font-medium text-gray-700 mb-1">
                        내용
                    </label>
                    <ReactQuill
                        value={formData.noticeContent}
                        onChange={handleContentChange}
                        className="bg-white"
                        placeholder="공지사항 내용을 입력하세요"
                        style={{ height: '300px', marginBottom: '50px' }}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/notices')}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                        disabled={submitting}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={submitting}
                    >
                        {submitting ? '저장 중...' : (isEditMode ? '수정하기' : '등록하기')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminNoticeEdit;