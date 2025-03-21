import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from "../../../../components/ErrorHandler";
import AdminDataTable from "../../AdminDataTable";
import adminApiService from '../../../../service/apiAdminService';

const AdminJobPostsManage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [searchParams, setSearchParams] = useState({
    companyName: '',
    jobPostTitle: '',
    jobPostStatus: '',
    sortOrderBy: '공고 제목',
    isDESC: false,
    currentPage: 1,
    rowsPerPage: 10
  });

  const { handleError, handleSuccess, confirmAction } = ErrorHandler();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobPosts();
  }, []);

  const fetchJobPosts = () => {
    setLoading(true);

    const params = {
      companyName: searchParams.companyName || undefined,
      jobPostTitle: searchParams.jobPostTitle || undefined,
      jobPostStatus: searchParams.jobPostStatus || undefined,
      sortOrderBy: searchParams.sortOrderBy,
      isDESC: searchParams.isDESC,
      page: searchParams.currentPage,
      limit: searchParams.rowsPerPage
    };

    adminApiService.getJobPosts(params)
        .then(response => {
          setJobPosts(response.jobPosts || response);
          setTotalItems(response.total || response.length);
          setLoading(false);
        })
        .catch(error => {
          handleError(error, '공고 목록을 불러오는데 실패했습니다.');
          setLoading(false);
        });
  };

  const handleSearch = (searchTerm, page, rowsPerPage) => {
    setSearchParams(prev => ({
      ...prev,
      jobPostTitle: searchTerm,
      currentPage: page || 1,
      rowsPerPage: rowsPerPage || prev.rowsPerPage
    }));

    fetchJobPosts();
  };

  const handleSort = (key, direction) => {
    // 컬럼 키를 API 정렬 필드명으로 변환
    const sortFieldMap = {
      'jobPostTitle': '공고 제목',
      'companyName': '법인명',
      'jobPostDueDate': '공고 마감일'
    };

    setSearchParams(prev => ({
      ...prev,
      sortOrderBy: sortFieldMap[key] || key,
      isDESC: direction === 'desc'
    }));

    fetchJobPosts();
  };

  const handleFilter = (filters) => {
    setSearchParams(prev => ({
      ...prev,
      ...filters,
      currentPage: 1
    }));

    fetchJobPosts();
  };

  const handlePageChange = (page, rowsPerPage) => {
    setSearchParams(prev => ({
      ...prev,
      currentPage: page,
      rowsPerPage: rowsPerPage || prev.rowsPerPage
    }));

    fetchJobPosts();
  };

  const handleDelete = (jobPostId) => {
    adminApiService.deleteJobPost(jobPostId)
        .then(() => {
          setJobPosts(prev => prev.filter(post => post.jobPostId !== jobPostId));
          handleSuccess('공고가 삭제되었습니다.');
        })
        .catch(error => {
          handleError(error, '공고 삭제에 실패했습니다.');
        });
  };

  const toggleJobPostStatus = (jobPostId, currentStatus) => {
    adminApiService.updateJobPostStatus(jobPostId, !currentStatus)
        .then(() => {
          setJobPosts(prev => prev.map(post =>
              post.jobPostId === jobPostId ? {...post, jobPostStatus: !currentStatus} : post
          ));
          handleSuccess(`공고가 ${!currentStatus ? '공개' : '비공개'}로 설정되었습니다.`);
        })
        .catch(error => {
          handleError(error, '공고 상태 변경에 실패했습니다.');
        });
  };

  const confirmDelete = (jobPost) => {
    confirmAction(
        `"${jobPost.jobPostTitle}" 공고를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
        () => handleDelete(jobPost.jobPostId),
        {
          title: '공고 삭제',
          confirmText: '삭제',
          cancelText: '취소',
          type: 'warning',
          isDestructive: true
        }
    );
  };

  const confirmStatusChange = (jobPost) => {
    const newStatus = !jobPost.jobPostStatus;
    confirmAction(
        `"${jobPost.jobPostTitle}" 공고를 ${newStatus ? '공개' : '비공개'}로 변경하시겠습니까?`,
        () => toggleJobPostStatus(jobPost.jobPostId, jobPost.jobPostStatus),
        {
          title: '공고 상태 변경',
          confirmText: '변경',
          cancelText: '취소',
          type: 'info'
        }
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const getStatusBadge = (status) => {
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {status ? '공개' : '비공개'}
      </span>
    );
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'jobPostTitle',
      label: '공고 제목',
      sortable: true,
      filterable: true
    },
    {
      key: 'companyName',
      label: '회사명',
      sortable: true,
      filterable: true
    },
    {
      key: 'jobPostJobCategory',
      label: '카테고리',
      filterable: true
    },
    {
      key: 'jobPostStatus',
      label: '상태',
      filterable: true,
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'jobPostDueDate',
      label: '마감일',
      sortable: true,
      render: (value) => formatDate(value)
    }
  ];

  // 행 액션 렌더링
  const renderRowActions = (post) => (
      <div className="flex space-x-2">
        <button
            onClick={() => navigate(`/jobs/${post.jobPostId}`)}
            className="text-indigo-600 hover:text-indigo-900"
        >
          보기
        </button>
        <button
            onClick={() => confirmStatusChange(post)}
            className={post.jobPostStatus ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
        >
          {post.jobPostStatus ? '비공개로 변경' : '공개로 변경'}
        </button>
        <button
            onClick={() => confirmDelete(post)}
            className="text-red-600 hover:text-red-900"
        >
          삭제
        </button>
      </div>
  );

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">공고 관리</h2>
        </div>

        <div className="bg-white p-4 shadow rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
              <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={searchParams.companyName}
                  onChange={(e) => setSearchParams({...searchParams, companyName: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="회사명 검색"
              />
            </div>

            <div>
              <label htmlFor="jobPostTitle" className="block text-sm font-medium text-gray-700 mb-1">공고 제목</label>
              <input
                  type="text"
                  id="jobPostTitle"
                  name="jobPostTitle"
                  value={searchParams.jobPostTitle}
                  onChange={(e) => setSearchParams({...searchParams, jobPostTitle: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="공고 제목 검색"
              />
            </div>

            <div>
              <label htmlFor="jobPostStatus" className="block text-sm font-medium text-gray-700 mb-1">공고 상태</label>
              <select
                  id="jobPostStatus"
                  name="jobPostStatus"
                  value={searchParams.jobPostStatus}
                  onChange={(e) => setSearchParams({...searchParams, jobPostStatus: e.target.value})}
                  className="w-full p-2 border rounded"
              >
                <option value="">전체</option>
                <option value="true">공개</option>
                <option value="false">비공개</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
                onClick={fetchJobPosts}
                className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              검색
            </button>
          </div>
        </div>

        <AdminDataTable
            title="공고 목록"
            data={jobPosts}
            columns={columns}
            isLoading={loading}
            totalItems={totalItems}
            onSearch={handleSearch}
            onSort={handleSort}
            onFilter={handleFilter}
            onPageChange={handlePageChange}
            onView={(post) => navigate(`/jobs/${post.jobPostId}`)}
            onDelete={handleDelete}
            renderRowActions={renderRowActions}
            selectable={true}
            searchable={true}
            exportable={true}
            pagination={true}
        />
      </div>
  );
};

export default AdminJobPostsManage;