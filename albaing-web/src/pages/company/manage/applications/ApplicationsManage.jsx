import React, { useState } from 'react';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import {useParams} from "react-router-dom";

const ApplicationsManage = ({ applications, updateApplicantStatus }) => {
    const { userId } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'approved', 'denied'
    const [selectedApplication, setSelectedApplication] = useState(null);

    // 지원자 필터링
    const filteredApplications = applications.filter(app => {
        // 검색어 필터링
        const matchesSearch =
            app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.jobPostTitle?.toLowerCase().includes(searchTerm.toLowerCase());

        // 상태 필터링
        if (statusFilter === 'all') return matchesSearch;
        if (statusFilter === 'pending') return matchesSearch && app.approveStatus === 'approving';
        if (statusFilter === 'approved') return matchesSearch && app.approveStatus === 'approved';
        if (statusFilter === 'denied') return matchesSearch && app.approveStatus === 'denied';

        return matchesSearch;
    });

    // 지원서 상세 정보 보기
    const viewApplicationDetail = (application) => {
        setSelectedApplication(application);
    };

    // 지원자 상태 업데이트 (합격/불합격)
    const handleUpdateStatus = (applicationId, newStatus) => {
        updateApplicantStatus(applicationId, newStatus);

        // 현재 상세 보기 중인 지원서의 상태도 업데이트
        if (selectedApplication && selectedApplication.jobApplicationId === applicationId) {
            setSelectedApplication({...selectedApplication, approveStatus: newStatus});
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">지원자 관리</h1>

            {/* 검색 및 필터 옵션 */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="지원자명, 공고 제목 검색..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex-none">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">모든 상태</option>
                        <option value="pending">검토중</option>
                        <option value="approved">합격</option>
                        <option value="denied">불합격</option>
                    </select>
                </div>
            </div>

            {/* 지원자 목록 */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-2/3">
                    {filteredApplications.length > 0 ? (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지원자</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지원 공고</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지원일</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {filteredApplications.map(app => (
                                    <tr
                                        key={app.jobApplicationId}
                                        className={`hover:bg-gray-50 cursor-pointer ${
                                            selectedApplication?.jobApplicationId === app.jobApplicationId
                                                ? 'bg-blue-50'
                                                : ''
                                        }`}
                                        onClick={() => viewApplicationDetail(app)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {app.applicantName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 line-clamp-1">
                                                {app.jobPostTitle}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(app.applicationAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={app.approveStatus} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="text-blue-600 hover:text-blue-900"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    viewApplicationDetail(app);
                                                }}
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-500">현재 지원자가 없거나 검색 조건에 맞는 지원자가 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* 지원서 상세 정보 */}
                <div className="w-full lg:w-1/3">
                    {selectedApplication ? (
                        <div className="bg-white rounded-lg shadow p-6 space-y-4 sticky top-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">지원서 상세</h2>
                                <StatusBadge status={selectedApplication.approveStatus} />
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">지원자</h3>
                                    <p className="mt-1 text-lg text-gray-900">{selectedApplication.applicantName}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">지원 공고</h3>
                                    <p className="mt-1 text-lg text-gray-900">{selectedApplication.jobPostTitle}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">지원일</h3>
                                    <p className="mt-1 text-gray-900">
                                        {new Date(selectedApplication.applicationAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">지원 상태 변경</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedApplication.jobApplicationId, 'approved')}
                                        className={`
                                            flex-1 py-2 px-4 rounded-md text-white font-medium flex items-center justify-center
                                            ${selectedApplication.approveStatus === 'approved'
                                            ? 'bg-green-600'
                                            : 'bg-gray-400 hover:bg-green-500'
                                        }
                                        `}
                                        disabled={selectedApplication.approveStatus === 'approved'}
                                    >
                                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                                        합격
                                    </button>

                                    <button
                                        onClick={() => handleUpdateStatus(selectedApplication.jobApplicationId, 'denied')}
                                        className={`
                                            flex-1 py-2 px-4 rounded-md text-white font-medium flex items-center justify-center
                                            ${selectedApplication.approveStatus === 'denied'
                                            ? 'bg-red-600'
                                            : 'bg-gray-400 hover:bg-red-500'
                                        }
                                        `}
                                        disabled={selectedApplication.approveStatus === 'denied'}
                                    >
                                        <XCircleIcon className="h-5 w-5 mr-1" />
                                        불합격
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    className="w-full py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={() => window.location.href = `/resumes/${selectedApplication.resumeId}/user/${userId}`}
                                >
                                    이력서 상세 보기
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <p className="text-gray-500">왼쪽 목록에서 지원자를 선택하면 상세 정보를 볼 수 있습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 상태 배지 컴포넌트
const StatusBadge = ({ status }) => {
    let bgColor, textColor, icon, text;

    switch(status) {
        case 'approved':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            icon = <CheckCircleIcon className="h-4 w-4 mr-1" />;
            text = '합격';
            break;
        case 'denied':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            icon = <XCircleIcon className="h-4 w-4 mr-1" />;
            text = '불합격';
            break;
        default: // 'approving'
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            icon = <ClockIcon className="h-4 w-4 mr-1" />;
            text = '검토중';
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
            {icon}
            {text}
        </span>
    );
};

export default ApplicationsManage;