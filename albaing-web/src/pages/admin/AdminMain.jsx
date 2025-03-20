import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminMain = () => {
    const { userData, logout } = useAuth();
    const navigate = useNavigate();

    if (!userData || !userData.userIsAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">접근 권한 없음</h1>
                    <p className="mb-6">이 페이지는 관리자만 접근할 수 있습니다.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">알바잉 관리자</h1>
                    <div className="flex items-center space-x-4">
                        <span>{userData.userName} 관리자</span>
                        <button
                            onClick={() => {
                                logout().then(() => navigate('/'));
                            }}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto py-6 px-4 flex">
                {/* 사이드바 */}
                <aside className="w-64 bg-white rounded-lg shadow mr-6">
                    <nav className="p-4">
                        <ul className="space-y-2">
                            <li>
                                <NavLink to="/admin" end
                                         className={({isActive}) =>
                                             `block p-2 rounded ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`
                                         }
                                >
                                    대시보드
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/users"
                                         className={({isActive}) =>
                                             `block p-2 rounded ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`
                                         }
                                >
                                    회원 관리
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/companies"
                                         className={({isActive}) =>
                                             `block p-2 rounded ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`
                                         }
                                >
                                    기업 관리
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/companies/approval"
                                         className={({isActive}) =>
                                             `block p-2 rounded ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`
                                         }
                                >
                                    기업 승인
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/job-posts"
                                         className={({isActive}) =>
                                             `block p-2 rounded ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`
                                         }
                                >
                                    공고 관리
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/applications"
                                         className={({isActive}) =>
                                             `block p-2 rounded ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`
                                         }
                                >
                                    지원내역 관리
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/reviews"
                                         className={({isActive}) =>
                                             `block p-2 rounded ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`
                                         }
                                >
                                    리뷰 관리
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/notices"
                                         className={({isActive}) =>
                                             `block p-2 rounded ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`
                                         }
                                >
                                    공지사항 관리
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* 메인 콘텐츠 */}
                <main className="flex-1 bg-white rounded-lg shadow p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminMain;