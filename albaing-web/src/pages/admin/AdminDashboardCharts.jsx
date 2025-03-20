import React, { useState, useCallback } from 'react';
import {
    BarChart, Bar,
    XAxis, YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart, Pie,
    Cell,
    AreaChart,
    Area,
    RadialBarChart,
    RadialBar,
    Sector
} from 'recharts';
import { Users, Briefcase, FileText, AlertCircle, TrendingUp, Activity } from 'lucide-react';

const ImprovedAdminDashboard = ({ stats, onNavigate }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    // 통계 카드 데이터
    const statCards = [
        {
            title: '전체 회원',
            value: stats.userCount,
            icon: <Users className="stroke-white" size={24} />,
            color: 'from-indigo-500 to-indigo-700',
            path: '/admin/users'
        },
        {
            title: '전체 기업',
            value: stats.companyCount,
            icon: <Briefcase className="stroke-white" size={24} />,
            color: 'from-emerald-500 to-emerald-700',
            path: '/admin/companies'
        },
        {
            title: '전체 공고',
            value: stats.jobPostCount,
            icon: <FileText className="stroke-white" size={24} />,
            color: 'from-amber-500 to-amber-700',
            path: '/admin/job-posts'
        },
        {
            title: '승인 대기 기업',
            value: stats.pendingCompanyCount,
            icon: <AlertCircle className="stroke-white" size={24} />,
            color: 'from-orange-500 to-orange-700',
            path: '/admin/companies/approval'
        }
    ];

    // 차트 데이터
    const chartData = [
        { name: '회원', value: stats.userCount, color: '#4F46E5' },
        { name: '기업', value: stats.companyCount, color: '#10B981' },
        { name: '공고', value: stats.jobPostCount, color: '#F59E0B' },
        { name: '지원', value: stats.applicationCount || 0, color: '#8B5CF6' },
        { name: '리뷰', value: stats.reviewCount || 0, color: '#EC4899' }
    ];

    const statusData = [
        { name: '승인 완료', value: stats.companyCount - stats.pendingCompanyCount, color: '#10B981' },
        { name: '승인 대기', value: stats.pendingCompanyCount, color: '#F59E0B' }
    ];

    // 최근 6개월 트렌드 데이터 (실제로는 API에서 받아와야 함)
    const trendData = [
        { name: '1월', users: 240, companies: 120, applications: 180 },
        { name: '2월', users: 300, companies: 140, applications: 220 },
        { name: '3월', users: 320, companies: 160, applications: 250 },
        { name: '4월', users: 380, companies: 180, applications: 280 },
        { name: '5월', users: 400, companies: 200, applications: 320 },
        { name: '6월', users: 450, companies: 220, applications: 350 },
    ];

    // 활동 비율 데이터
    const activityData = [
        { name: '공고 등록률', value: 76, fill: '#4F46E5' },
        { name: '지원 완료율', value: 85, fill: '#10B981' },
        { name: '리뷰 작성률', value: 65, fill: '#F59E0B' },
        { name: '기업 승인률', value: 90, fill: '#8B5CF6' }
    ];

    // 파이 차트 활성 섹터 처리
    const renderActiveShape = useCallback((props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={16} fontWeight="bold">
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 10}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    style={{ filter: 'drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.2))' }}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}개`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    }, []);

    // 파이 차트 섹터 선택 이벤트
    const onPieEnter = useCallback((_, index) => {
        setActiveIndex(index);
    }, []);

    // 차트 새로고침
    const refreshCharts = () => {
        setRefreshKey(prev => prev + 1);
    };

    // 커스텀 툴팁
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
                    <p className="font-medium text-gray-900">{`${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color || entry.fill || entry.stroke }}>
                            {`${entry.name || entry.dataKey}: ${entry.value}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6" key={refreshKey}>
            {/* 통계 카드 - 그라디언트 효과와 호버 애니메이션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        className="rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
                    >
                        <button
                            onClick={() => onNavigate(card.path)}
                            className={`block w-full p-5 bg-gradient-to-r ${card.color} text-white`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium opacity-90">{card.title}</p>
                                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                                </div>
                                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                    {card.icon}
                                </div>
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 플랫폼 데이터 현황 차트 */}
                <div className="bg-white rounded-lg shadow-lg p-5 transform transition-all duration-500 hover:shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <Activity size={20} className="mr-2 text-indigo-600" />
                            플랫폼 데이터 현황
                        </h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                                barSize={40}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#6B7280' }}
                                    axisLine={{ stroke: '#E5E7EB' }}
                                />
                                <YAxis
                                    tick={{ fill: '#6B7280' }}
                                    axisLine={{ stroke: '#E5E7EB' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: 15 }}
                                />
                                <Bar
                                    dataKey="value"
                                    name="개수"
                                    animationDuration={1500}
                                    animationEasing="ease-in-out"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            style={{ filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))' }}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 기업 승인 현황 차트 */}
                <div className="bg-white rounded-lg shadow-lg p-5 transform transition-all duration-500 hover:shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <Briefcase size={20} className="mr-2 text-emerald-600" />
                            기업 승인 현황
                        </h3>
                    </div>
                    <div className="h-80 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    onMouseEnter={onPieEnter}
                                    animationDuration={1500}
                                    animationEasing="ease-in-out"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            style={{ filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.15))' }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 추가 차트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 월별 등록 추이 차트 */}
                <div className="bg-white rounded-lg shadow-lg p-5 transform transition-all duration-500 hover:shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <TrendingUp size={20} className="mr-2 text-blue-600" />
                            월별 등록 추이
                        </h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={trendData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                                <YAxis tick={{ fill: '#6B7280' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    name="회원"
                                    stackId="1"
                                    stroke="#4F46E5"
                                    fill="#4F46E5"
                                    fillOpacity={0.6}
                                    activeDot={{ r: 5 }}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="companies"
                                    name="기업"
                                    stackId="2"
                                    stroke="#10B981"
                                    fill="#10B981"
                                    fillOpacity={0.6}
                                    activeDot={{ r: 5 }}
                                    animationDuration={1800}
                                    animationEasing="ease-out"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="applications"
                                    name="지원"
                                    stackId="3"
                                    stroke="#F59E0B"
                                    fill="#F59E0B"
                                    fillOpacity={0.6}
                                    activeDot={{ r: 5 }}
                                    animationDuration={2100}
                                    animationEasing="ease-out"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 활동 비율 차트 */}
                <div className="bg-white rounded-lg shadow-lg p-5 transform transition-all duration-500 hover:shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <Activity size={20} className="mr-2 text-purple-600" />
                            활동 비율
                        </h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="20%"
                                outerRadius="90%"
                                barSize={20}
                                data={activityData}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <RadialBar
                                    background
                                    clockWise
                                    dataKey="value"
                                    cornerRadius={10}
                                    label={{
                                        position: 'insideStart',
                                        fill: '#fff',
                                        fontWeight: 'bold'
                                    }}
                                    animationDuration={1500}
                                    animationEasing="ease-in-out"
                                />
                                <Legend
                                    iconSize={10}
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    wrapperStyle={{ paddingLeft: 20 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 승인 대기 알림 */}
            {stats.pendingCompanyCount > 0 && (
                <div className="mt-6">
                    <button
                        onClick={() => onNavigate('/admin/companies/approval')}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse"
                    >
                        <AlertCircle className="mr-2" size={18} />
                        승인 대기 기업 처리하기 ({stats.pendingCompanyCount})
                    </button>
                </div>
            )}

            {/* 차트 새로고침 버튼 */}
            <div className="mt-6 text-center">
                <button
                    onClick={refreshCharts}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                    차트 새로고침
                </button>
            </div>
        </div>
    );
};

export default ImprovedAdminDashboard;