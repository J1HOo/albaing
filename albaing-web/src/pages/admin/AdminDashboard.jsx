import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components';
import AdminDashboardCharts from './AdminDashboardCharts';
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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = () => {
        setLoading(true);

        axios.get('/api/admin/stats')
            .then(response => {
                setStats(response.data);
                return axios.get('/api/admin/users', {
                    params: { sortOrderBy: '가입일', isDESC: true, limit: 5 }
                });
            })
            .then(userResponse => {
                setRecentUsers(userResponse.data);
                return axios.get('/api/admin/companies', {
                    params: { sortOrderBy: '가입일', isDESC: true, limit: 5 }
                });
            })
            .then(companyResponse => {
                setRecentCompanies(companyResponse.data);
            })
            .catch(error => {
                console.error('대시보드 데이터 로딩 실패:', error);
            })
            .finally(() => {
                setLoading(false);
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

    if (loading) return <LoadingSpinner message="대시보드 정보를 불러오는 중..." />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">관리자 대시보드</h2>

            {/* 차트 컴포넌트 */}
            <AdminDashboardCharts
                stats={stats}
                onNavigate={(path) => navigate(path)}
            />

            {/* 최근 데이터 테이블 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-700">최근 등록 회원</h3>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            전체 보기
                        </button>
                    </div>

                    <AdminDataTable
                        data={recentUsers}
                        columns={[
                            { key: 'userName', label: '이름' },
                            { key: 'userEmail', label: '이메일' },
                            { key: 'userCreatedAt', label: '가입일', render: (value) => formatDate(value) }
                        ]}
                        title=""
                        searchable={false}
                        exportable={false}
                        pagination={false}
                        onRowClick={(user) => navigate(`/admin/users/${user.userId}`)}
                    />
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-700">최근 등록 기업</h3>
                        <button
                            onClick={() => navigate('/admin/companies')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            전체 보기
                        </button>
                    </div>

                    <AdminDataTable
                        data={recentCompanies}
                        columns={[
                            { key: 'companyName', label: '기업명' },
                            { key: 'companyOwnerName', label: '대표자' },
                            { key: 'companyApprovalStatus', label: '상태', render: (value) => getStatusBadge(value) }
                        ]}
                        title=""
                        searchable={false}
                        exportable={false}
                        pagination={false}
                        onRowClick={(company) => navigate(`/admin/companies/${company.companyId}`)}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;