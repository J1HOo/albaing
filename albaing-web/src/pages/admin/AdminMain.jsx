import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { LoadingSpinner } from '../../components';
import AdminLayout from './AdminLayout';
import DashboardCharts from './DashboardCharts';

const StatCard = ({ title, value, icon, color, link }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <h2 className="text-3xl font-bold mt-2">{value}</h2>
                </div>
                <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')} text-${color.replace('border-', '')}`}>
                    {icon}
                </div>
            </div>
            {link && (
                <div className="mt-4">
                    <Link to={link} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                        자세히 보기
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );
};

const AdminMain = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCompanies: 0,
        pendingCompanies: 0,
        activeJobPosts: 0,
        totalReviews: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentJobPosts, setRecentJobPosts] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios
            .all([
                axios.get('/api/admin/dashboard/stats'),
                axios.get('/api/admin/recent/users'),
                axios.get('/api/admin/recent/jobposts')
            ])
            .then(
                axios.spread((statsRes, usersRes, jobPostsRes) => {
                    setStats(statsRes.data);
                    setRecentUsers(usersRes.data);
                    setRecentJobPosts(jobPostsRes.data);
                })
            )
            .catch(error => {
                console.error('대시보드 데이터 로딩 실패:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    const downloadCSV = (url, filename) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(e => {
                console.error('CSV 다운로드 실패:', e);
                alert('CSV 파일 다운로드에 실패했습니다.');
            });
    };

    const handleDownloadUsers = () => {
        downloadCSV('/api/admin/users/csv', `알바잉_회원목록_${format(new Date(), 'yyyyMMdd')}.csv`);
    };

    const handleDownloadJobPosts = () => {
        downloadCSV('/api/admin/job-posts/csv', `알바잉_채용공고목록_${format(new Date(), 'yyyyMMdd')}.csv`);
    };

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner message="관리자 정보를 불러오는 중..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">관리자 대시보드</h1>
                <p className="text-gray-600 mt-1">알바잉 서비스 현황을 확인하세요.</p>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="총 회원 수"
                    value={stats.totalUsers}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
                    color="border-blue-500"
                    link="/admin/users"
                />
                <StatCard
                    title="등록 기업 수"
                    value={stats.totalCompanies}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
                    color="border-purple-500"
                    link="/admin/companies"
                />
                <StatCard
                    title="승인 대기 기업"
                    value={stats.pendingCompanies}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    color="border-yellow-500"
                    link="/admin/companies?filter=pending"
                />
                <StatCard
                    title="진행 중인 채용공고"
                    value={stats.activeJobPosts}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
                    color="border-green-500"
                    link="/admin/jobposts"
                />
                <StatCard
                    title="작성된 리뷰"
                    value={stats.totalReviews}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>}
                    color="border-orange-500"
                    link="/admin/reviews"
                />
            </div>

            {/* CSV 다운로드 버튼 */}
            <div className="mb-8 flex flex-wrap gap-4">
                <button
                    onClick={handleDownloadUsers}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    회원 목록 CSV 다운로드
                </button>
                <button
                    onClick={handleDownloadJobPosts}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    채용공고 CSV 다운로드
                </button>
            </div>

            {/* 최근 데이터 표시 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 최근 가입한 회원 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">최근 가입한 회원</h2>
                        <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            모든 회원 보기
                        </Link>
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
                                recentUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.userName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.userEmail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {format(new Date(user.userCreatedAt), 'yyyy-MM-dd')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                        최근 가입한 회원이 없습니다.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 최근 등록된 공고 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">최근 등록된 공고</h2>
                        <Link to="/admin/jobposts" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            모든 공고 보기
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공고명</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기업</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마감일</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {recentJobPosts.length > 0 ? (
                                recentJobPosts.map((post, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{post.jobPostTitle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{post.companyName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {format(new Date(post.jobPostDueDate), 'yyyy-MM-dd')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                        최근 등록된 공고가 없습니다.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 통계 차트 */}
            <DashboardCharts />
        </AdminLayout>
    );
};

export default AdminMain;