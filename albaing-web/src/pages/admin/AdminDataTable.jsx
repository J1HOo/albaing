import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Filter, Download, Trash, Check, X, Edit, Eye } from 'lucide-react';

const AdminDataTable = ({
                            data = [],
                            columns = [],
                            title = "데이터 테이블",
                            onRowClick,
                            onDelete,
                            onEdit,
                            onView,
                            selectable = false,
                            searchable = true,
                            exportable = true,
                            pagination = true
                        }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({});

    // 정렬 처리
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // 정렬된 데이터 얻기
    const getSortedData = () => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // 필터링된 데이터 얻기
    const getFilteredData = () => {
        let filteredData = getSortedData();

        // 검색어 필터링
        if (searchTerm) {
            filteredData = filteredData.filter(item =>
                columns.some(column =>
                    item[column.key] &&
                    String(item[column.key]).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // 컬럼별 필터 적용
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                filteredData = filteredData.filter(item =>
                    String(item[key]).toLowerCase().includes(filters[key].toLowerCase())
                );
            }
        });

        return filteredData;
    };

    // 페이지네이션 처리된 데이터 얻기
    const getPaginatedData = () => {
        const filteredData = getFilteredData();
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(startIndex, startIndex + rowsPerPage);
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
        if (selectedRows.length === getPaginatedData().length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(getPaginatedData().map(row => row.id));
        }
    };

    // CSV 내보내기
    const exportToCSV = () => {
        const filteredData = getFilteredData();
        const headers = columns.map(column => column.label).join(',');
        const rows = filteredData.map(item =>
            columns.map(column =>
                typeof item[column.key] === 'string' && item[column.key].includes(',') ?
                    `"${item[column.key]}"` : item[column.key]
            ).join(',')
        ).join('\n');

        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 필터 핸들러
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(1); // 필터 변경시 첫 페이지로 이동
    };

    // 선택된 항목 일괄 삭제
    const handleBulkDelete = () => {
        if (window.confirm(`선택한 ${selectedRows.length}개 항목을 삭제하시겠습니까?`)) {
            selectedRows.forEach(id => onDelete && onDelete(id));
            setSelectedRows([]);
        }
    };

    const totalPages = Math.ceil(getFilteredData().length / rowsPerPage);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <div className="flex space-x-2">
                        {exportable && (
                            <button
                                onClick={exportToCSV}
                                className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors flex items-center"
                            >
                                <Download size={16} className="mr-1" /> 내보내기
                            </button>
                        )}
                        {selectedRows.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors flex items-center"
                            >
                                <Trash size={16} className="mr-1" /> 선택 삭제 ({selectedRows.length})
                            </button>
                        )}
                    </div>
                </div>

                {searchable && (
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // 검색어 변경시 첫 페이지로 이동
                            }}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                )}
            </div>

            {/* 테이블 본문 */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {selectable && (
                            <th className="px-4 py-3">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === getPaginatedData().length && getPaginatedData().length > 0}
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
                                <div className="flex items-center space-x-1 group">
                                    <span>{column.label}</span>
                                    {column.sortable !== false && (
                                        <div className="flex flex-col">
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
                                        <div className="relative group">
                                            <Filter size={14} className="ml-1 text-gray-400 cursor-pointer" />
                                            <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 hidden group-hover:block">
                                                <div className="p-2">
                                                    <input
                                                        type="text"
                                                        placeholder={`${column.label} 필터링...`}
                                                        value={filters[column.key] || ''}
                                                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            </div>
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
                    {getPaginatedData().length > 0 ? (
                        getPaginatedData().map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                            >
                                {selectable && (
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(row.id)}
                                                onChange={() => handleRowSelect(row.id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                        </div>
                                    </td>
                                )}

                                {columns.map((column) => (
                                    <td key={column.key} className="px-4 py-4 whitespace-nowrap">
                                        {column.render ? column.render(row[column.key], row) : (
                                            <div className={column.className || "text-sm text-gray-900"}>
                                                {row[column.key] !== undefined ? row[column.key] : '-'}
                                            </div>
                                        )}
                                    </td>
                                ))}

                                {(onEdit || onView || onDelete) && (
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end space-x-2">
                                            {onView && (
                                                <button
                                                    onClick={() => onView(row)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="상세보기"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="수정"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('정말로 이 항목을 삭제하시겠습니까?')) {
                                                            onDelete(row.id || row);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="삭제"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + (selectable ? 1 : 0) + ((onEdit || onDelete || onView) ? 1 : 0)} className="px-4 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
                                데이터가 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
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
                                총 <span className="font-medium">{getFilteredData().length}</span> 항목 중{' '}
                                <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> -
                                <span className="font-medium">
                  {Math.min(currentPage * rowsPerPage, getFilteredData().length)}
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

                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">처음</span>
                                        <ChevronDown className="h-5 w-5 rotate-90" />
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">이전</span>
                                        <ChevronDown className="h-5 w-5 -rotate-90" />
                                    </button>

                                    {/* 페이지 번호 */}
                                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                        const pageNum = currentPage <= 3
                                            ? i + 1
                                            : currentPage >= totalPages - 2
                                                ? totalPages - 4 + i
                                                : currentPage - 2 + i;

                                        if (pageNum <= 0 || pageNum > totalPages) return null;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    currentPage === pageNum
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">다음</span>
                                        <ChevronDown className="h-5 w-5 rotate-90" />
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">마지막</span>
                                        <ChevronDown className="h-5 w-5 -rotate-90" />
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