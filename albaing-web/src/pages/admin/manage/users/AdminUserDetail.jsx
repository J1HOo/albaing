import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, useModal } from '../../../../components';

const AdminUserDetail = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const confirmModal = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserDetail();
    }, [userId]);

    const fetchUserDetail = () => {
        setLoading(true);
        axios.get(`/api/admin/users/${userId}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('사용자 상세 정보 로딩 실패:', error);
                confirmModal.openModal({
                    title: '오류',
                    message: '사용자 정보를 불러오는데 실패했습니다.',
                    type: 'error'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = () => {
        confirmModal.openModal({
            title: '사용자 삭제',
            message: `${user.userName} 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 관련된 모든 이력서와 지원 내역이 삭제됩니다.`,
            confirmText: '삭제',
            cancelText: '취소',
            type: 'warning',
            onConfirm: () => deleteUser()
        });
    };

    const deleteUser = () => {
        axios.delete(`/api/admin/users/${userId}`)
            .then(() => {
                confirmModal.openModal({
                    title: '성공',
                    message: '사용자가 삭제되었습니다.',
                    type: 'success',
                    onClose: () => navigate('/admin/users')
                });
            })
            .catch(error => {
                console.error('사용자 삭제 실패:', error);
                confirmModal.openModal({
                    title: '오류',
                    message: '사용자 삭제에 실패했습니다.',
                    type: 'error'
                });
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

                    {/* 추가 정보 - 이력서 링크 등 */}
                    <div className="mt-8">
                        <h4 className="text-lg font-medium text-gray-700 mb-2">추가 정보</h4>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate(`/admin/applications?userId=${user.userId}`)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                지원 내역 보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserDetail;