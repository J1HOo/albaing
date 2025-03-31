import { useNavigate, useLocation } from "react-router-dom";

const AdminSideBar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 현재 위치 가져오기

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2
                onClick={() => navigate('/admin')}
                className="text-3xl font-semibold text-center text-gray-800 mb-6 cursor-pointer hover:text-gray-600 transition"
            >
                관리자 페이지
            </h2>

            <div className="space-y-4">
                <p
                    onClick={() => navigate('/admin/users')}
                    className={`px-4 py-3 text-gray-700 rounded-md shadow-md cursor-pointer hover:bg-gray-50 transition text-center border border-gray-300 ${
                        location.pathname === '/admin/users' ? 'bg-gray-100 font-bold text-lg text-gray-900' : ''
                    }`} // 유저 목록
                >
                    유저 목록
                </p>
                <p
                    onClick={() => navigate('/admin/resumes')}
                    className={`px-4 py-3 text-gray-700 rounded-md shadow-md cursor-pointer hover:bg-gray-50 transition text-center border border-gray-300 ${
                        location.pathname === '/admin/resumes' ? 'bg-gray-100 font-bold text-lg text-gray-900' : ''
                    }`} // 이력서 목록
                >
                    이력서 목록
                </p>
                <p
                    onClick={() => navigate('/admin/applications')}
                    className={`px-4 py-3 text-gray-700 rounded-md shadow-md cursor-pointer hover:bg-gray-50 transition text-center border border-gray-300 ${
                        location.pathname === '/admin/applications' ? 'bg-gray-100 font-bold text-lg text-gray-900' : ''
                    }`} // 신청 목록
                >
                    신청 목록
                </p>
                <p
                    onClick={() => navigate('/admin/companies')}
                    className={`px-4 py-3 text-gray-700 rounded-md shadow-md cursor-pointer hover:bg-gray-50 transition text-center border border-gray-300 ${
                        location.pathname === '/admin/companies' ? 'bg-gray-100 font-bold text-lg text-gray-900' : ''
                    }`} // 법인 목록
                >
                    법인 목록
                </p>
                <p
                    onClick={() => navigate('/admin/job-posts')}
                    className={`px-4 py-3 text-gray-700 rounded-md shadow-md cursor-pointer hover:bg-gray-50 transition text-center border border-gray-300 ${
                        location.pathname === '/admin/job-posts' ? 'bg-gray-100 font-bold text-lg text-gray-900' : ''
                    }`} // 공고 목록
                >
                    공고 목록
                </p>
                <p
                    onClick={() => navigate('/admin/reviews')}
                    className={`px-4 py-3 text-gray-700 rounded-md shadow-md cursor-pointer hover:bg-gray-50 transition text-center border border-gray-300 ${
                        location.pathname === '/admin/reviews' ? 'bg-gray-100 font-bold text-lg text-gray-900' : ''
                    }`} // 리뷰 목록
                >
                    리뷰 목록
                </p>
                <p
                    onClick={() => navigate('/admin/notices')}
                    className={`px-4 py-3 text-gray-700 rounded-md shadow-md cursor-pointer hover:bg-gray-50 transition text-center border border-gray-300 ${
                        location.pathname === '/admin/notices' ? 'bg-gray-100 font-bold text-lg text-gray-900' : ''
                    }`} // 공지 목록
                >
                    공지 목록
                </p>
            </div>
        </div>
    );
};

export default AdminSideBar;
