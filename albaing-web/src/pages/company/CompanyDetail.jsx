import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

// 리뷰 작성 모달 컴포넌트
const ReviewModal = ({ companyId, onClose, onSubmit }) => {
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewContent, setReviewContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reviewTitle.trim()) {
            setError("제목을 입력해주세요.");
            return;
        }

        if (!reviewContent.trim()) {
            setError("내용을 입력해주세요.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await onSubmit({
                reviewTitle,
                reviewContent,
                companyId
            });
            onClose();
        } catch (err) {
            setError(err.message || "리뷰 작성 중 오류가 발생했습니다.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">기업 리뷰 작성</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="reviewTitle"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="리뷰 제목을 입력하세요"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="reviewContent" className="block text-sm font-medium text-gray-700 mb-1">
                            내용 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="reviewContent"
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows={6}
                            placeholder="리뷰 내용을 입력하세요"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading ? "제출 중..." : "리뷰 등록"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CompanyDetail = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, userType } = useAuth();

    const [company, setCompany] = useState(null);
    const [jobPosts, setJobPosts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("info");
    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        // 회사 정보 로드
        axios.get(`/api/companies/${companyId}`)
            .then((res) => {
                setCompany(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("회사 정보를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
                console.error("Error fetching company data:", err);
            });
    }, [companyId]);

    // 탭 변경시 해당 데이터 로드
    useEffect(() => {
        if (activeTab === "jobs") {
            setLoading(true);
            axios.get(`/api/jobs/company/${companyId}`)
                .then((res) => {
                    setJobPosts(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError("채용 정보를 불러오는 중 오류가 발생했습니다.");
                    setLoading(false);
                    console.error("Error fetching job posts:", err);
                });
        } else if (activeTab === "reviews") {
            setLoading(true);
            axios.get(`/api/companies/${companyId}/reviews`)
                .then((res) => {
                    setReviews(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError("리뷰를 불러오는 중 오류가 발생했습니다.");
                    setLoading(false);
                    console.error("Error fetching reviews:", err);
                });
        }
    }, [activeTab, companyId]);

    // 리뷰 작성 처리
    const handleSubmitReview = async (reviewData) => {
        if (!isLoggedIn || userType !== 'personal') {
            navigate('/login');
            return;
        }

        try {
            await axios.post(`/api/companies/${companyId}/reviews`, reviewData, {
                withCredentials: true
            });

            // 리뷰 목록 새로고침
            const res = await axios.get(`/api/companies/${companyId}/reviews`);
            setReviews(res.data);
            return Promise.resolve();
        } catch (err) {
            console.error("Error submitting review:", err);
            return Promise.reject(new Error(err.response?.data?.message || "리뷰 등록에 실패했습니다."));
        }
    };

    // 리뷰 모달 열기 핸들러
    const handleOpenReviewModal = () => {
        if (!isLoggedIn) {
            if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
                navigate('/login');
            }
            return;
        }

        if (userType !== 'personal') {
            alert("일반 사용자만 리뷰를 작성할 수 있습니다.");
            return;
        }

        setShowReviewModal(true);
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // 리뷰 상세페이지로 이동
    const navigateToReviewDetail = (reviewId) => {
        navigate(`/companies/${companyId}/reviews/${reviewId}`);
    };

    if (loading && !company)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );

    if (error && !company)
        return (
            <div className="text-center py-10">
                <div className="text-red-500 text-lg">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    다시 시도
                </button>
            </div>
        );

    if (!company)
        return (
            <div className="text-center py-10">
                <div className="text-gray-500 text-lg">회사 정보를 찾을 수 없습니다.</div>
                <Link
                    to="/"
                    className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 회사 헤더 정보 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="md:flex">
                    {/* 회사 로고 */}
                    <div className="md:flex-shrink-0 p-6 flex justify-center md:justify-start">
                        {company.companyLogo ? (
                            <img
                                src={company.companyLogo}
                                alt={`${company.companyName} 로고`}
                                className="h-32 w-32 object-contain"
                            />
                        ) : (
                            <div className="h-32 w-32 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-400 text-lg">{company.companyName?.substring(0, 1)}</span>
                            </div>
                        )}
                    </div>

                    {/* 회사 기본 정보 */}
                    <div className="p-6 md:flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.companyName}</h1>
                        <p className="text-gray-600 mb-4">{company.companyDescription || "회사 소개가 없습니다."}</p>

                        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">대표자:</span> {company.companyOwnerName}
                            </div>
                            <div>
                                <span className="font-medium">설립일:</span> {formatDate(company.companyOpenDate)}
                            </div>
                            <div>
                                <span className="font-medium">주소:</span> {company.companyLocalAddress}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "info"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        회사 정보
                    </button>
                    <button
                        onClick={() => setActiveTab("jobs")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "jobs"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        채용 공고
                    </button>
                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "reviews"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        기업 리뷰
                    </button>
                </nav>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* 탭 로딩 상태 */}
                {loading && activeTab !== "info" && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* 회사 정보 탭 */}
                {activeTab === "info" && !loading && (
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">상세 정보</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">회사명</h3>
                                    <p className="mt-1 text-base text-gray-900">{company.companyName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">대표자</h3>
                                    <p className="mt-1 text-base text-gray-900">{company.companyOwnerName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">설립일</h3>
                                    <p className="mt-1 text-base text-gray-900">{formatDate(company.companyOpenDate)}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">이메일</h3>
                                    <p className="mt-1 text-base text-gray-900">{company.companyEmail || "-"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">전화번호</h3>
                                    <p className="mt-1 text-base text-gray-900">{company.companyPhone || "-"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">주소</h3>
                                    <p className="mt-1 text-base text-gray-900">{company.companyLocalAddress || "-"}</p>
                                </div>
                            </div>
                        </div>

                        {company.companyDescription && (
                            <div className="mt-8">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">회사 소개</h3>
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <p className="text-base text-gray-900 whitespace-pre-line">
                                        {company.companyDescription}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 채용 공고 탭 */}
                {activeTab === "jobs" && !loading && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">채용 공고</h2>
                            <span className="text-sm text-gray-500">전체 {jobPosts.length}개</span>
                        </div>

                        {jobPosts.length > 0 ? (
                            <div className="space-y-4">
                                {jobPosts.map((job) => (
                                    <div
                                        key={job.jobPostId}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <Link to={`/jobs/${job.jobPostId}`} className="block">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-medium text-blue-600 mb-1">
                                                        {job.jobPostTitle}
                                                    </h3>
                                                    <div className="text-sm text-gray-500 space-y-1">
                                                        <p>
                                                            <span className="font-medium">직종:</span> {job.jobPostJobCategory}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">근무형태:</span> {job.jobPostJobType}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">급여:</span> {job.jobPostSalary}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">근무지:</span> {job.jobPostWorkPlace}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        job.jobPostStatus && new Date(job.jobPostDueDate) > new Date()
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}>
                                                        {job.jobPostStatus && new Date(job.jobPostDueDate) > new Date()
                                                            ? "채용중"
                                                            : "마감"}
                                                    </span>
                                                    <span className="text-sm text-gray-500 mt-2">
                                                        ~{formatDate(job.jobPostDueDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">현재 진행 중인 채용공고가 없습니다.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 기업 리뷰 탭 */}
                {activeTab === "reviews" && !loading && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">기업 리뷰</h2>
                            <button
                                onClick={handleOpenReviewModal}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                            >
                                리뷰 작성하기
                            </button>
                        </div>

                        {reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div
                                        key={review.reviewId}
                                        onClick={() => navigateToReviewDetail(review.reviewId)}
                                        className="border-b border-gray-200 pb-6 last:border-b-0 cursor-pointer hover:bg-gray-50 p-4 rounded-md transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-medium text-gray-900">{review.reviewTitle}</h3>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(review.reviewCreatedAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 line-clamp-3">{review.reviewContent}</p>
                                        <p className="text-sm text-blue-600 mt-2">자세히 보기 &rarr;</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">아직 등록된 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 오류 메시지 */}
                {error && activeTab !== "info" && !loading && (
                    <div className="p-6 text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            다시 시도
                        </button>
                    </div>
                )}
            </div>

            {/* 리뷰 작성 모달 */}
            {showReviewModal && (
                <ReviewModal
                    companyId={companyId}
                    onClose={() => setShowReviewModal(false)}
                    onSubmit={handleSubmitReview}
                />
            )}
        </div>
    );
};

export default CompanyDetail;