import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import {
    HomeIcon,
    BriefcaseIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = ({ companyData, activeTab, setActiveTab, children }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const tabs = [
        { id: 'dashboard', name: '대시보드', icon: HomeIcon },
        { id: 'jobPosts', name: '채용공고 관리', icon: BriefcaseIcon },
        { id: 'applications', name: '지원자 관리', icon: UsersIcon },
        { id: 'reviews', name: '리뷰 관리', icon: ChatBubbleLeftRightIcon },
        { id: 'profile', name: '회사 정보', icon: UserCircleIcon },
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMainPage = () => {
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 데스크탑 사이드바 */}
            <div className="w-64 bg-white shadow-md hidden md:flex flex-col h-screen">
                <div>
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800 truncate">
                            {companyData?.companyName || '회사 대시보드'}
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">Company Dashboard</p>
                    </div>

                    <nav className="mt-6">
                        <ul>
                            {tabs.map((tab) => (
                                <li
                                    key={tab.id}
                                    className={`
                                        px-6 py-4 cursor-pointer flex items-center
                                        hover:bg-blue-50 transition-colors
                                        ${activeTab === tab.id
                                        ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-600 font-medium'
                                        : 'text-gray-700'
                                    }
                                    `}
                                    onClick={() => handleTabChange(tab.id)}
                                >
                                    <tab.icon className="h-5 w-5 mr-3" />
                                    <span>{tab.name}</span>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="mt-auto p-6 space-y-4">
                    <button
                        onClick={handleMainPage}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                    >
                        메인페이지로 이동
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                    >
                        로그아웃
                    </button>
                </div>
            </div>

            {/* 모바일 탭 네비게이션 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden z-10">
                <nav className="flex justify-around">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`
                                py-3 px-2 flex flex-col items-center justify-center flex-1
                                ${activeTab === tab.id
                                ? 'text-blue-600'
                                : 'text-gray-500'
                            }
                            `}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            <tab.icon className="h-6 w-6" />
                            <span className="text-xs mt-1">{tab.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto p-8 pb-24 md:pb-8">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
