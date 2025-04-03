import Banner from "../../components/layout/Banner";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobPostSearchResults = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getSearchParams = () => {
        if (typeof window === "undefined") return {};
        const params = new URLSearchParams(window.location.search);
        return {
            searchKeyword: params.get("searchKeyword") || "",
            regionSelect: params.get("regionSelect") || "",
            jobCategorySelect: params.get("jobCategorySelect") || ""
        };
    };

    useEffect(() => {
        const { searchKeyword, regionSelect, jobCategorySelect } = getSearchParams();
        setLoading(true);
        setError(null);

        axios
            .get("/api/jobs/mainPage/searchPosts", {
                params: { regionSelect, jobCategorySelect, searchKeyword }
            })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setSearchResults(response.data);
                } else {
                    setSearchResults([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [window.location.search]);

    const handleCardClick = (jobPostId) => {
        navigate(`/jobs/${jobPostId}`);
    };

    if (loading) return <p className="text-center text-gray-500">로딩 중...</p>;
    if (error) return <p className="text-center text-red-500">에러 발생: {error}</p>;

    return (
        <div className="bg-gray-50 py-12">
            <Banner />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">검색 결과</h2>
                    <p className="mt-4 text-lg text-gray-600">관련된 채용 공고를 확인해보세요.</p>
                </div>

                {searchResults.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                        <p className="text-gray-500">검색 결과가 없습니다.</p>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map((item, index) => (
                            <li
                                key={index}
                                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer"
                                onClick={() => handleCardClick(item.jobPostId)}
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={item.companyLogo || '/default-logo.png'}
                                        alt={item.companyName || '회사 로고'}
                                        className="w-12 h-12 object-cover rounded-full mr-4"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-900">{item.jobPostTitle}</h3>
                                </div>
                                <p className="text-gray-600">{item.companyName || "회사명 미지정"}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default JobPostSearchResults;
