import React, { useState, useEffect } from "react";

export const AddressModal = ({onComplete,onClose}) => {
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
                return;
            }

            const places = new window.kakao.maps.services.Places();
            places.keywordSearch(keyword, (result, status) => {

                if (status === window.kakao.maps.services.Status.OK) {
                    setResults(result);
                } else {
                    setResults([]);
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
                const {address_name} = result[0];
                const extractedCityDistrict = extractCityDistrict(address_name);
                setCityDistrict(extractedCityDistrict);

                // 부모 컴포넌트로 데이터 전달하고 모달 닫기
                onComplete({
                    fullAddress: address,
                    cityDistrict: extractedCityDistrict
                });
            }
        });
    };

        // 예를 들어 강남구 검색했다면 '서울특별시 강남구' 형태로 변환
        const extractCityDistrict = (fullAddress) => {
            const parts = fullAddress.split(" ");
            return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : fullAddress;
        };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">주소 검색</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="address-container">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="지역명을 입력하세요 (예: 강남구)"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        autoFocus
                    />
                    <div className="address-dropdown">
                        {results.length > 0 && (
                            <ul className="address-list border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                                {results.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSelectAddress(item.address_name)}
                                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                                    >
                                        {item.address_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};