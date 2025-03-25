import React, { useState } from 'react';
import SalaryCalculator from '../../components/layout/SalaryCalculator';
import WageChecker from '../../components/layout/WageChecker';
import TimeTracker from '../../components/layout/TimeTracker';
import CommuteCalculator from '../../components/layout/CommuteCalculator';
import FloatingRemote from '../../components/layout/FloatingRemote';

const CalculatorPage = () => {
    const [activeTab, setActiveTab] = useState('salary');

    // 탭 데이터
    const tabs = [
        { id: 'salary', label: '급여 계산기', icon: 'calculator', description: '연봉, 월급, 시급 기준 급여 계산' },
        { id: 'wage', label: '최저임금 체크', icon: 'check', description: '제안 금액의 최저임금 충족 여부 확인' },
        { id: 'time', label: '근무 시간 기록', icon: 'clock', description: '출퇴근 시간 기록 및 급여 계산' },
        { id: 'commute', label: '통근 계산기', icon: 'location', description: '출퇴근 시간 및 비용 계산' },
    ];

    // 아이콘 렌더링 함수
    const renderIcon = (iconName) => {
        switch (iconName) {
            case 'calculator':
                return (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
            case 'check':
                return (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'clock':
                return (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'location':
                return (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    // 탭 컨텐츠 렌더링
    const renderTabContent = () => {
        switch (activeTab) {
            case 'salary':
                return <SalaryCalculator />;
            case 'wage':
                return <WageChecker />;
            case 'time':
                return <TimeTracker />;
            case 'commute':
                return <CommuteCalculator />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* 헤더 배너 */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 py-12 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        알바잉 계산기
                    </h1>
                    <p className="text-blue-100 text-lg max-w-3xl mx-auto">
                        급여, 근무 시간, 통근 시간까지 - 알바잉에서 제공하는 다양한 계산기로
                        근무 생활을 더 스마트하게 관리하세요.
                    </p>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <main className="max-w-6xl mx-auto px-4 -mt-10">
                {/* 탭 네비게이션 카드 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`p-4 text-left flex items-center ${
                                    activeTab === tab.id
                                        ? 'bg-blue-50 border-t-2 md:border-t-0 md:border-l-2 border-blue-600'
                                        : 'hover:bg-gray-50'
                                } transition-colors`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <div className={`p-2 rounded-full mr-3 ${
                                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {renderIcon(tab.icon)}
                                </div>
                                <div>
                                    <h3 className={`font-medium ${
                                        activeTab === tab.id ? 'text-blue-800' : 'text-gray-800'
                                    }`}>
                                        {tab.label}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">{tab.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 활성 탭 컨텐츠 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 p-6">
                    <div className="max-w-3xl mx-auto">
                        {renderTabContent()}
                    </div>
                </div>

                {/* 정보 섹션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            급여 계산 도움말
                        </h2>
                        <div className="space-y-3">
                            <p className="text-gray-700">
                                <strong>연봉 계산:</strong> 세전 연봉을 입력하면 월 급여, 세금 및 4대 보험료 공제 후 실수령액이 계산됩니다.
                            </p>
                            <p className="text-gray-700">
                                <strong>월급 계산:</strong> 월 급여를 입력하면 세금 및 4대 보험료 공제 후 실수령액이 계산됩니다.
                            </p>
                            <p className="text-gray-700">
                                <strong>시급 계산:</strong> 시급, 근무 시간, 초과 근무 등을 입력하면 일급, 주급, 월급이 계산됩니다.
                            </p>
                            <p className="text-gray-700">
                                <strong>최저임금 체크:</strong> 제안받은 급여가 법정 최저임금 이상인지 확인할 수 있습니다.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            2025년 최저임금 정보
                        </h2>
                        <div className="mt-3 space-y-2">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-700">시급</span>
                                <span className="font-medium">10,280원</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-700">일급 (8시간 기준)</span>
                                <span className="font-medium">82,240원</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-700">월급 (209시간 기준)</span>
                                <span className="font-medium">2,148,520원</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-gray-700">연장근로수당</span>
                                <span className="font-medium">시급의 1.5배 (15,420원)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 자주 묻는 질문 */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-12">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">자주 묻는 질문</h2>

                    <div className="space-y-4">
                        <details className="group border rounded-lg overflow-hidden">
                            <summary className="flex justify-between items-center p-4 cursor-pointer">
                                <h3 className="font-medium text-gray-800">실수령액은 어떻게 계산되나요?</h3>
                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="p-4 border-t bg-gray-50">
                                <p className="text-gray-700">실수령액은 총급여에서 국민연금(4.5%), 건강보험(3.43%), 장기요양보험(건강보험의 12.27%), 고용보험(0.8%), 소득세, 지방소득세 등을 공제한 금액입니다. 소득세는 연소득 구간에 따라 6%~42%까지 차등 적용됩니다.</p>
                            </div>
                        </details>

                        <details className="group border rounded-lg overflow-hidden">
                            <summary className="flex justify-between items-center p-4 cursor-pointer">
                                <h3 className="font-medium text-gray-800">초과근무수당은 어떻게 계산되나요?</h3>
                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="p-4 border-t bg-gray-50">
                                <p className="text-gray-700">초과근무수당은 기본 시급의 1.5배를 적용합니다. 연장근로(하루 8시간 초과), 야간근로(오후 10시~오전 6시), 휴일근로에 대해 기본급의 50%를 가산하여 지급합니다. 야간 및 휴일 연장근로의 경우 중복 가산될 수 있습니다.</p>
                            </div>
                        </details>

                        <details className="group border rounded-lg overflow-hidden">
                            <summary className="flex justify-between items-center p-4 cursor-pointer">
                                <h3 className="font-medium text-gray-800">월급에서 제외되는 공제 항목은 무엇인가요?</h3>
                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="p-4 border-t bg-gray-50">
                                <p className="text-gray-700">주요 공제 항목은 다음과 같습니다:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>국민연금: 월 급여의 4.5% (사업주도 4.5% 부담)</li>
                                    <li>건강보험: 월 급여의 3.43% (사업주도 3.43% 부담)</li>
                                    <li>장기요양보험: 건강보험료의 12.27%</li>
                                    <li>고용보험: 월 급여의 0.8% (사업주는 0.8%~1.5% 부담)</li>
                                    <li>소득세: 소득 구간별 6%~42% 차등 적용</li>
                                    <li>지방소득세: 소득세의 10%</li>
                                </ul>
                            </div>
                        </details>
                    </div>
                </div>
            </main>

            {/* 플로팅 리모컨 */}
            <FloatingRemote />
        </div>
    );
};

export default CalculatorPage;