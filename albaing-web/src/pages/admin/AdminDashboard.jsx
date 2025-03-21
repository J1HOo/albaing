import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components';
import { useErrorHandler } from '../../components/ErrorHandler';
import adminApiService from '../../service/apiAdminService';
import {
    Users, Briefcase, FileText, CheckCircle,
    AlertCircle, RefreshCw, TrendingUp, BarChart2
} from 'lucide-react';
import AdminDataTable from './AdminDataTable';

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
    const [loading, setLoading] = useState({
        stats: true,
        users: true,
        companies: true
    });
    const [refreshing, setRefreshing] = useState(false);

    const navigate = useNavigate();
    const { handleError } = useErrorHandler();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = () => {
        setLoading({stats: true, users: true, companies: true});
        setRefreshing(true);

        // 통계 데이터 가져오기
        adminApiService.getDashboardStats()
            .then(response => {
                setStats(response);
                setLoading(prev => ({...prev, stats: false}));
            })
            .catch(error => {
                handleError(error, '대시보드 통계 데이터 로딩 실패');
                setLoading(prev => ({...prev, stats: false}));
            });

        // 최근 사용자 목록 가져오기
        adminApiService.getUsers({sortOrderBy: '가입일', isDESC: true, limit: 5})
            .then(response => {
                setRecentUsers(response.users || response);
                setLoading(prev => ({...prev, users: false}));
            })
            .catch(error => {
                handleError(error, '최근 사용자 목록 로딩 실패');
                setLoading(prev => ({...prev, users: false}));
            });

        // 최근 기업 목록 가져오기
        adminApiService.getCompanies({sortOrderBy: '가입일', isDESC: true, limit: 5})
            .then(response => {
                setRecentCompanies(response.companies || response);
                setLoading(prev => ({...prev, companies: false}));
            })
            .catch(error => {
                handleError(error, '최근 기업 목록 로딩 실패');
                setLoading(prev => ({...prev, companies: false}));
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'approved': { text: '승인됨', className: 'bg-green-100 text-green-800' },
            'approving': { text: '승인대기', className: 'bg-yellow-100 text-yellow-800' },
            'hidden': { text: '비공개', className: 'bg-red-100 text-red-800' }
        };
        const statusInfo = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
                {statusInfo.text}
            </span>
        );
    };

    // 사용자 테이블 컬럼
    const userColumns = [
        { key: 'userName', label: '이름' },
        { key: 'userEmail', label: '이메일' },
        { key: 'userCreatedAt', label: '가입일', render: value => formatDate(value) }
    ];

    // 기업 테이블 컬럼
    const companyColumns = [
        { key: 'companyName', label: '기업명' },
        { key: 'companyOwnerName', label: '대표자' },
        { key: 'companyApprovalStatus', label: '상태', render: value => getStatusBadge(value) }
    ];

    // 통계 카드 데이터
    const statCards = [
        {
            title: '전체 회원',
            value: stats.userCount,
            icon: <Users className="h-8 w-8 text-white" />,
            color: 'from-indigo-500 to-indigo-700',
            path: '/admin/users'
        },
        {
            title: '전체 기업',
            value: stats.companyCount,
            icon: <Briefcase className="h-8 w-8 text-white" />,
            color: 'from-emerald-500 to-emerald-700',
            path: '/admin/companies'
        },
        {
            title: '전체 공고',
            value: stats.jobPostCount,
            icon: <FileText className="h-8 w-8 text-white" />,
            color: 'from-amber-500 to-amber-700',
            path: '/admin/job-posts'
        },
        {
            title: '승인 대기 기업',
            value: stats.pendingCompanyCount,
            icon: <AlertCircle className="h-8 w-8 text-white" />,
            color: 'from-orange-500 to-orange-700',
            path: '/admin/companies/approval'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">관리자 대시보드</h2>
                <button
                    onClick={fetchDashboardData}
                    disabled={refreshing}
                    className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    새로고침
                </button>
            </div>

            {/* 통계 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div
                            className={`p-4 bg-gradient-to-r ${card.color} cursor-pointer`}
                            onClick={() => navigate(card.path)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-white opacity-90">{card.title}</p>
                                    <p className="text-3xl font-bold mt-1 text-white">
                                        {loading.stats ? (
                                            <span className="inline-block animate-pulse w-16 h-8 bg-white bg-opacity-20 rounded" />
                                        ) : (
                                            card.value
                                        )}
                                    </p>
                                </div>
                                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-gray-50 text-right">
                            <button
                                onClick={() => navigate(card.path)}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                자세히 보기 &rarr;
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 차트 및 그래프 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
                            서비스 이용 현황
                        </h3>
                    </div>
                    <div className="h-60">
                        {loading.stats ? (
                            <div className="h-full flex items-center justify-center">
                                <LoadingSpinner message="" size="sm" fullScreen={false} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4 h-full">
                                <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg p-4">
                                    <div className="text-indigo-500 text-4xl font-bold mb-2">{stats.applicationCount}</div>
                                    <div className="text-gray-500 text-center">지원건수</div>
                                </div>
                                <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg p-4">
                                    <div className="text-green-500 text-4xl font-bold mb-2">{stats.reviewCount}</div>
                                    <div className="text-gray-500 text-center">리뷰수</div>
                                </div>
                                <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg p-4">
                                    <div className="text-amber-500 text-4xl font-bold mb-2">
                                        {Math.round((stats.applicationCount / stats.jobPostCount) * 100) || 0}%
                                    </div>
                                    <div className="text-gray-500 text-center">지원율</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                            승인 현황
                        </h3>
                    </div>
                    <div className="h-60">
                        {loading.stats ? (
                            <div className="h-full flex items-center justify-center">
                                <LoadingSpinner message="" size="sm" fullScreen={false} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 h-full">
                                <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-end mb-4">
                                        <div className="text-green-500 text-5xl font-bold">
                                            {stats.companyCount - stats.pendingCompanyCount}
                                        </div>
                                        <div className="text-gray-400 ml-2 mb-1">/ {stats.companyCount}</div>
                                    </div>
                                    <div className="text-gray-500 text-center">승인된 기업</div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                                        <div className="bg-green-500 h-2.5 rounded-full" style={{
                                            width: `${Math.round(((stats.companyCount - stats.pendingCompanyCount) / stats.companyCount) * 100) || 0}%`
                                        }}></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {Math.round(((stats.companyCount - stats.pendingCompanyCount) / stats.companyCount) * 100) || 0}% 완료
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg p-4">
                                    <div className="text-amber-500 text-5xl font-bold mb-4">
                                        {stats.pendingCompanyCount}
                                    </div>
                                    <div className="text-gray-500 text-center">대기 중인 기업</div>
                                    {stats.pendingCompanyCount > 0 && (
                                        <button
                                            onClick={() => navigate('/admin/companies/approval')}
                                            className="mt-4 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                                        >
                                            승인 관리하기
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 최근 데이터 테이블 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800">최근 등록 회원</h3>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            전체 보기
                        </button>
                    </div>

                    <AdminDataTable
                        data={recentUsers}
                        columns={userColumns}
                        isLoading={loading.users}
                        searchable={false}
                        exportable={false}
                        pagination={false}
                        onRowClick={(user) => navigate(`/admin/users/${user.userId}`)}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800">최근 등록 기업</h3>
                        <button
                            onClick={() => navigate('/admin/companies')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            전체 보기
                        </button>
                    </div>

                    <AdminDataTable
                        data={recentCompanies}
                        columns={companyColumns}
                        isLoading={loading.companies}
                        searchable={false}
                        exportable={false}
                        pagination={false}
                        onRowClick={(company) => navigate(`/admin/companies/${company.companyId}`)}
                    />
                </div>
            </div>

            {/* 승인 대기 알림 */}
            {stats.pendingCompanyCount > 0 && (
                <div className="mt-6">
                    <button
                        onClick={() => navigate('/admin/companies/approval')}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse"
                    >
                        <AlertCircle className="mr-2" size={18} />
                        승인 대기 기업 처리하기 ({stats.pendingCompanyCount})
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;