import React, { useState, useEffect } from 'react';
import {getAllSchools} from "../../service/apiEducationService";
import {getAllMajors} from "../../service/apiEducationService";

const EducationModal = ({ educationData, majorData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        eduDegree: '',
        eduStatus: '',
        eduSchool: '',
        eduMajor: '',
        eduAdmissionYear: '',
        eduGraduationYear: ''
    });

    //학교
    const [searchTerm, setSearchTerm] = useState("");
    const [schoolList, setSchoolList] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);

    //전공
    const [majorSearchTerm, setMajorSearchTerm] = useState("");
    const [majorList, setMajorList] = useState([]);
    const [filteredMajors, setFilteredMajors] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState(null);

    //학교 정보 가져오기
    useEffect(() => {
        const fetchSchools = () => {
            getAllSchools()
                .then((schools) => {
                    setSchoolList(schools);
                })
                .catch((error) => {
                    console.error('학교 데이터를 가져오는 중 오류 발생:', error);
                });
        };
        fetchSchools();
    }, []);

    //전공 정보 가져오기
    useEffect(() => {
        const fetchMajors = () => {
            getAllMajors()
                .then((majors) => {
                    setMajorList(majors);
                })
                .catch((error) => {
                    console.error('전공 데이터를 가져오는 중 오류 발생:', error);
                });
        };
        fetchMajors();
    }, []);

    // 학교 검색어 입력 시 필터링
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

// 전공 검색어 입력 시 필터링
    useEffect(() => {
        if (majorSearchTerm === "") {
            setFilteredMajors([]);
            return;
        }

        const filtered = majorList.filter((major) => {
            // facilName을 ','로 분리하여 각 전공 이름에 대해 검색어가 포함되는지 체크
            if (major.name) {
                const majorNames = major.name.split(','); // ','로 전공 이름 분리
                return majorNames.some((name) => name.toLowerCase().includes(majorSearchTerm.toLowerCase()));
            }
            return false;
        });

        setFilteredMajors(filtered);
    }, [majorSearchTerm, majorList]);





    const handleSelect = (school) => {
        setSelectedSchool(school);
        setSearchTerm(school.name); // 선택한 학교 이름을 입력창에 표시
        setFilteredSchools([]); // 리스트 닫기
    };

    const handleMajorSelect = (major) => {
        setSelectedMajor(major);
        setMajorSearchTerm(major.name); // 선택한 전공 이름을 입력창에 표시
        setFilteredMajors([]); // 리스트 닫기
    };


    const degreeTypes = ['고등학교', '전문학사', '학사', '석사', '박사', '기타'];

    const statusTypes = ['졸업', '재학중', '휴학중', '중퇴', '수료'];

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

    useEffect(() => {
        setFormData(prev => ({
            eduDegree: educationData?.eduDegree || prev.eduDegree || '',
            eduStatus: educationData?.eduStatus || prev.eduStatus || '',
            eduSchool: educationData?.eduSchool || prev.eduSchool || '',
            eduAdmissionYear: educationData?.eduAdmissionYear || prev.eduAdmissionYear || '',
            eduGraduationYear: educationData?.eduGraduationYear || prev.eduGraduationYear || '',
            eduMajor: majorData?.eduMajor || prev.eduMajor || '',
        }));
    }, [educationData, majorData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.eduSchool.trim()) {
            alert('학교명을 입력해주세요.');
            return;
        }

        if (!formData.eduMajor.trim()) {
            alert('전공을 입력해주세요.');
            return;
        }

        if (formData.eduStatus === '졸업' && !formData.eduGraduationYear) {
            alert('졸업년도를 선택해주세요.');
            return;
        }

        if (formData.eduAdmissionYear && formData.eduGraduationYear &&
            parseInt(formData.eduAdmissionYear) > parseInt(formData.eduGraduationYear)) {
            alert('입학년도는 졸업년도보다 빨라야 합니다.');
            return;
        }

        onSave({ ...formData });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 animate-slideIn">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">
                        <span className="text-blue-600 mr-2">✏️</span>
                        학력 정보 {educationData ? '수정' : '추가'}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <label htmlFor="eduSchool" className="block text-sm font-medium text-gray-700">
                                학교명 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="eduSchool"
                                name="eduSchool"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="학교 검색"
                                required
                            />
                            <ul style={{maxHeight: "150px", overflowY: "auto", padding: 0}}>
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="eduDegree" className="block text-sm font-medium text-gray-700">
                                    학위
                                </label>
                                <select
                                    id="eduDegree"
                                    name="eduDegree"
                                    value={formData.eduDegree}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                >
                                    <option value="">선택</option>
                                    {degreeTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="eduMajor" className="block text-sm font-medium text-gray-700">
                                    전공
                                </label>
                                <input
                                    type="text"
                                    id="eduMajor"
                                    name="eduMajor"
                                    value={majorSearchTerm}
                                    onChange={(e) => setMajorSearchTerm(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                    placeholder="전공을 입력하세요"
                                />
                                <ul style={{maxHeight: "150px", overflowY: "auto", padding: 0}}>
                                    {filteredMajors.map((major, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleMajorSelect(major)}
                                            style={{
                                                padding: "5px",
                                                cursor: "pointer",
                                                backgroundColor: selectedMajor?.name === major.name ? "#ddd" : "white"
                                            }}
                                        >
                                            {major.name} ({major.type})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="eduStatus" className="block text-sm font-medium text-gray-700">
                                재학상태
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {statusTypes.map((type, index) => (
                                    <label
                                        key={index}
                                        className={`px-4 py-2 rounded-full cursor-pointer border ${
                                            formData.eduStatus === type
                                                ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                        } transition-all`}
                                    >
                                        <input
                                            type="radio"
                                            name="eduStatus"
                                            value={type}
                                            checked={formData.eduStatus === type}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="eduAdmissionYear" className="block text-sm font-medium text-gray-700">
                                    입학년도
                                </label>
                                <select
                                    id="eduAdmissionYear"
                                    name="eduAdmissionYear"
                                    value={formData.eduAdmissionYear}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                >
                                    <option value="">선택</option>
                                    {yearOptions.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="eduGraduationYear" className="block text-sm font-medium text-gray-700">
                                    졸업년도
                                </label>
                                <select
                                    id="eduGraduationYear"
                                    name="eduGraduationYear"
                                    value={formData.eduGraduationYear}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                    disabled={formData.eduStatus === '재학중' || formData.eduStatus === '휴학중'}
                                >
                                    <option value="">선택</option>
                                    {yearOptions.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all font-medium"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all font-medium"
                        >
                            저장하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EducationModal;