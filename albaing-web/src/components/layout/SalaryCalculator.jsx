import React, { useState, useEffect } from 'react';

const SalaryCalculator = ({ initialTab = 'annual' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    // 연봉 계산기 상태
    const [annualSalary, setAnnualSalary] = useState('');
    const [monthlySalary, setMonthlySalary] = useState('');
    const [afterTaxSalary, setAfterTaxSalary] = useState('');
    const [taxDetails, setTaxDetails] = useState({
        incomeTax: 0,
        nationalPension: 0,
        healthInsurance: 0,
        employmentInsurance: 0,
        longTermCareInsurance: 0,
    });

    // 월급 계산기 상태
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [monthlyAfterTax, setMonthlyAfterTax] = useState('');
    const [monthlyTaxDetails, setMonthlyTaxDetails] = useState({
        incomeTax: 0,
        nationalPension: 0,
        healthInsurance: 0,
        employmentInsurance: 0,
        longTermCareInsurance: 0,
    });

    // 시급 계산기 상태
    const [hourlyWage, setHourlyWage] = useState('');
    const [workHoursPerDay, setWorkHoursPerDay] = useState('8');
    const [workDaysPerWeek, setWorkDaysPerWeek] = useState('5');
    const [dailyWage, setDailyWage] = useState('');
    const [weeklyWage, setWeeklyWage] = useState('');
    const [monthlyWage, setMonthlyWage] = useState('');
    const [overtimeRate, setOvertimeRate] = useState('1.5');
    const [overtimeHours, setOvertimeHours] = useState('0');

    // 최신 세금 및 보험료율 (2025년 기준)
    const RATES = {
        NATIONAL_PENSION: 0.045, // 국민연금 4.5%
        HEALTH_INSURANCE: 0.0343, // 건강보험 3.43%
        EMPLOYMENT_INSURANCE: 0.008, // 고용보험 0.8%
        LONG_TERM_CARE: 0.1227, // 장기요양보험 건강보험료의 12.27%
    };

    // 소득세 계산 함수 (2025년 기준)
    const calculateIncomeTax = (annual) => {
        if (annual <= 12000000) {
            return annual * 0.06; // 6%
        } else if (annual <= 46000000) {
            return 720000 + (annual - 12000000) * 0.15; // 15%
        } else if (annual <= 88000000) {
            return 5820000 + (annual - 46000000) * 0.24; // 24%
        } else if (annual <= 150000000) {
            return 15900000 + (annual - 88000000) * 0.35; // 35%
        } else if (annual <= 300000000) {
            return 37600000 + (annual - 150000000) * 0.38; // 38%
        } else if (annual <= 500000000) {
            return 94600000 + (annual - 300000000) * 0.40; // 40%
        } else {
            return 174600000 + (annual - 500000000) * 0.42; // 42%
        }
    };

    // 연봉 계산 함수
    const calculateSalaryDetails = () => {
        if (!annualSalary || isNaN(annualSalary)) return;

        const annual = Number(annualSalary);
        const monthly = Math.floor(annual / 12);
        setMonthlySalary(monthly.toLocaleString());

        // 세금 계산
        const nationalPension = Math.floor(monthly * RATES.NATIONAL_PENSION);
        const healthInsurance = Math.floor(monthly * RATES.HEALTH_INSURANCE);
        const longTermCareInsurance = Math.floor(healthInsurance * RATES.LONG_TERM_CARE);
        const employmentInsurance = Math.floor(monthly * RATES.EMPLOYMENT_INSURANCE);

        // 소득세 계산 (월 단위로 환산)
        const yearlyIncomeTax = calculateIncomeTax(annual);
        const incomeTax = Math.floor(yearlyIncomeTax / 12);

        const totalDeduction = nationalPension + healthInsurance + longTermCareInsurance + employmentInsurance + incomeTax;
        const afterTax = monthly - totalDeduction;

        setTaxDetails({
            incomeTax,
            nationalPension,
            healthInsurance,
            employmentInsurance,
            longTermCareInsurance,
        });

        setAfterTaxSalary(afterTax.toLocaleString());
    };

    // 월급 계산 함수
    const calculateMonthlyDetails = () => {
        if (!monthlyIncome || isNaN(monthlyIncome)) return;

        const monthly = Number(monthlyIncome);
        const annual = monthly * 12;

        // 세금 계산
        const nationalPension = Math.floor(monthly * RATES.NATIONAL_PENSION);
        const healthInsurance = Math.floor(monthly * RATES.HEALTH_INSURANCE);
        const longTermCareInsurance = Math.floor(healthInsurance * RATES.LONG_TERM_CARE);
        const employmentInsurance = Math.floor(monthly * RATES.EMPLOYMENT_INSURANCE);

        // 소득세 계산 (월 단위로 환산)
        const yearlyIncomeTax = calculateIncomeTax(annual);
        const incomeTax = Math.floor(yearlyIncomeTax / 12);

        const totalDeduction = nationalPension + healthInsurance + longTermCareInsurance + employmentInsurance + incomeTax;
        const afterTax = monthly - totalDeduction;

        setMonthlyTaxDetails({
            incomeTax,
            nationalPension,
            healthInsurance,
            employmentInsurance,
            longTermCareInsurance,
        });

        setMonthlyAfterTax(afterTax.toLocaleString());
    };

    // 시급 계산 함수
    const calculateHourlyWage = () => {
        if (!hourlyWage || isNaN(hourlyWage)) return;

        const hourly = Number(hourlyWage);
        const hours = Number(workHoursPerDay);
        const days = Number(workDaysPerWeek);
        const overtime = Number(overtimeHours);
        const overtimeMultiplier = Number(overtimeRate);

        // 일반 근무 시간에 대한 급여 계산
        const regularHourlyPay = hourly * hours;

        // 초과 근무에 대한 급여 계산
        const overtimePay = hourly * overtime * overtimeMultiplier;

        // 일급 계산 (일반 + 초과)
        const daily = regularHourlyPay + overtimePay;

        // 주급 계산
        const weekly = daily * days;

        // 월급 계산 (평균 4.345주/월 사용)
        const monthly = weekly * 4.345;

        setDailyWage(daily.toLocaleString());
        setWeeklyWage(weekly.toLocaleString());
        setMonthlyWage(monthly.toLocaleString());
    };

    // 입력값 변경시 계산 실행
    useEffect(() => {
        calculateSalaryDetails();
    }, [annualSalary]);

    useEffect(() => {
        calculateMonthlyDetails();
    }, [monthlyIncome]);

    useEffect(() => {
        calculateHourlyWage();
    }, [hourlyWage, workHoursPerDay, workDaysPerWeek, overtimeHours, overtimeRate]);

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white">
                <h2 className="text-xl font-bold text-center">급여 계산기</h2>
            </div>

            {/* 탭 네비게이션 */}
            <div className="grid grid-cols-3 border-b">
                <button
                    className={`py-3 font-medium text-center ${
                        activeTab === 'annual'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('annual')}
                >
                    연봉 계산기
                </button>
                <button
                    className={`py-3 font-medium text-center ${
                        activeTab === 'monthly'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('monthly')}
                >
                    월급 계산기
                </button>
                <button
                    className={`py-3 font-medium text-center ${
                        activeTab === 'hourly'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('hourly')}
                >
                    시급 계산기
                </button>
            </div>

            {/* 연봉 계산기 컨텐츠 */}
            {activeTab === 'annual' && (
                <div className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            연봉 (원)
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={annualSalary}
                            onChange={(e) => setAnnualSalary(e.target.value)}
                            placeholder="연봉을 입력하세요"
                        />
                    </div>

                    {monthlySalary && (
                        <div className="mt-6 space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-lg text-blue-800 mb-2">계산 결과</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-sm text-gray-500">월 급여</p>
                                        <p className="font-bold text-lg">{monthlySalary}원</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">월 실수령액</p>
                                        <p className="font-bold text-lg">{afterTaxSalary}원</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold mb-2">공제 내역</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">소득세</span>
                                        <span>{taxDetails.incomeTax.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">국민연금 (4.5%)</span>
                                        <span>{taxDetails.nationalPension.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">건강보험 (3.43%)</span>
                                        <span>{taxDetails.healthInsurance.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">장기요양보험 (건강보험의 12.27%)</span>
                                        <span>{taxDetails.longTermCareInsurance.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">고용보험 (0.8%)</span>
                                        <span>{taxDetails.employmentInsurance.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t mt-2">
                                        <span className="font-semibold">총 공제액</span>
                                        <span className="font-semibold">
                                          {(
                                              taxDetails.incomeTax +
                                              taxDetails.nationalPension +
                                              taxDetails.healthInsurance +
                                              taxDetails.longTermCareInsurance +
                                              taxDetails.employmentInsurance
                                          ).toLocaleString()}원
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 mt-2">
                                * 상기 금액은 개인 상황에 따라 달라질 수 있으며, 대략적인 참고 자료입니다.
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 월급 계산기 컨텐츠 */}
            {activeTab === 'monthly' && (
                <div className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            월급 (원)
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(e.target.value)}
                            placeholder="월급을 입력하세요"
                        />
                    </div>

                    {monthlyAfterTax && (
                        <div className="mt-6 space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-lg text-blue-800 mb-2">계산 결과</h3>
                                <div>
                                    <p className="text-sm text-gray-500">월 실수령액</p>
                                    <p className="font-bold text-lg">{monthlyAfterTax}원</p>
                                </div>
                            </div>

                            <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold mb-2">공제 내역</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">소득세</span>
                                        <span>{monthlyTaxDetails.incomeTax.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">국민연금 (4.5%)</span>
                                        <span>{monthlyTaxDetails.nationalPension.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">건강보험 (3.43%)</span>
                                        <span>{monthlyTaxDetails.healthInsurance.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">장기요양보험 (건강보험의 12.27%)</span>
                                        <span>{monthlyTaxDetails.longTermCareInsurance.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">고용보험 (0.8%)</span>
                                        <span>{monthlyTaxDetails.employmentInsurance.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t mt-2">
                                        <span className="font-semibold">총 공제액</span>
                                        <span className="font-semibold">
                                          {(
                                              monthlyTaxDetails.incomeTax +
                                              monthlyTaxDetails.nationalPension +
                                              monthlyTaxDetails.healthInsurance +
                                              monthlyTaxDetails.longTermCareInsurance +
                                              monthlyTaxDetails.employmentInsurance
                                          ).toLocaleString()}원
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 mt-2">
                                * 상기 금액은 개인 상황에 따라 달라질 수 있으며, 대략적인 참고 자료입니다.
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 시급 계산기 컨텐츠 */}
            {activeTab === 'hourly' && (
                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                시급 (원)
                            </label>
                            <input
                                type="number"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={hourlyWage}
                                onChange={(e) => setHourlyWage(e.target.value)}
                                placeholder="시급을 입력하세요"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    일일 근무시간
                                </label>
                                <select
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={workHoursPerDay}
                                    onChange={(e) => setWorkHoursPerDay(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hours) => (
                                        <option key={hours} value={hours}>
                                            {hours}시간
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    주당 근무일수
                                </label>
                                <select
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={workDaysPerWeek}
                                    onChange={(e) => setWorkDaysPerWeek(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                                        <option key={days} value={days}>
                                            {days}일
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    일일 초과근무 시간
                                </label>
                                <select
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={overtimeHours}
                                    onChange={(e) => setOvertimeHours(e.target.value)}
                                >
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                                        <option key={hours} value={hours}>
                                            {hours}시간
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    초과근무 할증률
                                </label>
                                <select
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={overtimeRate}
                                    onChange={(e) => setOvertimeRate(e.target.value)}
                                >
                                    <option value="1.5">1.5배 (50% 할증)</option>
                                    <option value="2">2배 (100% 할증)</option>
                                    <option value="2.5">2.5배 (150% 할증)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {hourlyWage && (
                        <div className="mt-6">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-lg text-blue-800 mb-2">계산 결과</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">일급</p>
                                        <p className="font-bold text-lg">{dailyWage}원</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">주급</p>
                                        <p className="font-bold text-lg">{weeklyWage}원</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">월급</p>
                                        <p className="font-bold text-lg">{monthlyWage}원</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                                <h3 className="font-semibold text-lg text-yellow-800 mb-2">참고사항</h3>
                                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                                    <li>월급은 주 {workDaysPerWeek}일, 하루 {workHoursPerDay}시간 근무 기준으로 계산됩니다.</li>
                                    <li>초과근무는 하루 {overtimeHours}시간, {overtimeRate}배율로 계산됩니다.</li>
                                    <li>상기 금액은 세전 금액이며, 실제 수령액은 세금 공제 후 달라질 수 있습니다.</li>
                                    <li>월급 계산 시 한 달을 4.345주로 계산합니다 (365일 ÷ 12개월 ÷ 7일).</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SalaryCalculator;