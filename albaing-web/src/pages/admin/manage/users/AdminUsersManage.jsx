import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {ConfirmModal, LoadingSpinner, useModal} from '../../../../components';

const AdminUsersManage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        userName: '',
        userEmail: '',
        userPhone: '',
        sortOrderBy: '이름',
        isDESC: false
    });

    const confirmModal = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [searchParams.sortOrderBy, searchParams.isDESC]);

    const fetchUsers = () => {
        setLoading(true);

        const params = {
            ...searchParams,
            userName: searchParams.userName || undefined,
            userEmail: searchParams.userEmail || undefined,
            userPhone: searchParams.userPhone || undefined
        };

        axios.get('/api/admin/users', { params })
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('회원 목록 로딩 실패:', error);
                confirmModal.openModal({
                    title: '오류',
                    message: '회원 목록을 불러오는데 실패했습니다.',
                    type: 'error'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSortChange = (field) => {
        setSearchParams(prev => ({
            ...prev,
            sortOrderBy: field,
            isDESC: prev.sortOrderBy === field ? !prev.isDESC : false
        }));
    };

    const confirmDelete = (user) => {
        confirmModal.openModal({
            title: '회원 삭제',
            message: `${user.userName}(${user.userEmail}) 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
            confirmText: '삭제',
            cancelText: '취소',
            type: 'warning',
            onConfirm: () => handleDelete(user.userId)
        });
    };

    const handleDelete = (userId) => {
        axios.delete(`/api/admin/users/${userId}/related-data`)
            .then(() => {
                return axios.delete(`/api/admin/users/${userId}`);
            })
            .then(() => {
                setUsers(users.filter(user => user.userId !== userId));
                confirmModal.openModal({
                    title: '성공',
                    message: '회원이 삭제되었습니다.',
                    type: 'success'
                });
            })
            .catch(error => {
                console.error('회원 삭제 실패:', error);
                confirmModal.openModal({
                    title: '오류',
                    message: '회원 삭제에 실패했습니다.',
                    type: 'error'
                });
            });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    if (loading) return <LoadingSpinner message="회원 목록을 불러오는 중..." />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">회원 관리</h2>

            <div className="mb-6 bg-white p-4 shadow rounded-lg">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={searchParams.userName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="이름 검색"
                        />
                    </div>

                    <div>
                        <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        <input
                            type="text"
                            id="userEmail"
                            name="userEmail"
                            value={searchParams.userEmail}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="이메일 검색"
                        />
                    </div>

                    <div>
                        <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                        <input
                            type="text"
                            id="userPhone"
                            name="userPhone"
                            value={searchParams.userPhone}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="전화번호 검색"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            검색
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('이름')}>
                            <div className="flex items-center">
                                이름
                                {searchParams.sortOrderBy === '이름' && (
                                    <span className="ml-1">{searchParams.isDESC ? '▼' : '▲'}</span>
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('전화번호')}>
                            <div className="flex items-center">
                                전화번호
                                {searchParams.sortOrderBy === '전화번호' && (
                                    <span className="ml-1">{searchParams.isDESC ? '▼' : '▲'}</span>
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('가입일')}>
                            <div className="flex items-center">
                                가입일
                                {searchParams.sortOrderBy === '가입일' && (
                                    <span className="ml-1">{searchParams.isDESC ? '▼' : '▲'}</span>
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.userId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.userName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.userEmail}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.userPhone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(user.userCreatedAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/admin/users/${user.userId}`)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            상세
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(user)}
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
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                검색 결과가 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            {confirmModal.isOpen && (
                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={confirmModal.closeModal}
                    onConfirm={confirmModal.modalProps.onConfirm}
                    title={confirmModal.modalProps.title}
                    message={confirmModal.modalProps.message}
                />
            )}
        </div>
    );
};

export default AdminUsersManage;