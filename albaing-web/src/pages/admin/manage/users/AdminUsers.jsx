import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { LoadingSpinner, ErrorMessage, ConfirmModal, useModal } from '../../../../components';
import AdminLayout from '../../AdminLayout';
import Pagination from '../../../../components/common/Pagination';
import UserEditModal from '../../../../components/modals/UserEditModal';
import ResumeViewEditModal from '../../../../components/modals/ResumeViewEditModal';

const UserDetailModal = ({ isOpen, onClose, user, onEdit, onViewResume }) => {
    if (!isOpen || !user) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'yyyy-MM-dd');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">회원 상세 정보</h3>
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
                    <div className="flex flex-col md:flex-row items-start">
                        <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
                            <div className="relative">
                                <img
                                    src={user.userProfileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&background=0D8ABC&color=fff&size=150`}
                                    alt={user.userName}
                                    className="w-36 h-36 rounded-full object-cover shadow-md"
                                />
                            </div>
                        </div>

                        <div className="md:w-2/3 md:pl-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">이름</h4>
                                    <p className="text-lg font-medium">{user.userName}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">이메일</h4>
                                    <p className="text-lg">{user.userEmail}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">전화번호</h4>
                                    <p className="text-lg">{user.userPhone || '-'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">생년월일</h4>
                                    <p className="text-lg">{user.userBirthdate ? formatDate(user.userBirthdate) : '-'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">성별</h4>
                                    <p className="text-lg">{user.userGender === 'male' ? '남성' : '여성'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">주소</h4>
                                    <p className="text-lg">{user.userAddress || '-'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">가입일</h4>
                                    <p className="text-lg">{formatDate(user.userCreatedAt)}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">최근 수정일</h4>
                                    <p className="text-lg">{formatDate(user.userUpdatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            onClick={() => onViewResume(user)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            이력서 보기
                        </button>
                        <button
                            onClick={() => onEdit(user)}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                        >
                            회원정보 수정
                        </button>
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

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    const detailModal = useModal();
    const deleteModal = useModal();
    const editModal = useModal();
    const resumeModal = useModal();

    // 회원 목록 가져오기
    const fetchUsers = () => {
        setLoading(true);
        setError(null);

        axios.get('/api/admin/users', {
            params: {
                userName: filters.name,
                userEmail: filters.email,
                userPhone: filters.phone,
                sortOrderBy: sortField,
                isDESC: sortDirection === 'desc'
            }
        })
            .then(response => {
                setUsers(response.data);
                setTotalItems(response.data.length);
                setLoading(false);
            })
            .catch(error => {
                console.error('회원 목록 로딩 실패:', error);
                setError('회원 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, [sortField, sortDirection]);

    // 회원 삭제
    const handleDeleteUser = () => {
        if (!selectedUser) return;

        setLoading(true);

        axios.delete(`/api/admin/users/${selectedUser.userId}`)
            .then(() => {
                fetchUsers();
                deleteModal.closeModal();
                setSelectedUser(null);
            })
            .catch(error => {
                console.error('회원 삭제 실패:', error);
                setError('회원 삭제에 실패했습니다.');
                setLoading(false);
            });
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        detailModal.openModal();
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        editModal.openModal();
    };

    const handleViewResume = (user) => {
        setSelectedUser(user);
        resumeModal.openModal();
    };

    // 회원 정보 업데이트
    const handleUpdateUser = (updatedUser) => {
        setLoading(true);

        const formattedUser = {
            ...updatedUser,
            userBirthdate: updatedUser.userBirthdate ? new Date(updatedUser.userBirthdate) : null,
            userCreatedAt: selectedUser.userCreatedAt || new Date(),
            userUpdatedAt: new Date()
        };

        axios.put(`/api/admin/users/${updatedUser.userId}`, formattedUser)
            .then(() => {
                fetchUsers();
                editModal.closeModal();
                detailModal.closeModal();
                setSelectedUser(null);
            })
            .catch(error => {
                console.error('회원 정보 수정 실패:', error);
                console.error('에러 상세:', error.response?.data || error.message);
                setError(`회원 정보 수정에 실패했습니다: ${error.response?.data?.message || error.message}`);
                setLoading(false);
            });
    };

    const downloadCSV = (url, filename) => {
        axios({
            url: url,
            method: 'GET',
            responseType: 'blob',
            headers: {
                'Accept': 'text/csv;charset=UTF-8'
            }
        })
            .then((response) => {
                const blob = new Blob([response.data], { type: 'text/csv;charset=UTF-8' });
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(a);
            })
            .catch((error) => {
                console.error('CSV 다운로드 실패:', error);
                alert('CSV 파일 다운로드에 실패했습니다.');
            });
    };

    const handleOpenDeleteModal = (user) => {
        setSelectedUser(user);
        deleteModal.openModal();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getCurrentUsers = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return users.slice(indexOfFirstItem, indexOfLastItem);
    };

    const renderSortIcon = (field) => {
        if (sortField !== field) {
            return (
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }

        return sortDirection === 'asc' ? (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => downloadCSV('/api/admin/users/csv', `알바잉_회원목록_${format(new Date(), 'yyyyMMdd')}.csv`)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        회원 목록 CSV 다운로드
                    </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">회원 관리</h1>
                <p className="text-gray-600 mt-1">개인 회원 정보를 관리할 수 있습니다.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            placeholder="이름 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={filters.email}
                            onChange={handleFilterChange}
                            placeholder="이메일 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={filters.phone}
                            onChange={handleFilterChange}
                            placeholder="전화번호 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            검색
                        </button>
                    </div>
                </form>
            </div>

            {error && <ErrorMessage message={error} className="mb-6" />}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <LoadingSpinner message="회원 정보를 불러오는 중..." fullScreen={false} className="py-12" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('userId')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            번호 {sortField === 'userId' && renderSortIcon('userId')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            이름 {renderSortIcon('name')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('email')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            이메일 {renderSortIcon('email')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        전화번호
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('createdAt')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            가입일 {renderSortIcon('createdAt')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        관리
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentUsers().length > 0 ? (
                                    getCurrentUsers().map((user) => (
                                        <tr key={user.userId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.userId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={user.userProfileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&background=0D8ABC&color=fff`}
                                                            alt={user.userName}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.userName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.userEmail}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.userPhone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(user.userCreatedAt), 'yyyy-MM-dd')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewUser(user)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        상세
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(user)}
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
                                            검색 결과가 없습니다.
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

            {/* 회원 상세 모달 */}
            <UserDetailModal
                isOpen={detailModal.isOpen}
                onClose={detailModal.closeModal}
                user={selectedUser}
                onEdit={handleEditUser}
                onViewResume={handleViewResume}
            />

            {/* 회원 정보 수정 모달 */}
            <UserEditModal
                isOpen={editModal.isOpen}
                onClose={editModal.closeModal}
                user={selectedUser}
                onUpdate={handleUpdateUser}
            />

            {/* 이력서 보기 모달 */}
            <ResumeViewEditModal
                isOpen={resumeModal.isOpen}
                onClose={resumeModal.closeModal}
                user={selectedUser}
                onUpdate={fetchUsers}
            />

            {/* 삭제 확인 모달 */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDeleteUser}
                title="회원 삭제"
                message={`'${selectedUser?.userName}' 회원을 삭제하시겠습니까? 삭제된 회원 정보는 복구할 수 없습니다.`}
                confirmText="삭제"
                cancelText="취소"
                type="danger"
            />
        </AdminLayout>
    );
};

export default AdminUsers;