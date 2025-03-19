import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, FileText, AlertCircle } from 'lucide-react';

const AdminDashboardCharts = ({ stats, onNavigate }) => {
    const chartData = [
        { name: '회원', value: stats.userCount, color: '#3b82f6' },
        { name: '기업', value: stats.companyCount, color: '#10b981' },
        { name: '공고', value: stats.jobPostCount, color: '#f97316' },
        { name: '지원', value: stats.applicationCount || 0, color: '#8b5cf6' },
        { name: '리뷰', value: stats.reviewCount || 0, color: '#ec4899' }
    ];

    const statusData = [
        { name: '승인 완료', value: stats.companyCount - stats.pendingCompanyCount, color: '#22c55e' },
        { name: '승인 대기', value: stats.pendingCompanyCount, color: '#f59e0b' }
    ];

    const statCards = [
        { title: '전체 회원', value: stats.userCount, icon: <Users size={24} />, color: 'bg-blue-500', path: '/admin/users' },
        { title: '전체 기업', value: stats.companyCount, icon: <Briefcase size={24} />, color: 'bg-green-500', path: '/admin/companies' },
        { title: '전체 공고', value: stats.jobPostCount, icon: <FileText size={24} />, color: 'bg-orange-500', path: '/admin/job-posts' },
        { title: '승인 대기 기업', value: stats.pendingCompanyCount, icon: <AlertCircle size={24} />, color: 'bg-yellow-500', path: '/admin/companies' }
    ];

    return (
        <div className="space-y-6">
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, index) => (
                    <div key={index} className={`${card.color} rounded-lg shadow-lg overflow-hidden`}>
                        <button
                            onClick={() => onNavigate(card.path)}
                            className="block w-full p-4 text-white hover:opacity-90 transition-opacity text-left"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium opacity-75">{card.title}</p>
                                    <p className="text-3xl font-bold">{card.value}</p>
                                </div>
                                <div className="p-3 bg-white bg-opacity-30 rounded-lg">
                                    {card.icon}
                                </div>
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 데이터 분포 차트 */}
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">플랫폼 데이터 현황</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [`${value}개`, '수량']}
                                    contentStyle={{ borderRadius: '6px' }}
                                />
                                <Legend />
                                <Bar dataKey="value" name="개수">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 기업 승인 현황 */}
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">기업 승인 현황</h3>
                    <div className="h-80 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value}개`, '기업 수']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {stats.pendingCompanyCount > 0 && (
                <div className="mt-6">
                    <button
                        onClick={() => onNavigate('/admin/companies')}
                        className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 animate-pulse"
                    >
                        <AlertCircle className="mr-2" size={18} />
                        승인 대기 기업 처리하기 ({stats.pendingCompanyCount})
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardCharts;