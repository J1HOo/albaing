import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Link 컴포넌트 추가
import apiMyApplicationService from "../../../service/apiMyApplicationService";

const MyApplications = () => {
    const { resumeId ,jobPostId} = useParams();
    const [applications, setApplications] = useState([]);
    const [applicationStats, setApplicationStats] = useState(null); // 상태 개수 저장

    useEffect(() => {
        apiMyApplicationService.getJobApplicationsByResume(resumeId, setApplications);
        apiMyApplicationService.getApplicationStatsByResume(resumeId, setApplicationStats);
    }, [resumeId]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">지원한 공고 내역</h3>

            {/* 지원 상태 개수 (통계) 출력 */}
            {applicationStats && (
                <div>
                    <p className="p-5 text-lg font-bold text-gray-600">지원 현황</p>
                    <div className="mb-8 p-5 bg-[#F2F8FF] rounded-lg shadow-sm h-50">
                        <br />
                        <div className="max-w-4xl mx-auto p-6 mb-8 bg-white shadow-md rounded-lg">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 h-55">
                                <div className="text-center text-blue-600">
                                    <p className="text-3xl font-bold">{applicationStats.totalApplications}</p>
                                    <p className="text-sm text-gray-500">총 지원수</p>
                                </div>
                                <div className="text-center text-yellow-500">
                                    <p className="text-3xl font-bold">{applicationStats.approving}</p>
                                    <p className="text-sm text-gray-500">승인 대기중</p>
                                </div>
                                <div className="text-center text-green-500">
                                    <p className="text-3xl font-bold">{applicationStats.approved}</p>
                                    <p className="text-sm text-gray-500">합격</p>
                                </div>
                                <div className="text-center text-red-500">
                                    <p className="text-3xl font-bold">{applicationStats.denied}</p>
                                    <p className="text-sm text-gray-500">불합격</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 지원한 공고 목록 */}
            <p className="p-3 text-lg font-bold text-gray-600">지원한 공고</p>
            {applications.length === 0 ? (
                <p className="text-center text-gray-600">지원한 공고가 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {applications.map((application) => {
                        console.log("jobPostId : " ,application.jobPostId);
                        return (
                        <li key={application.resumeId}
                            className="p-4 border rounded-lg shadow-sm bg-[#F2F8FF] hover:bg-gray-50 transition"
                        >
                            <Link to={`/jobs/${application.jobPostId}`}>
                                <h3 className="text-xl font-semibold">{application.jobPostTitle}</h3>
                            </Link>
                            <p className="text-gray-700">{application.companyName}</p>
                            <p className={`mt-2 font-medium ${getStatusColor(application.approveStatus)}`}>
                                {convertStatus(application.approveStatus)}
                            </p>
                        </li>
                    )})}
                </ul>
            )}
        </div>
    );
};

// 지원 상태별 색상 지정 함수
const getStatusColor = (status) => {
    switch (status) {
        case "approving":
            return "text-yellow-500";
        case "approved":
            return "text-green-500";
        case "denied":
            return "text-red-500";
        default:
            return "text-gray-700";
    }
};

// 지원 상태 변환 함수
const convertStatus = (status) => {
    switch (status) {
        case "approving":
            return "승인대기중";
        case "approved":
            return "합격";
        case "denied":
            return "불합격";
        default:
            return "미정";
    }
};

export default MyApplications;
