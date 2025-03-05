import React, { useState, useEffect } from "react";
import {getAllSchools} from "./apiResumeService";

const SchoolSelector = ({ onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [schoolList, setSchoolList] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);

    useEffect(() => {
        const fetchSchools = async () => {
            const schools = await getAllSchools();
            setSchoolList(schools);
        };
        fetchSchools();
    }, []);

    // 검색어 입력 시 필터링
    useEffect(() => {
        if (searchTerm === "") {
            setFilteredSchools([]);
            return;
        }
        const filtered = schoolList.filter((school) =>
            school.name.includes(searchTerm)
        );
        setFilteredSchools(filtered);
    }, [searchTerm, schoolList]);

    const handleSelect = (school) => {
        setSelectedSchool(school);
        setSearchTerm(school.name); // 선택한 학교 이름을 입력창에 표시
        setFilteredSchools([]); // 리스트 닫기
    };

    const handleConfirm = () => {
        if (!selectedSchool) {
            alert("학교를 선택하세요.");
            return;
        }
        onSelect(selectedSchool); // 선택한 학교를 Resume.jsx로 전달
        onClose(); // 모달 닫기
    };

    return (
        <div style={modalStyle}>
            <h2>학교 검색</h2>
            <input
                type="text"
                placeholder="학교 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <ul style={{ maxHeight: "150px", overflowY: "auto", padding: 0 }}>
                {filteredSchools.map((school, index) => (
                    <li
                        key={index}
                        onClick={() => handleSelect(school)}
                        style={{
                            padding: "5px",
                            cursor: "pointer",
                            backgroundColor: selectedSchool?.name === school.name ? "#ddd" : "white"
                        }}
                    >
                        {school.name} ({school.type})
                    </li>
                ))}
            </ul>
            <button onClick={handleConfirm} style={buttonStyle}>확인</button>
            <button onClick={onClose} style={cancelButtonStyle}>닫기</button>
        </div>
    );
};

// 스타일 추가
const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    backgroundColor: "white",
    padding: "20px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    zIndex: 1000
};

const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginTop: "10px"
};

const cancelButtonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginTop: "5px"
};

export default SchoolSelector;
