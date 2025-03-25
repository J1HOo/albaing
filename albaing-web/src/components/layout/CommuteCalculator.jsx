import React, { useState, useEffect } from 'react';

const CommuteCalculator = () => {
    const [distance, setDistance] = useState('');
    const [transportType, setTransportType] = useState('public');
    const [workingDays, setWorkingDays] = useState('22');
    const [result, setResult] = useState(null);
    const [savedRoutes, setSavedRoutes] = useState([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('savedCommuteRoutes');
            if (saved) {
                setSavedRoutes(JSON.parse(saved));
            }
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    }, []);

    // 교통수단별 평균 소요시간 (분/km) 및 비용 (원/km)
    const transportData = {
        public: { time: 3, cost: 100 }, // 대중교통 (버스, 지하철)
        car: { time: 1.5, cost: 200 },  // 자가용
        taxi: { time: 1.5, cost: 1000 }, // 택시
        bike: { time: 4, cost: 0 },     // 자전거
        walk: { time: 12, cost: 0 }     // 도보
    };

    // 결과 계산
    const calculateResult = () => {
        if (!distance || isNaN(distance) || Number(distance) <= 0) {
            return;
        }

        const distanceValue = Number(distance);
        const days = Number(workingDays);
        const data = transportData[transportType];

        // 편도 계산
        const oneWayTime = Math.round(distanceValue * data.time);
        const oneWayCost = Math.round(distanceValue * data.cost);

        // 일일 계산 (왕복)
        const dailyTime = oneWayTime * 2;
        const dailyCost = oneWayCost * 2;

        // 월간 계산
        const monthlyTime = dailyTime * days;
        const monthlyCost = dailyCost * days;

        // 연간 계산
        const yearlyTime = monthlyTime * 12;
        const yearlyCost = monthlyCost * 12;

        setResult({
            oneWay: {
                time: oneWayTime,
                cost: oneWayCost
            },
            daily: {
                time: dailyTime,
                cost: dailyCost
            },
            monthly: {
                time: monthlyTime,
                cost: monthlyCost
            },
            yearly: {
                time: yearlyTime,
                cost: yearlyCost
            }
        });
    };

    // 경로 저장
    const saveRoute = () => {
        if (!distance || !result) return;

        const newRoute = {
            id: Date.now(),
            name: prompt('이 경로의 이름을 입력하세요 (예: 집-회사)') || '저장된 경로',
            distance,
            transportType,
            workingDays,
            result
        };

        const updatedRoutes = [...savedRoutes, newRoute];
        setSavedRoutes(updatedRoutes);

        try {
            localStorage.setItem('savedCommuteRoutes', JSON.stringify(updatedRoutes));
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    };

    // 저장된 경로 불러오기
    const loadRoute = (route) => {
        setDistance(route.distance);
        setTransportType(route.transportType);
        setWorkingDays(route.workingDays);
        setResult(route.result);
    };

    // 저장된 경로 삭제
    const deleteRoute = (id) => {
        const updatedRoutes = savedRoutes.filter(route => route.id !== id);
        setSavedRoutes(updatedRoutes);

        try {
            localStorage.setItem('savedCommuteRoutes', JSON.stringify(updatedRoutes));
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    };

    // 시간 표시 형식화 (분 -> 시간:분)
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) {
            return `${mins}분`;
        } else {
            return `${hours}시간 ${mins}분`;
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
                    통근 거리 (km)
                </label>
                <input
                    type="number"
                    id="distance"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="집에서 직장까지의 거리"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    교통수단
                </label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        className={`py-2 rounded-md text-sm ${transportType === 'public' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setTransportType('public')}
                    >
                        대중교통
                    </button>
                    <button
                        className={`py-2 rounded-md text-sm ${transportType === 'car' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setTransportType('car')}
                    >
                        자가용
                    </button>
                    <button
                        className={`py-2 rounded-md text-sm ${transportType === 'taxi' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setTransportType('taxi')}
                    >
                        택시
                    </button>
                    <button
                        className={`py-2 rounded-md text-sm ${transportType === 'bike' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setTransportType('bike')}
                    >
                        자전거
                    </button>
                    <button
                        className={`py-2 rounded-md text-sm ${transportType === 'walk' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setTransportType('walk')}
                    >
                        도보
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="workingDays" className="block text-sm font-medium text-gray-700 mb-1">
                    월 출근일수
                </label>
                <select
                    id="workingDays"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={workingDays}
                    onChange={(e) => setWorkingDays(e.target.value)}
                >
                    {[...Array(31)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1}일
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-6">
                <button
                    onClick={calculateResult}
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    계산하기
                </button>
            </div>

            {result && (
                <div className="mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-blue-800">통근 시간 및 비용</h3>
                            <button
                                onClick={saveRoute}
                                className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                            >
                                경로 저장
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-md shadow-sm">
                                <p className="text-sm text-gray-500">편도</p>
                                <p className="font-medium">{formatTime(result.oneWay.time)}</p>
                                <p className="text-sm text-green-600">{result.oneWay.cost.toLocaleString()}원</p>
                            </div>

                            <div className="bg-white p-3 rounded-md shadow-sm">
                                <p className="text-sm text-gray-500">일일 (왕복)</p>
                                <p className="font-medium">{formatTime(result.daily.time)}</p>
                                <p className="text-sm text-green-600">{result.daily.cost.toLocaleString()}원</p>
                            </div>

                            <div className="bg-white p-3 rounded-md shadow-sm">
                                <p className="text-sm text-gray-500">월간 ({workingDays}일)</p>
                                <p className="font-medium">{formatTime(result.monthly.time)}</p>
                                <p className="text-sm text-green-600">{result.monthly.cost.toLocaleString()}원</p>
                            </div>

                            <div className="bg-white p-3 rounded-md shadow-sm">
                                <p className="text-sm text-gray-500">연간</p>
                                <p className="font-medium">{formatTime(result.yearly.time)}</p>
                                <p className="text-sm text-green-600">{result.yearly.cost.toLocaleString()}원</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {savedRoutes.length > 0 && (
                <div>
                    <h3 className="font-medium text-gray-700 mb-2">저장된 경로</h3>
                    <div className="space-y-2">
                        {savedRoutes.map((route) => (
                            <div key={route.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{route.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {route.distance}km ·
                                        {route.transportType === 'public' ? ' 대중교통' :
                                            route.transportType === 'car' ? ' 자가용' :
                                                route.transportType === 'taxi' ? ' 택시' :
                                                    route.transportType === 'bike' ? ' 자전거' : ' 도보'}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => loadRoute(route)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => deleteRoute(route.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommuteCalculator;