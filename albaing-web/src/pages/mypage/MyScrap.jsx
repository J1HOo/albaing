import { useState, useEffect } from "react";
import apiMyPageService from "./apiMyPageService";

function SupportStatusPage() {
    const [statusCount, setStatusCount] = useState({
        total: 0,
        applied: 0,
        pending: 0,
        accepted: 0,
        rejected: 0
    });
    const [scrapList, setScrapList] = useState([]);

    // 사용자 ID는 로그인한 사용자에 따라 달라질 수 있으므로, 예시로 1을 사용
    const userId = 1;

    useEffect(() => {
        // 스크랩 상태 카운트 가져오기
        apiMyPageService.getScrapStatusCount(userId)
            .then((data) => {
                setStatusCount(data);
            })
            .catch((err) => {
                console.error("지원현황 상태 카운트 조회 실패:", err);
            });

        // 스크랩 목록 가져오기
        apiMyPageService.getScrapsByUser(userId)
            .then((data) => {
                setScrapList(data);
            })
            .catch((err) => {
                console.error("스크랩 목록 조회 실패:", err);
            });
    }, [userId]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">지원현황</h1>

            {/* 상태 카운트 */}
            <div className="flex space-x-6 mb-6">
                <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">전체</span>
                    <span className="text-2xl">{statusCount.total}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">지원완료</span>
                    <span className="text-2xl">{statusCount.applied}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">승인대기중</span>
                    <span className="text-2xl">{statusCount.pending}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">합격</span>
                    <span className="text-2xl">{statusCount.accepted}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">불합격</span>
                    <span className="text-2xl">{statusCount.rejected}</span>
                </div>
            </div>

            {/* 스크랩 내역 목록 */}
            <div className="space-y-4">
                {scrapList.map((scrap) => (
                    <div key={scrap.id} className="p-4 border rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold">{scrap.companyName}</h2>
                        <p className="text-sm text-gray-600">{scrap.jobPostTitle}</p>
                        <p className={`text-sm mt-2 ${scrap.status === "PENDING" ? "text-yellow-500" : scrap.status === "ACCEPTED" ? "text-green-500" : "text-red-500"}`}>
                            {scrap.status}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SupportStatusPage;
