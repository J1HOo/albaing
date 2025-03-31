import { useNavigate } from "react-router-dom";

const AdminMain = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-lg mx-auto p-6 bg-blue-50 rounded-lg shadow-md">
            <h2
                onClick={() => navigate('/admin')}
                className="text-3xl font-semibold text-center text-blue-600 mb-6 cursor-pointer">관리자 페이지</h2>

            <div className="space-y-4">
                <p
                    onClick={() => navigate('/admin/users')}
                    className="px-4 py-3 bg-white text-blue-700 rounded-md shadow-md cursor-pointer hover:bg-blue-100 transition text-center"
                >
                    유저 목록
                </p>
                <p
                    onClick={() => navigate('/admin/resumes')}
                    className="px-4 py-3 bg-white text-blue-700 rounded-md shadow-md cursor-pointer hover:bg-blue-100 transition text-center"
                >
                    이력서 목록
                </p>
                <p
                    onClick={() => navigate('/admin/applications')}
                    className="px-4 py-3 bg-white text-blue-700 rounded-md shadow-md cursor-pointer hover:bg-blue-100 transition text-center"
                >
                    신청 목록
                </p>
                <p
                    onClick={() => navigate('/admin/companies')}
                    className="px-4 py-3 bg-white text-blue-700 rounded-md shadow-md cursor-pointer hover:bg-blue-100 transition text-center"
                >
                    법인 목록
                </p>
                <p
                    onClick={() => navigate('/admin/job-posts')}
                    className="px-4 py-3 bg-white text-blue-700 rounded-md shadow-md cursor-pointer hover:bg-blue-100 transition text-center"
                >
                    공고 목록
                </p>
                <p
                    onClick={() => navigate('/admin/reviews')}
                    className="px-4 py-3 bg-white text-blue-700 rounded-md shadow-md cursor-pointer hover:bg-blue-100 transition text-center"
                >
                    리뷰 목록
                </p>
                <p
                    onClick={() => navigate('/admin/notices')}
                    className="px-4 py-3 bg-white text-blue-700 rounded-md shadow-md cursor-pointer hover:bg-blue-100 transition text-center"
                >
                    공지 목록
                </p>
            </div>
        </div>
    );
};

export default AdminMain;
