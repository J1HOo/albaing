import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, ConfirmModal, useModal } from '../../../../components';
import { ErrorHandler } from "../../../../components/ErrorHandler";

const AdminUserDetail = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const navigate = useNavigate();
    const modal = useModal();
    const { handleError, handleSuccess, confirmAction } = ErrorHandler();

    useEffect(() => {
        fetchUserDetail();
    }, [userId]);

    useEffect(() => {
        if (user) {
            setEditForm({...user});
        }
    }, [user]);

    const fetchUserDetail = () => {
        setLoading(true);

        axios.get(`/api/admin/users/${userId}`)
            .then(response => {
                setUser(response.data);
                setEditForm({...response.data});
                setLoading(false);
            })
            .catch(error => {
                console.error('사용자 정보 로딩 실패:', error);
                // handleError 대신 직접 에러 표시
                modal.openModal({
                    title: '오류 발생',
                    message: '사용자 정보를 불러오는데 실패했습니다.',
                    type: 'error'
                });
                setLoading(false);
            });
    };

    const handleDelete = () => {
        // confirmAction 대신 modal 직접 사용
        modal.openModal({
            title: '사용자 삭제',
            message: `${user.userName} 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
            confirmText: '삭제',
            cancelText: '취소',
            type: 'warning',
            isDestructive: true,
            onConfirm: () => {
                setLoading(true);

                // 관련 데이터 삭제 후 사용자 삭제 (Promise 체인)
                axios.delete(`/api/admin/users/${userId}/related-data`)
                    .then(() => {
                        return axios.delete(`/api/admin/users/${userId}`);
                    })
                    .then(() => {
                        // 성공 메시지 표시
                        modal.openModal({
                            title: '성공',
                            message: '사용자가 성공적으로 삭제되었습니다.',
                            type: 'success'
                        });
                        navigate('/admin/users');
                    })
                    .catch(error => {
                        console.error('사용자 삭제 실패:', error);
                        modal.openModal({
                            title: '오류 발생',
                            message: '사용자 삭제에 실패했습니다.',
                            type: 'error'
                        });
                        setLoading(false);
                    });
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!editForm.userName || !editForm.userName.trim()) {
            modal.openModal({
                title: '오류 발생',
                message: '이름은 필수 입력 항목입니다.',
                type: 'error'
            });
            return;
        }

        if (!editForm.userEmail || !editForm.userEmail.trim()) {
            modal.openModal({
                title: '오류 발생',
                message: '이메일은 필수 입력 항목입니다.',
                type: 'error'
            });
            return;
        }

        setLoading(true);

        axios.put(`/api/admin/users/${userId}`, editForm)
            .then(response => {
                setUser(editForm);
                setIsEditing(false);
                modal.openModal({
                    title: '성공',
                    message: '사용자 정보가 성공적으로 수정되었습니다.',
                    type: 'success'
                });
                setLoading(false);
            })
            .catch(error => {
                console.error('사용자 정보 수정 실패:', error);
                modal.openModal({
                    title: '오류 발생',
                    message: '사용자 정보 수정에 실패했습니다.',
                    type: 'error'
                });
                setLoading(false);
            });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    if (loading) return <LoadingSpinner message="사용자 정보를 불러오는 중..." />;
    if (!user) return <div>사용자 정보를 찾을 수 없습니다.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">사용자 상세 정보</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        목록으로
                    </button>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {isEditing ? '수정 취소' : '정보 수정'}
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* 사용자 헤더 */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            {user.userProfileImage && (
                                <img
                                    src={user.userProfileImage}
                                    alt={`${user.userName} 프로필`}
                                    className="w-16 h-16 mr-4 object-cover rounded-full"
                                />
                            )}
                            <div>
                                <h3 className="text-xl font-bold">{user.userName}</h3>
                                <div className="mt-1 text-sm text-gray-600">
                                    {user.userIsAdmin && (
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                            관리자
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>

                {/* 사용자 상세 정보 */}
                <div className="p-6">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">이름</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={editForm.userName}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                                    <input
                                        type="email"
                                        name="userEmail"
                                        value={editForm.userEmail}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">전화번호</label>
                                    <input
                                        type="text"
                                        name="userPhone"
                                        value={editForm.userPhone || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">성별</label>
                                    <select
                                        name="userGender"
                                        value={editForm.userGender || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">선택</option>
                                        <option value="male">남성</option>
                                        <option value="female">여성</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">주소</label>
                                    <input
                                        type="text"
                                        name="userAddress"
                                        value={editForm.userAddress || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">관리자 권한</label>
                                    <div className="mt-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                name="userIsAdmin"
                                                checked={editForm.userIsAdmin || false}
                                                onChange={handleCheckboxChange}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">관리자 권한 부여</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                >
                                    저장
                                </button>
                            </div>
                        </form>
                    ) : (
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">이메일</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user.userEmail}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500">전화번호</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user.userPhone}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500">생년월일</dt>
                                <dd className="mt-1 text-sm text-gray-900">{formatDate(user.userBirthdate)}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500">성별</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {user.userGender === 'male' ? '남성' : user.userGender === 'female' ? '여성' : '기타'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500">주소</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user.userAddress || '정보 없음'}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500">가입일</dt>
                                <dd className="mt-1 text-sm text-gray-900">{formatDate(user.userCreatedAt)}</dd>
                            </div>
                        </dl>
                    )}

                    {/* 추가 정보 - 이력서 및 지원내역 링크 */}
                    <div className="mt-8">
                        <h4 className="text-lg font-medium text-gray-700 mb-2">추가 정보</h4>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate(`/admin/applications?userId=${user.userId}`)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                지원 내역 보기
                            </button>
                            <button
                                onClick={() => navigate(`/admin/resumes?userId=${user.userId}`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                이력서 보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {modal.isOpen && (
                <ConfirmModal
                    isOpen={modal.isOpen}
                    onClose={modal.closeModal}
                    onConfirm={modal.modalProps.onConfirm}
                    title={modal.modalProps.title}
                    message={modal.modalProps.message}
                    confirmText={modal.modalProps.confirmText}
                    cancelText={modal.modalProps.cancelText}
                    type={modal.modalProps.type}
                    isDestructive={modal.modalProps.isDestructive}
                />
            )}
        </div>
    );
};

export default AdminUserDetail;