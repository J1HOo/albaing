import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from "../../../../components/ErrorHandler";
import AdminDataTable from "../../AdminDataTable";
import adminApiService from '../../../../service/apiAdminService';

const AdminNoticeManage = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [searchParams, setSearchParams] = useState({
        searchTerm: '',
        currentPage: 1,
        rowsPerPage: 10,
        sortField: 'noticeCreatedAt',
        sortDirection: 'desc'
    });

    const navigate = useNavigate();
    const { handleError, handleSuccess, confirmAction } = ErrorHandler();

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = () => {
        setLoading(true);

        adminApiService.getAllNotices()
            .then(response => {
                const data = response.notices || response;

                // 검색어로 필터링
                let filteredData = data;
                if (searchParams.searchTerm) {
                    const term = searchParams.searchTerm.toLowerCase();
                    filteredData = data.filter(notice =>
                        notice.noticeTitle.toLowerCase().includes(term)
                    );
                }

                // 정렬
                const sortField = searchParams.sortField;
                const sortDirection = searchParams.sortDirection;

                filteredData.sort((a, b) => {
                    const fieldA = a[sortField];
                    const fieldB = b[sortField];

                    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
                    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });

                // 페이지네이션
                setTotalItems(filteredData.length);
                const startIdx = (searchParams.currentPage - 1) * searchParams.rowsPerPage;
                const endIdx = startIdx + searchParams.rowsPerPage;

                setNotices(filteredData.slice(startIdx, endIdx));
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '공지사항 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleDelete = (noticeId) => {
        confirmAction(
            '정말로 이 공지사항을 삭제하시겠습니까?',
            () => {
                setLoading(true);

                adminApiService.deleteNotice(noticeId)
                    .then(() => {
                        setNotices(notices.filter(notice => notice.noticeId !== noticeId));
                        handleSuccess('공지사항이 성공적으로 삭제되었습니다.');
                        setLoading(false);
                    })
                    .catch(error => {
                        handleError(error, '공지사항 삭제에 실패했습니다.');
                        setLoading(false);
                    });
            },
            {
                title: '공지사항 삭제',
                confirmText: '삭제',
                cancelText: '취소',
                type: 'warning',
                isDestructive: true
            }
        );
    };

    const handleSearch = (searchTerm, page = 1, rowsPerPage = searchParams.rowsPerPage) => {
        setSearchParams(prev => ({
            ...prev,
            searchTerm,
            currentPage: page,
            rowsPerPage
        }));

        setTimeout(fetchNotices, 0);
    };

    const handleSort = (field, direction) => {
        setSearchParams(prev => ({
            ...prev,
            sortField: field,
            sortDirection: direction,
            currentPage: 1
        }));

        setTimeout(fetchNotices, 0);
    };

    const handlePageChange = (page, rowsPerPage = searchParams.rowsPerPage) => {
        setSearchParams(prev => ({
            ...prev,
            currentPage: page,
            rowsPerPage
        }));

        setTimeout(fetchNotices, 0);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    // 테이블 컬럼 정의
    const columns = [
        {
            key: 'noticeId',
            label: '번호',
            sortable: true
        },
        {
            key: 'noticeTitle',
            label: '제목',
            sortable: true,
            filterable: true
        },
        {
            key: 'noticeCreatedAt',
            label: '등록일',
            sortable: true,
            render: (value) => formatDate(value)
        }
    ];

    // 행 액션 렌더링
    const renderRowActions = (notice) => (
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
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">공지사항 관리</h2>
                <button
                    onClick={() => navigate('/admin/notices/new')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    공지사항 등록
                </button>
            </div>

            <AdminDataTable
                title="공지사항 목록"
                data={notices}
                columns={columns}
                isLoading={loading}
                totalItems={totalItems}
                onSearch={handleSearch}
                onSort={handleSort}
                onPageChange={handlePageChange}
                renderRowActions={renderRowActions}
                onView={(notice) => navigate(`/notices/${notice.noticeId}`)}
                selectable={false}
                searchable={true}
                exportable={true}
                pagination={true}
            />
        </div>
    );
};

export default AdminNoticeManage;