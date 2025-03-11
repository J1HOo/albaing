import {useEffect, useState, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {ErrorMessage, LoadingSpinner} from "../../components/common";
import {useAuth} from "../../contexts/AuthContext";

export default function JobPostDetail() {
    const {jobPostId} = useParams();
    const navigate = useNavigate();
    const {isLoggedIn, userType, userData} = useAuth();
    const pageTopRef = useRef(null);

    const [jobPost, setJobPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumeId, setResumeId] = useState(null);
    const [modal, setModal] = useState({show: false, message: "", type: ""});
    const [isScraped, setIsScraped] = useState(false);
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [applicationResult, setApplicationResult] = useState(null);
    const [companyName, setCompanyName] = useState("");
    const [companyImage, setCompanyImage] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [jobPostId]);

    useEffect(() => {
        if (!jobPostId) {
            setError("잘못된 접근입니다.");
            setLoading(false);
            return;
        }

        loadJobPostData();
    }, [jobPostId, isLoggedIn, userType, userData]);

    function loadJobPostData() {
        setLoading(true);

        axios.get(`/api/jobs/${jobPostId}`, {withCredentials: true})
            .then((response) => {
                if (response.data) {
                    const jobData = response.data;
                    setJobPost(jobData);

                    if (jobData.companyId) {
                        axios.get(`/api/companies/${jobData.companyId}`, {withCredentials: true})
                            .then((companyResponse) => {
                                if (companyResponse.data) {
                                    setCompanyName(companyResponse.data.companyName || "회사명 미지정");
                                    setCompanyImage(companyResponse.data.companyImage || null);
                                }
                            })
                            .catch(() => {
                                // 회사 정보 조회 실패 시 기본값 유지
                            });
                    }

                    // 로그인한 개인 사용자인 경우 스크랩 여부 확인 및 이력서/지원 정보 불러오기
                    if (isLoggedIn && userType === "personal") {
                        const scrapedPosts = JSON.parse(localStorage.getItem("scrapedPosts") || "[]");
                        if (scrapedPosts.includes(Number(jobPostId))) {
                            setIsScraped(true);
                        }
                        fetchResumeAndCheckApplication();
                    }
                } else {
                    setError("공고 정보가 없습니다.");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("채용 공고 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
                setLoading(false);
            });
    }

    // 이력서 및 지원 내역 확인
    function fetchResumeAndCheckApplication() {
        if (!isLoggedIn || userType !== "personal" || !userData) return;

        const userId = userData.userId || userData.data?.userId;
        if (!userId) {
            return;
        }

        axios.get(`/api/resume/user/${userId}`, {withCredentials: true})
            .then((response) => {
                if (response.data && response.data.resumeId) {
                    setResumeId(response.data.resumeId);
                    checkAlreadyApplied(response.data.resumeId);
                } else {
                    setResumeId(null);
                }
            })
            .catch((error) => {
                setResumeId(null);
            });
    }

    // 지원 여부 확인
    function checkAlreadyApplied(currentResumeId) {
        if (!currentResumeId || !jobPostId) return;

        axios.get(`/api/applications/resume/${currentResumeId}`, {withCredentials: true})
            .then((response) => {
                if (response.data && Array.isArray(response.data)) {
                    const hasApplied = response.data.some(
                        (application) => Number(application.jobPostId) === Number(jobPostId)
                    );
                    setAlreadyApplied(hasApplied);
                }
            })
            .catch(() => {
                // 조회 실패 시 특별한 처리 없음
            });
    }

    const showModal = (message, type) => {
        setModal({show: true, message, type});
    };

    const closeModal = () => {
        setModal({show: false, message: "", type: ""});
    };

    const goToResumeCreation = () => {
        closeModal();
        navigate("/resumes");
    };

    // 지원하기 버튼 클릭 시
    const handleApply = () => {
        if (!isLoggedIn) {
            showModal("로그인 후 이용 가능합니다.", "alert");
            return;
        }
        if (userType === "company") {
            showModal("기업 회원은 지원할 수 없습니다.", "alert");
            return;
        }

        if (!jobPost?.jobPostStatus || new Date(jobPost.jobPostDueDate) <= new Date()) {
            showModal("비활성화되거나 마감된 공고입니다.", "alert");
            return;
        }

        if (!resumeId) {
            showModal("이력서가 없습니다. 작성하러 가시겠습니까?", "resume-confirm");
            return;
        }
        if (alreadyApplied) {
            showModal("이미 지원한 공고입니다.", "alert");
            return;
        }
        showModal("정말 이 공고에 지원하시겠습니까?", "confirm");
    };

    // 지원 확인 모달에서 확인 시
    const confirmApply = () => {
        closeModal();
        if (!isLoggedIn || userType !== "personal" || !resumeId) return;

        const applicationData = {
            jobPostId: Number(jobPostId),
            resumeId: Number(resumeId)
        };

        axios.post("/api/applications", applicationData, {withCredentials: true})
            .then(() => {
                setAlreadyApplied(true);
                setApplicationResult({
                    success: true,
                    message: "지원 성공! 행운을 빕니다."
                });
                setModal({show: true, message: "", type: "result"});
            })
            .catch(() => {
                setApplicationResult({
                    success: false,
                    message: "지원 중 오류가 발생했습니다. 다시 시도해주세요."
                });
                setModal({show: true, message: "", type: "result"});
            });
    };

    // 스크랩 토글
    const toggleScrap = () => {
        if (!isLoggedIn) {
            showModal("로그인 후 이용 가능합니다.", "alert");
            return;
        }
        if (userType !== "personal") {
            showModal("개인 회원만 스크랩할 수 있습니다.", "alert");
            return;
        }

        let scrapedPosts = JSON.parse(localStorage.getItem("scrapedPosts") || "[]");

        if (isScraped) {
            // 스크랩 취소
            scrapedPosts = scrapedPosts.filter((id) => id !== Number(jobPostId));

            // API 호출 (사용자 ID가 있는 경우)
            if (userData && userData.userId) {
                axios.delete(`/api/scrap/remove/${userData.userId}/${jobPostId}`, {withCredentials: true})
                    .catch(() => {/* 실패 시 특별한 처리 없음 */
                    });
            }
        } else {
            // 스크랩 추가
            scrapedPosts.push(Number(jobPostId));

            // API 호출 (사용자 ID가 있는 경우)
            if (userData && userData.userId) {
                axios.post(`/api/scrap/add/${userData.userId}/${jobPostId}`, {}, {withCredentials: true})
                    .catch(() => {/* 실패 시 특별한 처리 없음 */
                    });
            }
        }

        localStorage.setItem("scrapedPosts", JSON.stringify(scrapedPosts));
        setIsScraped(!isScraped);
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return '-';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    if (loading) return <LoadingSpinner message="채용 공고를 불러오는 중..."/>
    if (error) return <ErrorMessage message={error}/>
    if (!jobPost) return <div className="text-center py-10">해당 공고를 찾을 수 없습니다.</div>

    return (
        <div className="bg-gray-50 py-12" ref={pageTopRef}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 스크랩 버튼 */}
                {isLoggedIn && userType === "personal" && (
                    <div className="flex justify-end mb-4">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                                isScraped
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                            onClick={toggleScrap}
                            aria-label={isScraped ? "스크랩 취소" : "스크랩하기"}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill={isScraped ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                            </svg>
                            {isScraped ? "스크랩됨" : "스크랩"}
                        </button>
                    </div>
                )}

                {/* 회사 이미지 표시 - 크게 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    {companyImage && (
                        <div className="w-full h-64 bg-gray-100">
                            <img
                                src={companyImage}
                                alt={companyName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                    )}
                    <div className="flex items-center p-6 border-b border-gray-200">
                        <div
                            className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                            {companyName ? companyName.charAt(0) : 'C'}
                        </div>
                        <div className="ml-6 flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{companyName || "회사명 미지정"}</h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {jobPost.jobPostJobCategory || "미분류"}
                                </span>
                                <span
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {jobPost.jobPostWorkPlace ? jobPost.jobPostWorkPlace.split(' ')[0] : "지역 미지정"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 채용 정보 섹션 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">채용 정보</h2>
                        <div className="flex flex-col sm:flex-row justify-between mb-4">
                            <div className="mb-4 sm:mb-0">
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">{jobPost.jobPostTitle || "제목 없음"}</h3>
                                <p className="text-sm text-gray-500">
                                    등록일: {formatDate(jobPost.jobPostCreatedAt)} | 마감일: <span
                                    className="text-red-600 font-medium">{formatDate(jobPost.jobPostDueDate)}</span>
                                </p>
                            </div>

                            <div className="flex items-center">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    new Date(jobPost.jobPostDueDate) > new Date() && jobPost.jobPostStatus
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}>
                                    {new Date(jobPost.jobPostDueDate) > new Date() && jobPost.jobPostStatus
                                        ? "채용중"
                                        : "마감됨"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">근무
                                    조건</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-28 text-sm font-medium text-gray-500">고용형태</div>
                                        <div
                                            className="flex-1 text-sm text-gray-900">{jobPost.jobPostJobType || "-"}</div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-28 text-sm font-medium text-gray-500">근무기간</div>
                                        <div
                                            className="flex-1 text-sm text-gray-900">{jobPost.jobPostWorkingPeriod || "-"}</div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-28 text-sm font-medium text-gray-500">근무요일</div>
                                        <div
                                            className="flex-1 text-sm text-gray-900">{jobPost.jobWorkSchedule || "-"}</div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-28 text-sm font-medium text-gray-500">근무시간</div>
                                        <div
                                            className="flex-1 text-sm text-gray-900">{jobPost.jobPostShiftHours || "-"}</div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-28 text-sm font-medium text-gray-500">급여</div>
                                        <div
                                            className="flex-1 text-sm text-gray-900 font-medium">{jobPost.jobPostSalary || "-"}</div>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">근무
                                    정보</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-28 text-sm font-medium text-gray-500">근무지</div>
                                        <div
                                            className="flex-1 text-sm text-gray-900">{jobPost.jobPostWorkPlace || "-"}</div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-28 text-sm font-medium text-gray-500">학력요건</div>
                                        <div
                                            className="flex-1 text-sm text-gray-900">{jobPost.jobPostRequiredEducations || "제한 없음"}</div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-28 text-sm font-medium text-gray-500">연락처</div>
                                        <div
                                            className="flex-1 text-sm text-gray-900">{jobPost.jobPostContactNumber || "-"}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 상세 내용 섹션 */}
                {jobPost.jobPostOptionalImage && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">상세 내용</h2>
                        </div>
                        <div className="p-6">
                            <img
                                src={jobPost.jobPostOptionalImage}
                                alt="채용공고 상세 이미지"
                                className="w-full h-auto rounded"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/800x400?text=이미지를+불러올+수+없습니다";
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* 지원하기 버튼 */}
                <div className="flex justify-center mt-6 mb-12">
                    <button
                        onClick={handleApply}
                        className={`py-3 px-10 rounded-full text-lg shadow-lg transition duration-200 ${
                            alreadyApplied
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : new Date(jobPost.jobPostDueDate) > new Date() && jobPost.jobPostStatus
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-gray-400 text-white cursor-not-allowed"
                        }`}
                        disabled={alreadyApplied || !(new Date(jobPost.jobPostDueDate) > new Date() && jobPost.jobPostStatus)}
                    >
                        {alreadyApplied ? "지원 완료" : new Date(jobPost.jobPostDueDate) > new Date() && jobPost.jobPostStatus ? "지원하기" : "마감된 공고"}
                    </button>
                </div>
            </div>

            {/* 모달 */}
            {modal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        {modal.type === "confirm" && (
                            <>
                                <h3 className="text-xl font-semibold mb-4">지원 확인</h3>
                                <p className="mb-6">{modal.message}</p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                                        onClick={closeModal}
                                    >
                                        아니오
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        onClick={confirmApply}
                                    >
                                        예
                                    </button>
                                </div>
                            </>
                        )}
                        {modal.type === "resume-confirm" && (
                            <>
                                <h3 className="text-xl font-semibold mb-4">이력서 확인</h3>
                                <p className="mb-6">{modal.message}</p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                                        onClick={closeModal}
                                    >
                                        아니오
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        onClick={goToResumeCreation}
                                    >
                                        예
                                    </button>
                                </div>
                            </>
                        )}
                        {modal.type === "result" && (
                            <>
                                <h3
                                    className={`text-xl font-semibold mb-4 ${
                                        applicationResult?.success
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {applicationResult?.success ? "지원 완료" : "지원 실패"}
                                </h3>
                                <p className="mb-6">{applicationResult?.message}</p>
                                <div className="flex justify-end">
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        onClick={closeModal}
                                    >
                                        확인
                                    </button>
                                </div>
                            </>
                        )}
                        {modal.type === "alert" && (
                            <>
                                <h3 className="text-xl font-semibold mb-4">알림</h3>
                                <p className="mb-6">{modal.message}</p>
                                <div className="flex justify-end">
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        onClick={closeModal}
                                    >
                                        확인
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}