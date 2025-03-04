import React, { useState, useEffect } from "react";
import "./Address.css";

const Address = () => {
    const [query, setQuery] = useState(""); // 입력한 검색어
    const [results, setResults] = useState([]); // 검색 결과 리스트
    const [selectedAddress, setSelectedAddress] = useState(""); // 선택한 주소
    const [cityDistrict, setCityDistrict] = useState(""); // 시/구 형태 변환 결과

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
    );
};

export default Address;
