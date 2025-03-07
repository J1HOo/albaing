import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function JobPostDetail() {
    const { id: jobPostId } = useParams();
    const [jobPost, setJobPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!jobPostId) {
            console.error("jobPostId가 존재하지 않습니다.");
            setError("잘못된 접근입니다.");
            setLoading(false);
            return;
        }

        axios
            .get(`http://localhost:8080/api/jobs/${jobPostId}`)
            .then((response) => {
                setJobPost(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("채용 공고 정보를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [jobPostId]);

    if (loading) {
        return <p className="text-center text-gray-500 mt-8">로딩 중...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-8">{error}</p>;
    }

    if (!jobPost) {
        return (
            <p className="text-center text-gray-500 mt-8">
                해당 공고를 찾을 수 없습니다.
            </p>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {jobPost.jobPostTitle || "제목 없음"}
                    </h2>
                    <div><strong>기업 ID:</strong> {jobPost.companyId || "-"}</div>
                    <div className="grid grid-cols-3 gap-4 text-gray-600 text-sm">
                        <div><strong>직종 카테고리:</strong> {jobPost.jobPostJobCategory || "-"}</div>
                        <div><strong>고용형태:</strong> {jobPost.jobPostJobType || "-"}</div>
                        <div><strong>근무기간:</strong> {jobPost.jobPostWorkingPeriod || "-"}</div>
                        <div><strong>근무요일:</strong> {jobPost.jobWorkSchedule || "-"}</div>
                        <div><strong>근무시간:</strong> {jobPost.jobPostShiftHours || "-"}</div>
                        <div><strong>급여:</strong> {jobPost.jobPostSalary || "-"}</div>
                    </div>
                </div>

                <div className="mb-4 space-y-1 text-sm text-gray-600">
                    <p><strong>근무지:</strong> {jobPost.jobPostWorkPlace || "-"}</p>
                    <p><strong>마감일:</strong> {jobPost.jobPostDueDate || "-"}</p>
                    <p><strong>연락처:</strong> {jobPost.jobPostContactNumber || "-"}</p>
                    <p><strong>학력요건:</strong> {jobPost.jobPostRequiredEducations || "-"}</p>
                </div>

                {jobPost.jobPostOptionalImage && (
                    <div className="mt-4">
                        <img
                            src={jobPost.jobPostOptionalImage}
                            alt="채용공고 이미지"
                            className="w-full h-auto object-contain rounded"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://via.placeholder.com/600x400?text=No+Image";
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
