import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {LoadingSpinner, ErrorMessage, useModal, AlertModal} from '../../components';
import Pagination from '../../components/common/Pagination';
import {useAuth} from '../../contexts/AuthContext';
import JobCard from "./components/JobCard";
import apiScrapService from "../../service/apiScrapService";
import {useNavigate, useParams} from "react-router-dom";

// 카테고리 분류 데이터
const categories = [
    {name: '전체', value: null},
    {name: '외식/음료', value: '외식/음료'},
    {name: '유통/판매', value: '유통/판매'},
    {name: '문화/여가생활', value: '문화/여가생활'},
    {name: '서비스', value: '서비스'},
    {name: '사무/회계', value: '사무/회계'},
    {name: '고객상담/리서치', value: '고객상담/리서치'},
    {name: '생산/건설/노무', value: '생산/건설/노무'},
    {name: 'IT/기술', value: 'IT/기술'},
    {name: '디자인', value: '디자인'},
    {name: '미디어', value: '미디어'},
    {name: '운전/배달', value: '운전/배달'},
    {name: '병원/간호/연구', value: '병원/간호/연구'},
    {name: '교육/강사', value: '교육/강사'},
];

// 지역 분류 데이터
const locations = [
    {name: '전체', value: null},
    {name: '서울', value: '서울'},
    {name: '경기', value: '경기'},
    {name: '인천', value: '인천'},
    {name: '부산', value: '부산'},
    {name: '대구', value: '대구'},
    {name: '대전', value: '대전'},
    {name: '광주', value: '광주'},
];

export default function JobpostList() {
    const {isLoggedIn, userType, userData} = useAuth();
    const {userId, jobPostId} = useParams();
    const navigate = useNavigate();

    const [searchKeyword, setSearchKeyword] = useState("");
    const [regionSelect, setRegionSelect] = useState("");
    const [jobCategorySelect, setJobCategorySelect] = useState("");

    // 상태 관리
    const [jobListings, setJobListings] = useState([]);
    const [companyInfo, setCompanyInfo] = useState({});  // 회사 정보(이름, 이미지)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [scrapedPosts, setScrapedPosts] = useState([]);
    const alertModal = useModal();
    const [imminentPosts, setImminentPosts] = useState([]);
    const [newPosts, setNewPosts] = useState([]);
    const [randomPosts, setRandomPosts] = useState([]);

    useEffect(() => {
        axios.get("/api/jobs/mainPage/imminentPosts")
            .then((response) => {
                setImminentPosts(response.data);
            })
        axios.get("/api/jobs/mainPage/newPosts")
        .then((response) => {
            setNewPosts(response.data);
        })
        axios.get("/api/jobs/mainPage/randomPosts")
        .then((response) => {
            setRandomPosts(response.data);
        })
    }, [])

    useEffect(() => {
        fetchJobListings();
    }, [currentPage, selectedCategory, selectedLocation, searchQuery]);

    // 회사 정보 데이터 불러오기
    useEffect(() => {
        if (jobListings.length > 0) {
            fetchCompanyInfo();
        }
    }, [jobListings]);

// 스크랩된 공고 목록 로드
//     useEffect(() => {
//         if (isLoggedIn && userType === "personal" && userData && userData.userId) {
//             apiScrapService.getScrapsByUser(userData.userId, setScrapedPosts);
//         } else {
//             // 로그인 상태가 아니면 빈 배열로 초기화
//             setScrapedPosts([]);
//         }
//     }, [isLoggedIn, userType, userData]);

    // 회사 정보 데이터 조회
    const fetchCompanyInfo = () => {
        const uniqueCompanyIds = [...new Set(
            jobListings
                .filter(job => job.companyId)
                .map(job => job.companyId)
        )];

        // 이미 가져온 회사 정보 제외
        const idsToFetch = uniqueCompanyIds.filter(id => !companyInfo[id]);

        if (idsToFetch.length === 0) return;

        // 회사 정보 조회
        const newCompanyInfo = {...companyInfo};

        Promise.all(
            idsToFetch.map(companyId => {
                return axios.get(`/api/companies/${companyId}`, {withCredentials: true})
                    .then(response => {
                        if (response.data) {
                            newCompanyInfo[companyId] = {
                                companyName: response.data.companyName || "회사명 미지정",
                                companyLogo: response.data.companyLogo || null
                            };
                        }
                        return companyId;
                    })
                    .catch(() => {
                        // 회사 정보 조회 실패 시 처리하지 않음
                        newCompanyInfo[companyId] = {
                            companyName: "회사명 미지정",
                            companyLogo: null
                        };
                        return companyId;
                    });
            })
        )
            .then(() => {
                setCompanyInfo(newCompanyInfo);
            });
    };

    // 회사 정보 가져오기
    const getCompanyInfo = (job) => {
        // 이미 공고에 회사명이 포함된 경우
        if (job.companyName) {
            return {
                companyName: job.companyName,
                companyLogo: job.companyLogo || null
            };
        }

        // 회사 ID로 정보 조회
        if (job.companyId && companyInfo[job.companyId]) {
            return companyInfo[job.companyId];
        }

        // 기본 정보
        return {
            companyName: "회사명 미지정",
            companyLogo: null
        };
    };

    const fetchJobListings = () => {
        setLoading(true);
        setError(null);

        // API 요청 준비
        const endpoint = '/api/jobs';

        // API 요청 파라미터 구성
        const params = {
            page: currentPage,
            size: itemsPerPage
        };

        if (selectedCategory && selectedCategory !== 'all') {
            params.jobCategory = selectedCategory;
        }

        if (selectedLocation && selectedLocation !== 'all') {
            params.location = selectedLocation;
        }

        if (searchQuery.trim()) {
            params.keyword = searchQuery.trim();
        }

        // API 요청 실행
        // axios.get(endpoint, {
        //     params,
        //     withCredentials: true
        // })
        //     .then(response => {
        //         if (response.data) {
        //             const jobPosts = Array.isArray(response.data) ? response.data :
        //                 (response.data.content ? response.data.content : []);
        //
        //             setJobListings(jobPosts);
        //
        //             // 총 아이템 수 설정 (페이지네이션용)
        //             const total = response.data.totalElements ||
        //                 response.data.totalItems ||
        //                 response.headers['x-total-count'] ||
        //                 jobPosts.length;
        //
        //             setTotalItems(Number(total));
        //         } else {
        //             setJobListings([]);
        //             setTotalItems(0);
        //         }
        //         setLoading(false);
        //     })
        //     .catch(() => {
        //         setError('채용 공고를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        //         setJobListings([]);
        //         setTotalItems(0);
        //         setLoading(false);
        //     });
    };

    // 검색하기 버튼 클릭 시
    const handleSearch = () => {
        const params = new URLSearchParams();
        params.append("regionSelect", selectedLocation);
        params.append("jobCategorySelect", selectedCategory);
        params.append("searchKeyword", searchQuery);
        navigate(`/search?${params.toString()}`);
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    // 엔터 키 입력 시 검색 실행
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
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

    // 스크랩 토글 함수
    const toggleScrap = (jobPostId) => {

        if (!isLoggedIn) {
            alertModal.openModal({
                title: '로그인 필요',
                message: '로그인 후 이용 가능합니다.',
                type: 'info'
            });
            return;
        }

        if (userType !== "personal") {
            alertModal.openModal({
                title: '권한 제한',
                message: '개인 회원만 스크랩할 수 있습니다.',
                type: 'warning'
            });
            return;
        }

        const isCurrentlyScraped = scrapedPosts.some(
            scrap => (typeof scrap === 'object' && scrap.jobPostId === jobPostId) ||
                (typeof scrap === 'number' && scrap === jobPostId)
        );


        if (isCurrentlyScraped) {
            apiScrapService.removeScrap(userData.userId, jobPostId)
                .then(() => {
                    const updatedScraps = scrapedPosts.filter(post => post.jobPostId !== jobPostId);
                    setScrapedPosts(updatedScraps);

                    const scrapIds = updatedScraps.map(post => post.jobPostId);
                    localStorage.setItem("scrapedPosts", JSON.stringify(scrapIds))


                })
                .catch((err) => {
                    console.error("스크랩 삭제 실패", error);
                    alertModal.openModal({
                        title: '오류',
                        message: '스크랩 추가 중 오류가 발생했습니다.',
                        type: 'error'
                    });
                })
        } else {
            // 스크랩 추가
            apiScrapService.addScrap(userData.userId, jobPostId)
                .then(() => {
                    // API 요청 후 최신 목록을 다시 가져오기
                    return apiScrapService.getScrapsByUser(userData.userId, setScrapedPosts);
                })
                .then(() => {
                })
                .catch((err) => {
                    console.error("스크랩 추가 실패", err);
                    alertModal.openModal({
                        title: '오류',
                        message: '스크랩 추가 중 오류가 발생했습니다.',
                        type: 'error'
                    });
                });
        }

    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">채용 정보</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        다양한 채용공고를 확인하고 지금 바로 지원해보세요!
                    </p>
                </div>

                {/* 검색 필터 */}
                <div className="bg-white shadow rounded-lg mb-8 p-6 transition transform hover:shadow-lg">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                        <div className="sm:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">검색어</label>
                            <input
                                type="text"
                                id="search"
                                placeholder="직무, 회사명, 지역명 등"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        <div>
                            <label htmlFor="category"
                                   className="block text-sm font-medium text-gray-700 mb-1">직종</label>
                            <select
                                id="category"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 transition-all"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="location"
                                   className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                            <select
                                id="location"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 transition-all"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                {locations.map((location) => (
                                    <option key={location.value} value={location.value}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            검색하기
                        </button>
                    </div>
                </div>

                {/* 로딩 및 에러 상태 */}
                {/*{loading && <LoadingSpinner message="채용 공고를 불러오는 중..." fullScreen={false} className="py-10"/>}*/}
                {/*{error && <ErrorMessage message={error}/>}*/}

                {/* 채용 공고 목록 - 카드 형식 */}
                {/*{!loading && !error && (*/}
                {/*    <div>*/}
                {/*        {jobListings.length === 0 ? (*/}
                {/*            <div className="text-center py-10 bg-white rounded-lg shadow">*/}
                {/*                <p className="text-gray-500">검색 결과가 없습니다.</p>*/}
                {/*            </div>*/}
                {/*        ) : (*/}
                {/*            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">*/}
                {/*                {jobListings.map((job) => {*/}
                {/*                    const company = getCompanyInfo(job);*/}
                {/*                    const isScraped = Array.isArray(scrapedPosts) && scrapedPosts.some(*/}
                {/*                        scrap => (typeof scrap === 'object' && scrap.jobPostId === job.jobPostId) ||*/}
                {/*                            (typeof scrap === 'number' && scrap === job.jobPostId)*/}
                {/*                    );*/}

                {/*                    return (*/}
                {/*                        <JobCard*/}
                {/*                            key={job.jobPostId}*/}
                {/*                            job={job}*/}
                {/*                            company={company}*/}
                {/*                            isScraped={isScraped}*/}
                {/*                            isLoggedIn={isLoggedIn}*/}
                {/*                            userType={userType}*/}
                {/*                            toggleScrap={toggleScrap}*/}
                {/*                            formatDate={formatDate}*/}
                {/*                        />*/}
                {/*                    );*/}
                {/*                })}*/}
                {/*            </div>*/}
                {/*        )}*/}

                {/*        /!* 페이지네이션 *!/*/}
                {/*        {totalItems > 0 && (*/}
                {/*            <div className="mt-8">*/}
                {/*                <Pagination*/}
                {/*                    totalItems={totalItems}*/}
                {/*                    itemsPerPage={itemsPerPage}*/}
                {/*                    currentPage={currentPage}*/}
                {/*                    setCurrentPage={setCurrentPage}*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>

            <div>
                <br/>
                <h1> 마감 임박 공고 </h1>
                <br/>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {imminentPosts.map((job) => {
                        const company = getCompanyInfo(job);
                        const isScraped = Array.isArray(scrapedPosts) && scrapedPosts.some(
                            scrap => (typeof scrap === 'object' && scrap.jobPostId === job.jobPostId) ||
                                (typeof scrap === 'number' && scrap === job.jobPostId)
                        );

                        return (
                            <JobCard
                                key={job.jobPostId}
                                job={job}
                                company={company}
                                isScraped={isScraped}
                                isLoggedIn={isLoggedIn}
                                userType={userType}
                                toggleScrap={toggleScrap}
                                formatDate={formatDate}
                            />
                        );
                    })}
                </div>
                <br/>
            </div>


            <div>
                <br/>
                <h1> 최신 공고 </h1>
                <br/>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newPosts.map((job) => {
                        const company = getCompanyInfo(job);
                        const isScraped = Array.isArray(scrapedPosts) && scrapedPosts.some(
                            scrap => (typeof scrap === 'object' && scrap.jobPostId === job.jobPostId) ||
                                (typeof scrap === 'number' && scrap === job.jobPostId)
                        );

                        return (
                            <JobCard
                                key={job.jobPostId}
                                job={job}
                                company={company}
                                isScraped={isScraped}
                                isLoggedIn={isLoggedIn}
                                userType={userType}
                                toggleScrap={toggleScrap}
                                formatDate={formatDate}
                            />
                        );
                    })}
                </div>
                <br/>
            </div>

            <div>
                <br/>
                <h1> 랜덤 공고 </h1>
                <br/>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {randomPosts.map((job) => {
                        const company = getCompanyInfo(job);
                        const isScraped = Array.isArray(scrapedPosts) && scrapedPosts.some(
                            scrap => (typeof scrap === 'object' && scrap.jobPostId === job.jobPostId) ||
                                (typeof scrap === 'number' && scrap === job.jobPostId)
                        );

                        return (
                            <JobCard
                                key={job.jobPostId}
                                job={job}
                                company={company}
                                isScraped={isScraped}
                                isLoggedIn={isLoggedIn}
                                userType={userType}
                                toggleScrap={toggleScrap}
                                formatDate={formatDate}
                            />
                        );
                    })}
                </div>
                <br/>
            </div>
            <br/>
            {/* 모달 */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={alertModal.closeModal}
                title={alertModal.modalProps.title || '알림'}
                message={alertModal.modalProps.message}
                confirmText={alertModal.modalProps.confirmText || '확인'}
                type={alertModal.modalProps.type || 'info'}
            />
        </div>


    );
}