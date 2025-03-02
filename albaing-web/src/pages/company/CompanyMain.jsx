import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyMain = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [companyData, setCompanyData] = useState(null);
    const [jobPosts, setJobPosts] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get company ID from session/local storage - this would be set during login
    const companyId = localStorage.getItem('companyId');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // 1. 회사 정보는 필수이므로 오류 발생 시 전체 페이지에서 중단
            try {
                const companyResponse = await axios.get(`/api/companies/${companyId}`);
                setCompanyData(companyResponse.data);
            } catch (err) {
                setError('Failed to load company data. Please try again later.');
                setLoading(false);
                return;
            }

            // 2. 채용공고 데이터는 없을 수 있으므로, 오류 발생 시 빈 배열 처리
            try {
                const jobsResponse = await axios.get(`/api/jobs/post/${companyId}`);
                const data = jobsResponse.data;
                // data가 배열이면 그대로 사용, 아니면 data.jobPosts를 사용하거나 빈 배열 처리
                setJobPosts(Array.isArray(data) ? data : (Array.isArray(data.jobPosts) ? data.jobPosts : []));
            } catch (err) {
                setJobPosts([]); // 데이터가 없으면 빈 배열 할당
            }

            // 3. 지원서 데이터도 없을 수 있으므로, 오류 발생 시 빈 배열 처리
            // Fetch applications data
            try {
                const applicationsResponse = await axios.get(`/api/applications/company/${companyId}`);
                const appData = applicationsResponse.data;
                setApplications(Array.isArray(appData) ? appData : (Array.isArray(appData.applications) ? appData.applications : []));
            } catch (err) {
                setApplications([]);
            }

            setLoading(false);
        };

        if (companyId) {
            fetchData();
        } else {
            setError('Authentication error. Please log in again.');
            setLoading(false);
        }
    }, [companyId]);

    // Handle tab changes
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Create a new job post
    const handleCreateJobPost = () => {
        // JobpostAdd 페이지의 경로는 '/jobs/new'로 변경합니다.
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
            {/* Sidebar */}
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
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${activeTab === 'dashboard' ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
                            onClick={() => handleTabChange('dashboard')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">Dashboard</span>
                            </div>
                        </li>

                        <li
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${activeTab === 'jobPosts' ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
                            onClick={() => handleTabChange('jobPosts')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">Job Postings</span>
                            </div>
                        </li>

                        <li
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${activeTab === 'applications' ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
                            onClick={() => handleTabChange('applications')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">Applications</span>
                            </div>
                        </li>

                        <li
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${activeTab === 'profile' ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
                            onClick={() => handleTabChange('profile')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">Company Profile</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Summary Cards */}
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

                        {/* Recent Job Posts */}
                        <div className="bg-white rounded-lg shadow mb-8">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-800">Recent Job Postings</h3>
                            </div>
                            <div className="p-6">
                                {jobPosts.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                                  Active
                                </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Inactive
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
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Create New Job Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Job Postings Tab */}
                {activeTab === 'jobPosts' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">Job Postings</h1>
                            <button
                                onClick={handleCreateJobPost}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Create New Job Post
                            </button>
                        </div>

                        {jobPosts.length > 0 ? (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                              Active
                            </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Inactive
                            </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    onClick={() => window.location.href = `/jobs/${job.jobPostId}/edit`}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newStatus = !job.jobPostStatus;
                                                        axios.patch(`/api/jobs/${job.jobPostId}/status?status=${newStatus}`)
                                                            .then(() => {
                                                                const updatedJobs = [...jobPosts];
                                                                updatedJobs[index].jobPostStatus = newStatus;
                                                                setJobPosts(updatedJobs);
                                                            })
                                                            .catch(err => console.error('Error updating status:', err));
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    {job.jobPostStatus ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <p className="text-gray-500 mb-4">No job postings yet. Create your first job posting to
                                    get started.</p>
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

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Applications</h1>

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
                                        <tr key={index} className={app.viewed ? 'hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'}>
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
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              app.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : app.status === 'INTERVIEW'
                                      ? 'bg-blue-100 text-blue-800'
                                      : app.status === 'ACCEPTED'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                          }`}>
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
                                <p className="text-gray-500">No applications received yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Company Profile Tab */}
                {activeTab === 'profile' && companyData && (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Company Profile</h1>

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
                                        <p className="text-gray-600">{companyData.companyIndustry}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Contact Information</h3>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">Email:</span> {companyData.companyEmail}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">Phone:</span> {companyData.companyPhone}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">Website:</span> {companyData.companyWebsite}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">Address:</span> {companyData.companyAddress}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Company Details</h3>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">Size:</span> {companyData.companySize} employees</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">Founded:</span> {companyData.companyFoundedYear}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">Registration Number:</span> {companyData.companyRegistrationNumber}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">About</h3>
                                    <p className="text-gray-600 whitespace-pre-line">{companyData.companyDescription}</p>
                                </div>

                                <div className="text-right">
                                    <button
                                        onClick={() => window.location.href = '/company/profile/edit'}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Edit Profile
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
