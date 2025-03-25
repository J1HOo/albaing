import React, { useState, useEffect } from 'react';

const WageChecker = () => {
    // 최저임금 정보 (2025년 기준 예상)
    const MINIMUM_WAGE = {
        HOURLY: 10280, // 2025년 예상 시급
        DAILY: 82240,  // 8시간 기준
        MONTHLY: 2148520 // 209시간 기준
    };

    const [wageType, setWageType] = useState('hourly');
    const [wage, setWage] = useState('');
    const [hours, setHours] = useState('8');
    const [days, setDays] = useState('5');
    const [result, setResult] = useState(null);

    // 결과 계산
    useEffect(() => {
        if (!wage || isNaN(wage) || Number(wage) <= 0) {
            setResult(null);
            return;
        }

        const wageAmount = Number(wage);
        let minimumRequired = 0;
        let actualAmount = 0;
        let comparisonPhrase = '';
        let isBelowMinimum = false;

        switch (wageType) {
            case 'hourly':
                minimumRequired = MINIMUM_WAGE.HOURLY;
                actualAmount = wageAmount;
                isBelowMinimum = wageAmount < minimumRequired;
                comparisonPhrase = isBelowMinimum
                    ? `시급이 최저임금보다 ${(minimumRequired - wageAmount).toLocaleString()}원 적습니다`
                    : `시급이 최저임금보다 ${(wageAmount - minimumRequired).toLocaleString()}원 많습니다`;
                break;

            case 'daily':
                const hoursPerDay = Number(hours);
                minimumRequired = MINIMUM_WAGE.HOURLY * hoursPerDay;
                actualAmount = wageAmount;
                isBelowMinimum = wageAmount < minimumRequired;
                comparisonPhrase = isBelowMinimum
                    ? `일급이 최저임금보다 ${(minimumRequired - wageAmount).toLocaleString()}원 적습니다`
                    : `일급이 최저임금보다 ${(wageAmount - minimumRequired).toLocaleString()}원 많습니다`;
                break;

            case 'monthly':
                const hoursPerMonth = Number(hours) * Number(days) * 4.345; // 한달 평균 주수
                minimumRequired = MINIMUM_WAGE.HOURLY * hoursPerMonth;
                actualAmount = wageAmount;
                isBelowMinimum = wageAmount < minimumRequired;
                comparisonPhrase = isBelowMinimum
                    ? `월급이 최저임금보다 ${(minimumRequired - wageAmount).toLocaleString()}원 적습니다`
                    : `월급이 최저임금보다 ${(wageAmount - minimumRequired).toLocaleString()}원 많습니다`;
                break;

            default:
                break;
        }

        // 환산 시급 계산
        let convertedHourly = 0;
        if (wageType === 'daily') {
            convertedHourly = wageAmount / Number(hours);
        } else if (wageType === 'monthly') {
            convertedHourly = wageAmount / (Number(hours) * Number(days) * 4.345);
        } else {
            convertedHourly = wageAmount;
        }

        setResult({
            isBelowMinimum,
            minimumRequired: minimumRequired.toLocaleString(),
            actualAmount: actualAmount.toLocaleString(),
            comparisonPhrase,
            convertedHourly: convertedHourly.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        });
    }, [wage, wageType, hours, days]);

    return (
        <div className="p-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">급여 유형</label>
                <div className="flex space-x-2">
                    <button
                        className={`flex-1 py-2 px-3 rounded-md text-sm ${
                            wageType === 'hourly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setWageType('hourly')}
                    >
                        시급
                    </button>
                    <button
                        className={`flex-1 py-2 px-3 rounded-md text-sm ${
                            wageType === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setWageType('daily')}
                    >
                        일급
                    </button>
                    <button
                        className={`flex-1 py-2 px-3 rounded-md text-sm ${
                            wageType === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setWageType('monthly')}
                    >
                        월급
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="wage" className="block text-sm font-medium text-gray-700 mb-1">
                    {wageType === 'hourly' ? '시급' : wageType === 'daily' ? '일급' : '월급'} (원)
                </label>
                <input
                    type="number"
                    id="wage"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder={`${wageType === 'hourly' ? '시급' : wageType === 'daily' ? '일급' : '월급'}을 입력하세요`}
                    value={wage}
                    onChange={(e) => setWage(e.target.value)}
                />
            </div>

            {wageType === 'daily' && (
                <div className="mb-4">
                    <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                        일일 근무시간
                    </label>
                    <select
                        id="hours"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                            <option key={h} value={h}>
                                {h}시간
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {wageType === 'monthly' && (
                <>
                    <div className="mb-4">
                        <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                            일일 근무시간
                        </label>
                        <select
                            id="hours"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                                <option key={h} value={h}>
                                    {h}시간
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
                            주당 근무일수
                        </label>
                        <select
                            id="days"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                        >
                            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                                <option key={d} value={d}>
                                    {d}일
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {result && (
                <div className={`mt-6 p-4 rounded-lg ${result.isBelowMinimum ? 'bg-red-50' : 'bg-green-50'}`}>
                    <h3 className={`text-lg font-semibold ${result.isBelowMinimum ? 'text-red-700' : 'text-green-700'}`}>
                        {result.isBelowMinimum ? '최저임금 미달' : '최저임금 이상'}
                    </h3>

                    <div className="mt-3 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">최저임금 기준:</span>
                            <span className="font-medium">{result.minimumRequired}원</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">제안 받은 금액:</span>
                            <span className="font-medium">{result.actualAmount}원</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">시급으로 환산:</span>
                            <span className="font-medium">{result.convertedHourly}원/시간</span>
                        </div>
                    </div>

                    <div className={`mt-4 text-sm ${result.isBelowMinimum ? 'text-red-700' : 'text-green-700'}`}>
                        {result.comparisonPhrase}
                    </div>

                    {result.isBelowMinimum && (
                        <div className="mt-4 text-sm text-red-600 bg-red-100 p-2 rounded">
                            <p className="font-medium">주의!</p>
                            <p>제안받은 금액은 법정 최저임금에 미달합니다. 고용주와 협의하거나 다른 일자리를 알아보는 것이 좋습니다.</p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
                <p>※ 2025년 기준 최저임금: 시급 10,280원</p>
                <p>※ 일급 82,240원 (8시간 기준), 월급 2,148,520원 (209시간 기준)</p>
            </div>
        </div>
    );
};

export default WageChecker;