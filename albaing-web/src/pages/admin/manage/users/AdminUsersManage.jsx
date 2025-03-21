import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ConfirmModal, useModal } from '../../../../components';
import { useErrorHandler } from "../../../../components/ErrorHandler";
import AdminDataTable from "../../AdminDataTable";

const AdminUsersManage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [searchParams, setSearchParams] = useState({
        userName: '',
        userEmail: '',
        userPhone: '',
        sortOrderBy: '이름',
        isDESC: false,
        currentPage: 1,
        rowsPerPage: 10
    });

    const confirmModal = useModal();
    const navigate = useNavigate();
    const { handleError, handleSuccess } = useErrorHandler();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);

        const params = {
            userName: searchParams.userName || undefined,
            userEmail: searchParams.userEmail || undefined,
            userPhone: searchParams.userPhone || undefined,
            sortOrderBy: searchParams.sortOrderBy,
            isDESC: searchParams.isDESC,
            page: searchParams.currentPage,
            limit: searchParams.rowsPerPage
        };

        axios.get('/api/admin/users', { params })
            .then(response => {
                setUsers(response.data.users || response.data);
                setTotalItems(response.data.total || response.data.length);
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '회원 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleSearch = (searchTerm, page, rowsPerPage) => {
        setSearchParams(prev => ({
            ...prev,
            userName: searchTerm,
            currentPage: page || 1,
            rowsPerPage: rowsPerPage || prev.rowsPerPage
        }));

        // 실제 API 호출
        fetchUsers();
    };

    const handleSort = (key, direction) => {
        // 컬럼 키를 API 정렬 필드명으로 변환
        const sortFieldMap = {
            'userName': '이름',
            'userEmail': '이메일',
            'userPhone': '전화번호',
            'userCreatedAt': '가입일'
        };

        setSearchParams(prev => ({
            ...prev,
            sortOrderBy: sortFieldMap[key] || key,
            isDESC: direction === 'desc'
        }));

        fetchUsers();
    };

    const handleFilter = (filters) => {
        setSearchParams(prev => ({
            ...prev,
            ...filters,
            currentPage: 1
        }));

        fetchUsers();
    };

    const handlePageChange = (page, rowsPerPage) => {
        setSearchParams(prev => ({
            ...prev,
            currentPage: page,
            rowsPerPage: rowsPerPage || prev.rowsPerPage
        }));

        fetchUsers();
    };

    const handleDelete = (userId) => {
        // Promise 체인 사용 (async/await 대신)
        axios.delete(`/api/admin/users/${userId}/related-data`)
            .then(() => {
                return axios.delete(`/api/admin/users/${userId}`);
            })
            .then(() => {
                setUsers(users.filter(user => user.userId !== userId));
                handleSuccess('회원이 삭제되었습니다.');
            })
            .catch(error => {
                handleError(error, '회원 삭제에 실패했습니다.');
            });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    // 실제 UI에서 표시할 컬럼 정의
    const columns = [
        {
            key: 'userName',
            label: '이름',
            sortable: true,
            filterable: true
        },
        {
            key: 'userEmail',
            label: '이메일',
            filterable: true
        },
        {
            key: 'userPhone',
            label: '전화번호',
            sortable: true
        },
        {
            key: 'userCreatedAt',
            label: '가입일',
            sortable: true,
            render: (value) => formatDate(value)
        },
        {
            key: 'userIsAdmin',
            label: '관리자 권한',
            render: (value) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${value ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {value ? '관리자' : '일반회원'}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">회원 관리</h2>
            </div>

            <div className="bg-white p-4 shadow rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={searchParams.userName}
                            onChange={(e) => setSearchParams({...searchParams, userName: e.target.value})}
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
                            onChange={(e) => setSearchParams({...searchParams, userEmail: e.target.value})}
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
                            onChange={(e) => setSearchParams({...searchParams, userPhone: e.target.value})}
                            className="w-full p-2 border rounded"
                            placeholder="전화번호 검색"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={fetchUsers}
                        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        검색
                    </button>
                </div>
            </div>

            <AdminDataTable
                title="회원 목록"
                data={users}
                columns={columns}
                isLoading={loading}
                totalItems={totalItems}
                onSearch={handleSearch}
                onSort={handleSort}
                onFilter={handleFilter}
                onPageChange={handlePageChange}
                onView={(user) => navigate(`/admin/users/${user.userId}`)}
                onDelete={handleDelete}
                selectable={true}
                searchable={true}
                exportable={true}
                pagination={true}
            />

            {confirmModal.isOpen && (
                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={confirmModal.closeModal}
                    onConfirm={confirmModal.modalProps.onConfirm}
                    title={confirmModal.modalProps.title}
                    message={confirmModal.modalProps.message}
                    confirmText={confirmModal.modalProps.confirmText}
                    cancelText={confirmModal.modalProps.cancelText}
                    type={confirmModal.modalProps.type}
                />
            )}
        </div>
    );
};

export default AdminUsersManage;