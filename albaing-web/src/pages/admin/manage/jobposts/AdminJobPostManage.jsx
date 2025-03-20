import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {ConfirmModal, LoadingSpinner, useModal} from '../../../../components';

const AdminJobPostsManage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    companyName: '',
    jobPostTitle: '',
    jobPostStatus: '',
    sortOrderBy: '공고 제목',
    isDESC: false
  });

  const confirmModal = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobPosts();
  }, [searchParams.sortOrderBy, searchParams.isDESC]);

  const fetchJobPosts = () => {
    setLoading(true);

    const params = {
      ...searchParams,
      companyName: searchParams.companyName || undefined,
      jobPostTitle: searchParams.jobPostTitle || undefined,
      jobPostStatus: searchParams.jobPostStatus || undefined
    };

    axios.get('/api/admin/job-posts', {
      params: {
        companyName: searchParams.companyName || undefined,
        jobPostTitle: searchParams.jobPostTitle || undefined,
        jobPostStatus: searchParams.jobPostStatus || undefined
      }
    })
      .then(response => {
        setJobPosts(response.data);
      })
      .catch(error => {
        console.error('공고 목록 로딩 실패:', error);
        confirmModal.openModal({
          title: '오류',
          message: '공고 목록을 불러오는데 실패했습니다.',
          type: 'error'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobPosts();
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

  const handleDelete = (jobPostId) => {
    axios.delete(`/api/admin/job-posts/${jobPostId}`)
        .then(() => {
          setJobPosts(prev => prev.filter(post => post.jobPostId !== jobPostId));
          confirmModal.openModal({
            title: '성공',
            message: '공고가 삭제되었습니다.',
            type: 'success'
          });
        })
        .catch(error => {
          console.error('공고 삭제 실패:', error);
          confirmModal.openModal({
            title: '오류',
            message: '공고 삭제에 실패했습니다.',
            type: 'error'
          });
        });
  };

  const toggleJobPostStatus = (jobPostId, currentStatus) => {
      axios.patch(`/api/admin/job-posts/${jobPostId}/status`, { status: !currentStatus })
        .then(() => {
          setJobPosts(prev => prev.map(post =>
              post.jobPostId === jobPostId ? {...post, jobPostStatus: !currentStatus} : post
          ));
          confirmModal.openModal({
            title: '성공',
            message: `공고가 ${!currentStatus ? '공개' : '비공개'}로 설정되었습니다.`,
            type: 'success'
          });
        })
        .catch(error => {
          console.error('공고 상태 변경 실패:', error);
          confirmModal.openModal({
            title: '오류',
            message: '공고 상태 변경에 실패했습니다.',
            type: 'error'
          });
        });
  };

  const confirmDelete = (jobPost) => {
    confirmModal.openModal({
      title: '공고 삭제',
      message: `"${jobPost.jobPostTitle}" 공고를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      confirmText: '삭제',
      cancelText: '취소',
      type: 'warning',
      onConfirm: () => handleDelete(jobPost.jobPostId)
    });
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

  if (loading) return <LoadingSpinner message="공고 목록을 불러오는 중..." />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">공고 관리</h2>

      <div className="mb-6 bg-white p-4 shadow rounded-lg">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={searchParams.companyName}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">전체</option>
              <option value="true">공개</option>
              <option value="false">비공개</option>
            </select>
          </div>

          <div className="md:col-span-3">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('공고 제목')}>
                <div className="flex items-center">
                  공고 제목
                  {searchParams.sortOrderBy === '공고 제목' && (
                    <span className="ml-1">{searchParams.isDESC ? '▼' : '▲'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('법인명')}>
                <div className="flex items-center">
                  회사명
                  {searchParams.sortOrderBy === '법인명' && (
                    <span className="ml-1">{searchParams.isDESC ? '▼' : '▲'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('공고 마감일')}>
                <div className="flex items-center">
                  마감일
                  {searchParams.sortOrderBy === '공고 마감일' && (
                    <span className="ml-1">{searchParams.isDESC ? '▼' : '▲'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobPosts.length > 0 ? (
              jobPosts.map((post) => (
                <tr key={post.jobPostId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {post.jobPostTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.jobPostJobCategory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusBadge(post.jobPostStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(post.jobPostDueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/jobs/${post.jobPostId}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        보기
                      </button>
                      <button
                        onClick={() => toggleJobPostStatus(post.jobPostId, post.jobPostStatus)}
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

export default AdminJobPostsManage;