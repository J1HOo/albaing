import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        userCount: 0,
        companyCount: 0,
        jobPostCount: 0,
        applicationCount: 0,
        reviewCount: 0,
        pendingCompanyCount: 0
    });

    const [recentUsers, setRecentUsers] = useState([]);
    const [recentCompanies, setRecentCompanies] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = () => {
        setLoading(true);

        axios.get('/api/admin/stats')
            .then(response => {
                setStats({
                    userCount: response.data.userCount || 0,
                    companyCount: response.data.companyCount || 0,
                    jobPostCount: response.data.jobPostCount || 0,
                    pendingCompanyCount: response.data.pendingCompanyCount || 0
                });
            })
            .catch(error => {
                console.error('통계 데이터 로딩 실패:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    if (loading) return <LoadingSpinner message="대시보드 정보를 불러오는 중..." />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">관리자 대시보드</h2>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">회원 통계</h3>
                    <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold">{stats.userCount}</div>
                        <Link to="/admin/users" className="text-sm text-blue-600 hover:text-blue-800">회원 관리</Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">기업 통계</h3>
                    <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold">{stats.companyCount}</div>
                        <Link to="/admin/companies" className="text-sm text-blue-600 hover:text-blue-800">기업 관리</Link>
                    </div>
                    {stats.pendingCompanyCount > 0 && (
                        <div className="mt-2 text-sm">
              <span className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full">
                승인 대기 {stats.pendingCompanyCount}개
              </span>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">공고 통계</h3>
                    <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold">{stats.jobPostCount}</div>
                        <Link to="/admin/job-posts" className="text-sm text-blue-600 hover:text-blue-800">공고 관리</Link>
                    </div>
                </div>
            </div>

            {/* 최근 등록 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 최근 등록 회원 */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-700">최근 등록 회원</h3>
                        <Link to="/admin/users" className="text-sm text-blue-600 hover:text-blue-800">전체 보기</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {recentUsers.length > 0 ? (
                                recentUsers.map((user) => (
                                    <tr key={user.userId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <Link to={`/admin/users/${user.userId}`} className="hover:text-blue-600">
                                                {user.userName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.userEmail}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(user.userCreatedAt)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                        등록된 회원이 없습니다.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 최근 등록 기업 */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-700">최근 등록 기업</h3>
                        <Link to="/admin/companies" className="text-sm text-blue-600 hover:text-blue-800">전체 보기</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기업명</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대표자</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {recentCompanies.length > 0 ? (
                                recentCompanies.map((company) => (
                                    <tr key={company.companyId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <Link to={`/admin/companies/${company.companyId}`} className="hover:text-blue-600">
                                                {company.companyName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {company.companyOwnerName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            company.companyApprovalStatus === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : company.companyApprovalStatus === 'approving'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                        }`}>
                          {company.companyApprovalStatus === 'approved'
                              ? '승인됨'
                              : company.companyApprovalStatus === 'approving'
                                  ? '승인대기'
                                  : '비공개'}
                        </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                        등록된 기업이 없습니다.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;