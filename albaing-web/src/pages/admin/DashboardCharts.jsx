import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardCharts = () => {
    const [loading, setLoading] = useState(true);
    const [jobCategoryStats, setJobCategoryStats] = useState([]);
    const [jobTypeStats, setJobTypeStats] = useState([]);
    const [userRegionStats, setUserRegionStats] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);

        // 직종별 통계
        fetch('/api/admin/stats/job-categories')
            .then(response => response.json())
            .then(data => {
                setJobCategoryStats(data);
            })
            .catch(error => {
                console.error('직종별 통계 로딩 실패:', error);
                setError('데이터를 불러오는데 실패했습니다.');
            });

        // 고용형태별 통계
        fetch('/api/admin/stats/job-types')
            .then(response => response.json())
            .then(data => {
                setJobTypeStats(data);
            })
            .catch(error => {
                console.error('고용형태별 통계 로딩 실패:', error);
            });

        // 지역별 통계
        fetch('/api/admin/stats/user-regions')
            .then(response => response.json())
            .then(data => {
                setUserRegionStats(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('지역별 통계 로딩 실패:', error);
                setLoading(false);
            });
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">직종별 채용공고 현황</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={jobCategoryStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="공고 수" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">고용형태별 채용공고 현황</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={jobTypeStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {jobTypeStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value}개`, '공고 수']} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">지역별 회원 현황</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={userRegionStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="회원 수" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardCharts;