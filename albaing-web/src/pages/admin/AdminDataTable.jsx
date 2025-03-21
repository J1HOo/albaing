import React, {useState, useEffect} from 'react';
import {Search, ChevronDown, ChevronUp, Filter, Download, Trash, X, Edit, Eye} from 'lucide-react';
import {useModal, LoadingSpinner} from '../../components';
import {useErrorHandler} from '../../components/ErrorHandler';

const AdminDataTable = ({
                            data = [],
                            columns = [],
                            title = "데이터 테이블",
                            onRowClick,
                            onDelete,
                            onEdit,
                            onView,
                            isLoading = false,
                            onSearch,
                            onSort,
                            onFilter,
                            onExport,
                            totalItems = 0,
                            selectable = false,
                            searchable = true,
                            exportable = true,
                            pagination = true
                        }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'asc'});
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({});
    const [filterMenuOpen, setFilterMenuOpen] = useState(null);

    const {handleError} = useErrorHandler();
    const confirmModal = useModal();

    // 페이지네이션 설정
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const pageNumbers = [];
    const maxPageButtons = 5;

    // 페이지 버튼 계산
    let startPage, endPage;
    if (totalPages <= maxPageButtons) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const maxPagesBeforeCurrentPage = Math.floor(maxPageButtons / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPageButtons / 2) - 1;

        if (currentPage <= maxPagesBeforeCurrentPage) {
            // 현재 페이지가 시작 부분에 가까운 경우
            startPage = 1;
            endPage = maxPageButtons;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            // 현재 페이지가 끝 부분에 가까운 경우
            startPage = totalPages - maxPageButtons + 1;
            endPage = totalPages;
        } else {
            // 현재 페이지가 중간인 경우
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        // 페이지 변경 시 데이터 리로드 로직
        if (onSearch) {
            handleSearch();
        }
    }, [currentPage, rowsPerPage]);

    // 정렬 처리
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({key, direction});

        if (onSort) {
            onSort(key, direction);
        }
    };

    // 검색 처리
    const handleSearch = (e) => {
        if (e) e.preventDefault();

        if (onSearch) {
            onSearch(searchTerm, currentPage, rowsPerPage);
        }
    };

    // 필터 처리
    const handleFilterChange = (key, value) => {
        const newFilters = {...filters, [key]: value};
        setFilters(newFilters);
        setCurrentPage(1); // 필터 변경시 첫 페이지로 이동

        if (onFilter) {
            onFilter(newFilters);
        }
    };

    // 필터 메뉴 토글
    const toggleFilterMenu = (key) => {
        setFilterMenuOpen(filterMenuOpen === key ? null : key);
    };

    // 필터 초기화
    const clearFilters = () => {
        setFilters({});
        setCurrentPage(1);

        if (onFilter) {
            onFilter({});
        }
    };

    // 행 선택 처리
    const handleRowSelect = (id) => {
        setSelectedRows(prev => {
            if (prev.includes(id)) {
                return prev.filter(rowId => rowId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // 전체 선택 처리
    const handleSelectAll = () => {
        if (selectedRows.length === data.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(data.map(row => row.id || row._id));
        }
    };

    // CSV 내보내기
    const exportToCSV = () => {
        if (onExport) {
            onExport();
            return;
        }

        try {
            const headers = columns.map(column => column.label).join(',');
            const rows = data.map(item =>
                columns.map(column => {
                    const value = typeof item[column.key] === 'string' && item[column.key].includes(',') ?
                        `"${item[column.key]}"` : item[column.key];
                    return value !== undefined ? value : '';
                }).join(',')
            ).join('\n');

            const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            handleError(error, "CSV 내보내기 중 오류가 발생했습니다.");
        }
    };

    // 선택된 항목 일괄 삭제
    const handleBulkDelete = () => {
        confirmModal.openModal({
            title: '선택 항목 삭제',
            message: `선택한 ${selectedRows.length}개 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
            confirmText: '삭제',
            cancelText: '취소',
            type: 'warning',
            onConfirm: () => {
                // 실제 삭제 로직
                if (onDelete) {
                    try {
                        selectedRows.forEach(id => onDelete(id));
                        setSelectedRows([]);
                    } catch (error) {
                        handleError(error, "항목 삭제 중 오류가 발생했습니다.");
                    }
                }
            }
        });
    };

    // 단일 항목 삭제
    const confirmDelete = (row) => {
        const rowId = row.id || row._id;
        const rowName = row.name || row.title || `ID: ${rowId}`;

        confirmModal.openModal({
            title: '항목 삭제',
            message: `"${rowName}" 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
            confirmText: '삭제',
            cancelText: '취소',
            type: 'warning',
            onConfirm: () => {
                if (onDelete) {
                    onDelete(rowId);
                }
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <div className="flex space-x-2">
                        {Object.keys(filters).length > 0 && (
                            <button
                                onClick={clearFilters}
                                className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                            >
                                <X size={16} className="mr-1"/> 필터 초기화
                            </button>
                        )}

                        {exportable && (
                            <button
                                onClick={exportToCSV}
                                className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors flex items-center"
                            >
                                <Download size={16} className="mr-1"/> 내보내기
                            </button>
                        )}

                        {selectedRows.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors flex items-center"
                            >
                                <Trash size={16} className="mr-1"/> 선택 삭제 ({selectedRows.length})
                            </button>
                        )}
                    </div>
                </div>

                {searchable && (
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400"/>
                            </div>
                            <input
                                type="text"
                                placeholder="검색어를 입력하세요..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (!e.target.value) {
                                        // 검색어가 비어있을 때 검색 재실행
                                        setCurrentPage(1);
                                        if (onSearch) onSearch("", 1, rowsPerPage);
                                    }
                                }}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            검색
                        </button>
                    </form>
                )}
            </div>

            {/* 테이블 본문 */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="py-12 flex justify-center items-center">
                        <LoadingSpinner message="데이터를 불러오는 중..." fullScreen={false}/>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            {selectable && (
                                <th className="px-4 py-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.length === data.length && data.length > 0}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </div>
                                </th>
                            )}

                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                >
                                    <div className="flex items-center group">
                                        <span>{column.label}</span>
                                        {column.sortable !== false && (
                                            <div className="flex flex-col ml-1">
                                                <ChevronUp
                                                    size={12}
                                                    className={`transition-colors ${
                                                        sortConfig.key === column.key && sortConfig.direction === 'asc'
                                                            ? 'text-blue-600'
                                                            : 'text-gray-400 group-hover:text-gray-500'
                                                    }`}
                                                />
                                                <ChevronDown
                                                    size={12}
                                                    className={`transition-colors ${
                                                        sortConfig.key === column.key && sortConfig.direction === 'desc'
                                                            ? 'text-blue-600'
                                                            : 'text-gray-400 group-hover:text-gray-500'
                                                    }`}
                                                />
                                            </div>
                                        )}
                                        {column.filterable && (
                                            <div className="relative ml-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFilterMenu(column.key);
                                                    }}
                                                    className={`ml-1 p-1 rounded-full ${
                                                        filters[column.key] ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <Filter size={14}/>
                                                </button>
                                                {filterMenuOpen === column.key && (
                                                    <div
                                                        className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                                        <div className="p-2">
                                                            <input
                                                                type="text"
                                                                placeholder={`${column.label} 필터링...`}
                                                                value={filters[column.key] || ''}
                                                                onChange={(e) => handleFilterChange(column.key, e.target.value)}
                                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <div className="flex justify-end mt-2 space-x-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleFilterChange(column.key, '');
                                                                        toggleFilterMenu(null);
                                                                    }}
                                                                    className="px-2 py-1 text-xs text-gray-700 hover:text-gray-900"
                                                                >
                                                                    초기화
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleFilterMenu(null);
                                                                    }}
                                                                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                                                >
                                                                    적용
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}

                            {(onEdit || onView || onDelete) && (
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    작업
                                </th>
                            )}
                        </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={row.id || row._id || rowIndex}
                                    className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                >
                                    {selectable && (
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(row.id || row._id)}
                                                    onChange={() => handleRowSelect(row.id || row._id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </div>
                                        </td>
                                    )}

                                    {columns.map((column) => (
                                        <td key={`${row.id || row._id || rowIndex}-${column.key}`}
                                            className="px-4 py-4 whitespace-nowrap">
                                            {column.render ? column.render(row[column.key], row) : (
                                                <div className={column.className || "text-sm text-gray-900"}>
                                                    {row[column.key] !== undefined ? row[column.key] : '-'}
                                                </div>
                                            )}
                                        </td>
                                    ))}

                                    {(onEdit || onView || onDelete) && (
                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium"
                                            onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end space-x-2">
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(row)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                        title="상세보기"
                                                    >
                                                        <Eye size={18}/>
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(row)}
                                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                                        title="수정"
                                                    >
                                                        <Edit size={18}/>
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => confirmDelete(row)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                        title="삭제"
                                                    >
                                                        <Trash size={18}/>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0) + ((onEdit || onDelete || onView) ? 1 : 0)}
                                    className="px-4 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
                                    데이터가 없습니다.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 페이지네이션 */}
            {pagination && totalPages > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                currentPage === 1 ? 'text-gray-300 bg-gray-50' : 'text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                        >
                            이전
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                currentPage === totalPages ? 'text-gray-300 bg-gray-50' : 'text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                        >
                            다음
                        </button>
                    </div>

                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                총 <span className="font-medium">{totalItems}</span> 항목 중{' '}
                                <span
                                    className="font-medium">{Math.min((currentPage - 1) * rowsPerPage + 1, totalItems)}</span> -
                                <span className="font-medium">
                                    {Math.min(currentPage * rowsPerPage, totalItems)}
                                </span> 표시
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {[10, 20, 50, 100].map(size => (
                                        <option key={size} value={size}>
                                            {size}개씩 보기
                                        </option>
                                    ))}
                                </select>

                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                     aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">처음</span>
                                        <ChevronDown className="h-5 w-5 rotate-90"/>
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">이전</span>
                                        <ChevronDown className="h-5 w-5 -rotate-90"/>
                                    </button>

                                    {/* 페이지 번호 */}
                                    {pageNumbers.map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                currentPage === page
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">다음</span>
                                        <ChevronDown className="h-5 w-5 rotate-90"/>
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">마지막</span>
                                        <ChevronDown className="h-5 w-5 -rotate-90"/>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDataTable;