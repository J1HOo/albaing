import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function JobPostManage() {
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인한 회사의 채용공고만 가져오기
        axios.get('/api/company/my-job-posts')
            .then(response => {
                setJobPosts(response.data);
                setLoading(false);
            })
            .catch(error => {
                // 인증 오류 (401)일 경우 로그인 페이지로 이동
                if (error.response && error.response.status === 401) {
                    setError("로그인이 필요합니다.");
                    setTimeout(() => {
                        navigate('/login');
                    }, 1500);
                } else {
                    setError("채용 공고를 불러오는 중 오류가 발생했습니다.");
                }
                setLoading(false);
            });
    }, [navigate]);

    // 채용공고 상태 업데이트 함수
    const updateJobPostStatus = (jobPostId, newStatus) => {
        axios.patch(`/api/jobs/${jobPostId}/status?status=${newStatus}`)
            .then(() => {
                // 상태 업데이트 후 목록 다시 불러오기
                setJobPosts(prevPosts =>
                    prevPosts.map(post =>
                        post.jobPostId === jobPostId
                            ? {...post, jobPostStatus: newStatus}
                            : post
                    )
                );
            })
            .catch(error => {
                alert("상태 업데이트 중 오류가 발생했습니다.");
            });
    };

    // 새 채용공고 등록 페이지로 이동
    const createNewJobPost = () => {
        navigate('/job-post/create');
    };

    if (loading) return <p className="text-center text-gray-500">로딩 중...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">내 채용공고 관리</h1>
                <button
                    onClick={createNewJobPost}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                    새 채용공고 등록
                </button>
            </div>

            {jobPosts.length === 0 ? (
                <p className="text-gray-500">등록된 채용 공고가 없습니다.</p>
            ) : (
                <div className="grid gap-4">
                    {jobPosts.map(post => (
                        <div key={post.jobPostId} className="p-4 border rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold">{post.jobPostTitle}</h3>
                                    <p className="text-gray-600">직군: {post.jobPostJobCategory}</p>
                                    <p className="text-gray-600">근무지: {post.jobPostWorkPlace}</p>
                                    <p className="text-gray-600">마감일: {post.jobPostDueDate}</p>
                                    <p className="mt-2">
                                        <span
                                            className={`px-2 py-1 rounded text-sm ${
                                                post.jobPostStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {post.jobPostStatus ? '공개' : '비공개'}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => updateJobPostStatus(post.jobPostId, !post.jobPostStatus)}
                                        className={`px-3 py-1 rounded ${
                                            post.jobPostStatus
                                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                    >
                                        {post.jobPostStatus ? '비공개로 전환' : '공개로 전환'}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/job-post/edit/${post.jobPostId}`)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        수정
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}