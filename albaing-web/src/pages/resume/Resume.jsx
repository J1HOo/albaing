import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Resume = () => {
    // 기본정보
    const [profile, setProfile] = useState();
    // 이력서 제목
    const [resumeTitle, setResumeTitle] = useState("");
    // 학력사항
    const [educationList, setEducationList] = useState([]);
    // 경력사항
    const [careerList, setCareerList] = useState([]);
    // 희망근무조건
    const [locations, setLocations] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [workType, setWorkType] = useState([]);
    const [workingPeriod, setWorkingPeriod] = useState("");
    const [workingDays, setWorkingDays] = useState([]);
    const [query, setQuery] = useState(""); // 입력한 검색어
    const [results, setResults] = useState([]); // 검색 결과 리스트
    const [selectedAddress, setSelectedAddress] = useState(""); // 선택한 주소
    const [cityDistrict, setCityDistrict] = useState(""); // 시/구 형태 변환 결과
    // 자기소개 및 스킬
    const [introduce, setIntroduce] = useState("");
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");

    // 학력 추가
    const handleAddEducation = (school, major, startDate, endDate, graduated) => {
        setEducationList((prev) => [
            ...prev,
            { school, major, startDate, endDate, graduated },
        ]);
    };

    // 경력 추가
    const handleAddCareer = (company, startDate, endDate, isWorking, task) => {
        setCareerList((prev) => [
            ...prev,
            { company, startDate, endDate, isWorking, task },
        ]);
    };

    // 희망 근무지 추가
    const handleAddLocation = (city, district) => {
        setLocations((prev) => [...prev, { city, district }]);
    };

    // 스킬 추가
    const handleAddSkill = () => {
        if (skillInput.trim() !== "" && !skills.includes(skillInput)) {
            setSkills((prev) => [...prev, skillInput]);
            setSkillInput("");
        }
    };
    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }
        searchAddress(query);
    }, [query]);

    // 입력한 지역명(예를 들어 강남구)에 해당하는 모든 주소 검색
    const searchAddress = (keyword) => {
        if (!window.kakao || !window.kakao.maps) {
            console.error("카카오 API가 로드되지 않음");
            return;
        }

        const places = new window.kakao.maps.services.Places();
        places.keywordSearch(keyword, (result, status) => {
            console.log("검색어:", keyword);
            console.log("API 응답 상태:", status);
            console.log("검색 결과:", result);

            if (status === window.kakao.maps.services.Status.OK) {
                setResults(result);
            } else {
                setResults([]);
                console.warn("검색 결과 없음");
            }
        });
    };

    // 리스트에서 주소 선택하면 시/구 추출
    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        setQuery("");
        setResults([]);

        // 주소 → 시/구 변환
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const { address_name } = result[0];
                setCityDistrict(extractCityDistrict(address_name));
            }
        });
    };

    // 예를 들어 강남구 검색했다면 '서울특별시 강남구' 형태로 변환
    const extractCityDistrict = (fullAddress) => {
        const parts = fullAddress.split(" ");
        return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : fullAddress;
    };


    return (
        <div>
            <h1>이력서 작성</h1>

            {/* 사용자 기본 정보 */}
            <div>
                <h2>기본 정보</h2>
                <img src={profile.photo || "default-profile.png"} alt="프로필 사진" width={100}/>
                <p>이름: {profile.name}</p>
                <p>나이: {new Date().getFullYear() - new Date(profile.birthdate).getFullYear()}세</p>
                <p>이메일: {profile.email}</p>
            </div>

            {/* 이력서 제목 */}
            <div>
                <h2>이력서 제목</h2>
                <input
                    type="text"
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    placeholder="이력서 제목을 입력하세요"
                />
            </div>

            {/* 학력사항 */}
            <div>
                <h2>학력사항</h2>
                {educationList.map((edu, index) => (
                    <p key={index}>
                        {edu.school} ({edu.major}) - {edu.startDate} ~ {edu.graduated ? edu.endDate : "재학 중"}
                    </p>
                ))}
                <button onClick={() => handleAddEducation("서울대학교", "컴퓨터공학", "2015.03", "2019.02", true)}>
                    학력 추가
                </button>
            </div>

            {/* 경력사항 */}
            <div>
                <h2>경력사항</h2>
                <label>
                    <input type="radio" checked={!isExperienced} onChange={() => setIsExperienced(false)}/> 신입
                </label>
                <label>
                    <input type="radio" checked={isExperienced} onChange={() => setIsExperienced(true)}/> 경력
                </label>
                {careerList.map((career, index) => (
                    <p key={index}>
                        {career.company} - {career.startDate} ~ {career.isWorking ? "재직 중" : career.endDate}
                    </p>
                ))}
                <button onClick={() => handleAddCareer("카카오", "2020.05", "2024.02", false, "백엔드 개발")}>
                    경력 추가
                </button>
            </div>

            {/* 희망근무조건 */}
            <div>
                <h2>희망 근무조건</h2>
                <p>근무지: {locations.map((loc) => `${loc.city} ${loc.district}`).join(", ")}</p>
                <button onClick={() => handleAddLocation("서울", "강남구")}>근무지 추가</button>

                <p>업직종: {industries.join(", ")}</p>
                <p>근무형태: {workType.join(", ")}</p>
                <p>희망 근무기간: {workingPeriod}</p>
                <p>근무일시: {workingDays.join(", ")}</p>
            </div>
            <div className="address-container">
                <h1>카카오 주소 검색</h1>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="지역명을 입력하세요 (예: 강남구)"
                    className="address-input"
                />
                <div className="address-dropdown">
                    {results.length > 0 && (
                        <ul className="address-list">
                            {results.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelectAddress(item.address_name)}
                                    className="address-item"
                                >
                                    {item.address_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <h2>선택한 주소: {selectedAddress}</h2>
                <h2>결과: {cityDistrict}</h2>
            </div>

            {/* 자기소개 및 스킬 */}
            <div>
                <h2>자기소개 & 스킬</h2>
                <textarea
                    value={introduce}
                    onChange={(e) => setIntroduce(e.target.value)}
                    placeholder="자기소개를 입력하세요"
                ></textarea>

                <h3>나의 업무 스킬</h3>
                <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="스킬 입력 후 Enter"
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                />
                <button onClick={handleAddSkill}>추가</button>
                <div>
                    {skills.map((skill, index) => (
                        <span key={index} style={{margin: "5px", padding: "5px", border: "1px solid #000"}}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Resume;
