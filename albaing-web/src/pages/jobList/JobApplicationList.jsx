import React, { useEffect, useState } from "react";
import axios from "axios";
import JobApplicationFilter from "./JobApplicationFilter";
import JobApplicationTable from "./JobApplicationTable";
import Pagination from "../company/detail/Pagination";

const JobApplicationList = () => {
    const [applications, setApplications] = useState([]); // 1. 전체 데이터
    const [filteredApplications, setFilteredApplications] = useState([]); // 2. 필터된 데이터
    const [searchParams, setSearchParams] = useState({
        companyName: "",
        jobPostTitle: "",
        userName: "",
    });

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 한 페이지당 개수 -> 줄이고 싶다면 줄이기

    useEffect(() => {
        fetchApplications(); // 최초 실행 시 전체 데이터 가져오기
    }, []);

    // API 호출하여 전체 지원 내역 불러오기
    const fetchApplications = async (params = {}) => {
        try {
            const response = await axios.get("http://localhost:8080/api/job-applications", { params });
            setApplications(response.data);
            setFilteredApplications(response.data); // 초기에는 전체 데이터 표시
            setCurrentPage(1); // 검색 시 첫 페이지로 이동
        } catch (error) {
            console.error("Error fetching job applications", error);
        }
    };

    // 검색 버튼을 눌러야 필터 적용할 수 있도록 버튼기능 생성
    const handleSearch = () => {
        const cleanedParams = Object.fromEntries(
            Object.entries(searchParams).filter(([_, value]) => value.trim() !== "")
        );
        fetchApplications(cleanedParams); // 필터된 데이터 가져오기
    };

    // 검색 필터 변경 핸들러 (입력 값 변경시 작동할 기능)
    const handleSearchChange = (name, value) => {
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 페이지네이션 : 현재 페이지에 맞는 데이터 필터링
    useEffect(() => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        setFilteredApplications(applications.slice(startIdx, endIdx));
    }, [applications, currentPage]);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">공고 지원 내역 조회</h2>
            <JobApplicationFilter searchParams={searchParams} onSearchChange={handleSearchChange} onSearch={handleSearch} />
            <JobApplicationTable applications={filteredApplications} />
            <Pagination
                totalItems={applications.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default JobApplicationList;
