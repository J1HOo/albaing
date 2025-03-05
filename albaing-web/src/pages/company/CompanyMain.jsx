import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

const CompanyMain = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [companyData, setCompanyData] = useState(null);
    const [jobPosts, setJobPosts] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { companyId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);

        const authUserStr = localStorage.getItem('authUser');
        if (!authUserStr) {
            setError('로그인이 필요한 페이지입니다.');
            setLoading(false);

            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        const authUser = JSON.parse(authUserStr);

        // 1. 기업 사용자인지 확인
        if (authUser.type !== 'company') {
            setError('기업 회원만 접근할 수 있는 페이지입니다.');
            setLoading(false);
            // 홈으로 리다이렉션
            setTimeout(() => navigate('/'), 1500);
            return;
        }

        // 2. URL의 companyId와 로그인한 기업 ID가 일치하는지 확인
        const loggedInCompanyId = authUser.data.companyId;

        if (loggedInCompanyId !== parseInt(companyId)) {
            setError('본인 회사의 페이지만 관리할 수 있습니다.');
            setLoading(false);
            // 로그인한 기업의 회사 페이지로 리다이렉션
            setTimeout(() => navigate(`/companies/${loggedInCompanyId}`), 1500);
            return;
        }

        axios
            .get(`http://localhost:8080/api/companies/${companyId}`)
            .then((companyRes) => {
                setCompanyData(companyRes.data);

                // 2) 채용공고 가져오기 (없을 수 있으므로 실패 시 빈 배열)
                return axios
                    .get(`http://localhost:8080/api/jobs/company/${companyId}`)
                    .then((jobsRes) => {
                        setJobPosts(jobsRes.data);
                    })
                    .catch(() => {
                        setJobPosts([]);
                    });
            })
            .then(() => {
                // 3) 지원자 데이터 가져오기 (없을 수 있으므로 실패 시 빈 배열)
                return axios
                    .get(`http://localhost:8080/api/applications/company/${companyId}`)
                    .then((appsRes) => {
                        setApplications(appsRes.data);
                    })
                    .catch(() => {
                        setApplications([]);
                    });
            })
            .catch(() => {
                // 회사 정보 불러오기 실패 시 전체 에러 처리
                setError('Failed to load company data. Please try again later.');
            })
            .finally(() => {
                // 모든 요청이 끝난 후 로딩 종료
                setLoading(false);
            });
    }, [companyId]);

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
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
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
                                                    onClick={() => window.location.href = `/company/job/edit/${job.jobPostId}`}
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
                                        onClick={() => window.location.href = '/company/profile/edit'}
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
