import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


export default function JobPostDetail() {
    // Option2에 맞춰 URL 파라미터 이름을 id에서 jobPostId로 재정의
    const { id: jobPostId } = useParams();
    console.log("받은 jobPostId:", jobPostId);
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

    if (loading)
        return <p className="text-center text-gray-500 mt-8">로딩 중...</p>;
    if (error)
        return <p className="text-center text-red-500 mt-8">{error}</p>;
    if (!jobPost)
        return (
            <p className="text-center text-gray-500 mt-8">
                해당 공고를 찾을 수 없습니다.
            </p>
        );

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow-md mt-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                {jobPost.jobPostTitle}
            </h1>
            <div className="space-y-4 text-gray-600">
                <p>
                    <span className="font-semibold">기업 ID:</span> {jobPost.companyId}
                </p>
                <p>
                    <span className="font-semibold">카테고리:</span>{" "}
                    {jobPost.jobPostJobCategory}
                </p>
                <p>
                    <span className="font-semibold">근무 유형:</span>{" "}
                    {jobPost.jobPostJobType}
                </p>
                <p>
                    <span className="font-semibold">근무지:</span>{" "}
                    {jobPost.jobPostWorkPlace}
                </p>
                <p>
                    <span className="font-semibold">급여:</span> {jobPost.jobPostSalary} 원
                </p>
                <p>
                    <span className="font-semibold">마감일:</span>{" "}
                    {jobPost.jobPostDueDate}
                </p>
                <p>
                    <span className="font-semibold">연락처:</span>{" "}
                    {jobPost.jobPostContactNumber}
                </p>
            </div>
        </div>
    );
}
