import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";


const CompanyMain = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();

    const { isLoggedIn, userType, userData } = useAuth();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [companyData, setCompanyData] = useState(null);
    const [jobPosts, setJobPosts] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 아직 로그인 상태를 확인할 수 없는 경우, 리턴하여 네비게이션 방지
        if (isLoggedIn === null || userData === null) return;

        // 로그인 여부 체크
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        // 기업 사용자 여부 체크
        if (userType !== 'company') {
            navigate('/');
            return;
        }

        // 본인 회사인지 체크 (userData가 로딩될 때까지 대기)
        if (userData && userData.companyId && parseInt(companyId) !== userData.companyId) {
            navigate(`/company/manage/${userData.companyId}`);
            return;
        }

        // 데이터 로딩 시작
        setLoading(true);
        axios.get(`/api/companies/${companyId}`, { withCredentials: true })
            .then(companyRes => {
                setCompanyData(companyRes.data);

                return axios.get(`/api/jobs/company/${companyId}`, { withCredentials: true })
                    .catch(jobError => jobError.response?.status === 404 ? { data: [] } : Promise.reject(jobError));
            })
            .then(jobsRes => {
                setJobPosts(jobsRes.data);

                return axios.get(`/api/applications/company/${companyId}`, { withCredentials: true })
                    .catch(appError => appError.response?.status === 404 ? { data: [] } : Promise.reject(appError));
            })
            .then(appsRes => {
                setApplications(appsRes.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("데이터 로딩 오류:", err);
                setError(
                    err.response
                        ? ({
                            404: '요청한 회사 정보를 찾을 수 없습니다.',
                            403: '해당 회사 정보에 접근 권한이 없습니다.',
                            500: '서버 내부 오류가 발생했습니다.'
                        }[err.response.status] || '데이터를 불러오는 중 예상치 못한 오류가 발생했습니다.')
                        : err.request
                            ? '서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.'
                            : '데이터 처리 중 오류가 발생했습니다.'
                );
                setLoading(false);
            });
    }, [companyId, isLoggedIn, navigate, userData, userType]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleCreateJobPost = () => {
        window.location.href = '/jobs/new';
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 사이드바 */}
            <div className="w-64 bg-white shadow-md">
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {companyData && companyData.companyName}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">Company Dashboard</p>
                </div>

                <nav className="mt-6">
                    <ul>
                        <li
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                activeTab === 'dashboard' ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => handleTabChange('dashboard')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">대시보드</span>
                            </div>
                        </li>

                        <li
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                activeTab === 'jobPosts' ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => handleTabChange('jobPosts')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">기업 채용공고</span>
                            </div>
                        </li>

                        <li
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                activeTab === 'applications' ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => handleTabChange('applications')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">지원자 관리</span>
                            </div>
                        </li>

                        <li
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                activeTab === 'profile' ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => handleTabChange('profile')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">회사 정보</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 overflow-y-auto p-8">
                {/* 대시보드 탭 */}
                {activeTab === 'dashboard' && (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">기업 대시보드</h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* 요약 카드들 */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-gray-500 text-sm font-medium">Active Job Postings</h3>
                                </div>
                                <p className="text-3xl font-bold text-gray-700 mt-2">
                                    {jobPosts.filter(job => job.jobPostStatus && new Date(job.jobPostDueDate) > new Date()).length}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Applications</h3>
                                </div>
                                <p className="text-3xl font-bold text-gray-700 mt-2">
                                    {applications.length}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-gray-500 text-sm font-medium">New Applications</h3>
                                </div>
                                <p className="text-3xl font-bold text-gray-700 mt-2">
                                    {applications.filter(app => !app.viewed).length}
                                </p>
                            </div>
                        </div>

                        {/* 최근 채용공고 목록 */}
                        <div className="bg-white rounded-lg shadow mb-8">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-800">채용공고</h3>
                            </div>
                            <div className="p-6">
                                {jobPosts.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    제목</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">근무지</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마감일</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공고상태</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                            {jobPosts.slice(0, 5).map((job, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                        {job.jobPostTitle}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {job.jobPostJobCategory}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {job.jobPostWorkPlace}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(job.jobPostDueDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {job.jobPostStatus && new Date(job.jobPostDueDate) > new Date() ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                    채용중
                                                                </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                    마감
                                                                </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No job postings yet. Create your first job posting to get started.</p>
                                )}
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={handleCreateJobPost}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                        새로운 채용 공고 작성
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 기업 채용공고 탭 */}
                {activeTab === 'jobPosts' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">기업 채용공고</h1>
                            <button
                                onClick={handleCreateJobPost}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                새로운 채용 공고 작성
                            </button>
                        </div>

                        {jobPosts.length > 0 ? (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">채용형태</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">근무지</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">채용마감일</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {jobPosts.map((job, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {job.jobPostTitle}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {job.jobPostJobCategory}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {job.jobPostJobType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {job.jobPostWorkPlace}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(job.jobPostDueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {job.jobPostStatus && new Date(job.jobPostDueDate) > new Date() ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            채용중
                                                        </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            마감
                                                        </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    onClick={() => window.location.href = `/jobs/edit/${job.jobPostId}`}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    수정하기
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newStatus = !job.jobPostStatus;
                                                        axios
                                                            .patch(`/api/jobs/${job.jobPostId}/status?status=${newStatus}`)
                                                            .then(() => {
                                                                // 상태 업데이트
                                                                const updatedJobs = [...jobPosts];
                                                                updatedJobs[index].jobPostStatus = newStatus;
                                                                setJobPosts(updatedJobs);
                                                            })
                                                            .catch(err => console.error('Error updating status:', err));
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    {job.jobPostStatus ? '마감하기' : '채용활성화'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <p className="text-gray-500 mb-4">해당 기업에서 올린 채용공고가 없습니다.</p>
                                <button
                                    onClick={handleCreateJobPost}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Create New Job Post
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 지원자 관리 탭 */}
                {activeTab === 'applications' && (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">지원자 관리</h1>

                        {applications.length > 0 ? (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {applications.map((app, index) => (
                                        <tr
                                            key={index}
                                            className={app.viewed ? 'hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {app.applicantName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {app.jobPostTitle}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(app.appliedDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            app.status === 'PENDING'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : app.status === 'INTERVIEW'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : app.status === 'ACCEPTED'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {app.status}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    onClick={() => window.location.href = `/company/applications/${app.applicationId}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <p className="text-gray-500">아직 지원자가 없습니다.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 회사 정보 탭 */}
                {activeTab === 'profile' && companyData && (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">회사 프로필</h1>

                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center mb-6">
                                    {companyData.companyLogo ? (
                                        <img
                                            src={companyData.companyLogo}
                                            alt="Company Logo"
                                            className="w-24 h-24 object-cover rounded-lg mr-6"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-200 rounded-lg mr-6 flex items-center justify-center text-gray-400">
                                            No Logo
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{companyData.companyName}</h2>
                                        <p className="text-gray-600">대표자 : {companyData.companyOwnerName}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">회사정보</h3>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">이메일:</span> {companyData.companyEmail}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">회사연락처:</span> {companyData.companyPhone}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">본사 위치:</span> {companyData.companyLocalAddress}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">회사 창립일:</span> {companyData.companyOpenDate}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">사업자등록번호:</span> {companyData.companyRegistrationNumber}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">회사설명</h3>
                                    <p className="text-gray-600 whitespace-pre-line">{companyData.companyDescription}</p>
                                </div>

                                <div className="text-right">
                                    <button
                                        onClick={() => window.location.href = `/companies/${companyId}`}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        수정하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyMain;