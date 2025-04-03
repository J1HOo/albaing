import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import apiScrapService from "../../../service/apiScrapService";
import { LoadingSpinner, ErrorMessage, useModal, AlertModal } from "../../../components";
import Pagination from "../../../components/common/Pagination";
import { getErrorMessage } from "../../../components/ErrorHandler";
import axios from "axios";

const ScrapPage = () => {
    const { userId } = useParams();
    const [scrapedPosts, setScrapedPosts] = useState([]);
    const [companyInfo, setCompanyInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const alertModal = useModal();
    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9); // 3x3 그리드에 맞게 9개로 설정

    // 데이터 가져오기
    const fetchScrapData = () => {
        setLoading(true);
        apiScrapService.getScrapsByUser(userId, (data) => {
            setScrapedPosts(data);
            setLoading(false);
        }, (err) => {
            setError(getErrorMessage(err));
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchScrapData();
    }, [userId]);

    // 회사 정보 불러오기
    useEffect(() => {
        if (scrapedPosts.length > 0) {
            fetchCompanyInfo();
        }
    }, [scrapedPosts]);

    // 회사 정보 데이터 조회
    const fetchCompanyInfo = () => {
        const uniqueCompanyIds = [...new Set(
            scrapedPosts
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
                companyLogo: null
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

    const handleRemoveScrap = (jobPostId) => {

                apiScrapService.removeScrap(userId, jobPostId)
                    .then(() => {
                        console.log("삭제 진행중 ");
                        // 성공 시 즉시 목록 업데이트
                        const updatedScraps = scrapedPosts.filter(job => job.jobPostId !== jobPostId);
                        setScrapedPosts(updatedScraps);

                        // localStorage 업데이트
                        const scrapIds = updatedScraps.map(job => job.jobPostId);
                        localStorage.setItem("scrapedPosts", JSON.stringify(scrapIds));

                    })
                    .catch((err) => {
                        console.error("스크랩 삭제 오류", error);
                        alertModal.openModal({
                            title: '오류',
                            message: '스크랩 삭제 중 오류가 발생했습니다.',
                            type: 'error'
                        });
                    });

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

    // 현재 페이지에 표시할 스크랩 항목들
    const currentScraps = scrapedPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return <LoadingSpinner message="스크랩 정보를 불러오는 중..." />;
    }

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">내 스크랩 목록</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        관심 있는 공고를 한눈에 모아보세요
                    </p>
                </div>

                {error && <ErrorMessage message={error} />}

                {!loading && !error && (
                    <div>
                        {scrapedPosts.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-lg shadow">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                <h4 className="text-lg font-medium text-gray-800 mb-2">스크랩한 공고가 없습니다</h4>
                                <p className="text-gray-500 mb-4">관심있는 공고를 스크랩하여 모아보세요!</p>
                                <Link
                                    to="/jobs"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                >
                                    공고 보러가기
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentScraps.map((job) => {
                                        const company = getCompanyInfo(job);
                                        return (
                                            <div key={job.jobPostId} className="bg-white shadow rounded-lg overflow-hidden transition transform hover:shadow-lg hover:translate-y-[-2px]">
                                                {/* 카드 헤더 - 스크랩 아이콘 */}
                                                <div className="relative">
                                                    <div className="absolute top-2 right-2 z-10">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleRemoveScrap(job.jobPostId);
                                                            }}
                                                            className="p-1 rounded-full bg-opacity-90 text-white bg-blue-500 hover:bg-blue-700 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                            title="스크랩 취소"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="px-4 py-5 sm:p-6">
                                                    <div className="flex items-start">
                                                        {/* 회사 로고 영역 */}
                                                        <div className="mr-3">
                                                            {company.companyLogo ? (
                                                                <img
                                                                    src={company.companyLogo}
                                                                    alt={company.companyName}
                                                                    className="h-12 w-12 object-cover rounded-md"
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
                                                                    <span className="text-blue-600 font-bold text-xl">
                                                                        {company.companyName.substring(0, 1)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* 공고 정보 */}
                                                        <div className="flex-1 truncate">
                                                            <Link
                                                                to={`/jobs/${job.jobPostId}`}
                                                                className="text-lg font-medium text-blue-600 hover:text-blue-800 truncate block"
                                                            >
                                                                {job.jobPostTitle}
                                                            </Link>
                                                            <Link
                                                                to={`/companies/${job.companyId}`}
                                                                className="text-sm text-gray-700 hover:text-gray-900 mt-1 block"
                                                            >
                                                                {job.companyName}
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex justify-between items-center">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            스크랩일: {formatDate(job.scrapCreatedAt)}
                                                        </div>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                                                            채용중
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <Link
                                                            to={`/jobs/${job.jobPostId}`}
                                                            className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
                                                        >
                                                            공고 상세보기
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 페이지네이션 */}
                                {scrapedPosts.length > itemsPerPage && (
                                    <div className="mt-8">
                                        <Pagination
                                            totalItems={scrapedPosts.length}
                                            itemsPerPage={itemsPerPage}
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* 알림 모달 */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={alertModal.closeModal}
                title={alertModal.modalProps.title || '알림'}
                message={alertModal.modalProps.message}
                confirmText="확인"
                type={alertModal.modalProps.type || 'info'}
            />
        </div>
    );
};

export default ScrapPage;