import React from "react";

// 승인 상태별 스타일 반환 함수
const getStatusClass = (status) => {
    switch (status) {
        case "approved":
            return "bg-green-500 text-white";
        case "rejected":
            return "bg-red-500 text-white";
        default:
            return "bg-yellow-500 text-white";
    }
};

const JobApplicationTable = ({ applications }) => {
    const tableCellClass = "p-3 border border-gray-300";
    const tableHeaderClass = `${tableCellClass} bg-blue-100 font-bold text-gray-700`;

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr>
                    <th className={tableHeaderClass}>기업 로고</th>
                    <th className={tableHeaderClass}>기업명</th>
                    <th className={tableHeaderClass}>공고 제목</th>
                    <th className={tableHeaderClass}>지원자</th>
                    <th className={tableHeaderClass}>지원 일자</th>
                    <th className={tableHeaderClass}>승인 상태</th>
                </tr>
                </thead>
                <tbody>
                {applications.length > 0 ? (
                    applications.map((app) => (
                        <tr key={app.jobApplicationId} className="hover:bg-gray-100">
                            <td className={`${tableCellClass} text-center`}>
                                <img
                                    src={app.companyLogo || "/default-logo.png"}
                                    alt="기업 로고"
                                    className="w-12 h-12 mx-auto rounded-full"
                                />
                            </td>
                            <td className={tableCellClass}>{app.companyName}</td>
                            <td className={tableCellClass}>{app.jobPostTitle}</td>
                            <td className={tableCellClass}>{app.userName} ({app.userEmail})</td>
                            <td className={tableCellClass}>
                                {app.applicationAt ? new Date(app.applicationAt).toLocaleString() : "날짜 없음"}
                            </td>
                            <td className={`${tableCellClass} text-center`}>
                                    <span className={`px-2 py-1 rounded-md ${getStatusClass(app.approveStatus)}`}>
                                        {app.approveStatus}
                                    </span>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center p-4 text-gray-500">지원 내역이 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default JobApplicationTable;
