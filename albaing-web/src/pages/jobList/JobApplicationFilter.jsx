import React from "react";

const JobApplicationFilter = ({ searchParams, onSearchChange, onSearch }) => {
    return (
        <div className="flex flex-wrap gap-4 mb-4">
            <input
                type="text"
                name="companyName"
                placeholder="기업명"
                value={searchParams.companyName}
                onChange={(e) => onSearchChange(e.target.name, e.target.value)}
                className="border rounded px-3 py-2 w-1/3"
            />
            <input
                type="text"
                name="jobPostTitle"
                placeholder="공고 제목"
                value={searchParams.jobPostTitle}
                onChange={(e) => onSearchChange(e.target.name, e.target.value)}
                className="border rounded px-3 py-2 w-1/3"
            />
            <input
                type="text"
                name="userName"
                placeholder="지원자명"
                value={searchParams.userName}
                onChange={(e) => onSearchChange(e.target.name, e.target.value)}
                className="border rounded px-3 py-2 w-1/3"
            />
            <button
                onClick={onSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                검색
            </button>
        </div>
    );
};

export default JobApplicationFilter;
