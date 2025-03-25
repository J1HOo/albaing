import React, { useState, useEffect } from 'react';

const TimeTracker = () => {
    const [timeRecords, setTimeRecords] = useState([]);
    const [isTracking, setIsTracking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [hourlyWage, setHourlyWage] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        try {
            const savedRecords = localStorage.getItem('timeTrackerRecords');
            if (savedRecords) {
                setTimeRecords(JSON.parse(savedRecords));
            }

            const savedWage = localStorage.getItem('timeTrackerHourlyWage');
            if (savedWage) {
                setHourlyWage(savedWage);
            }
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    }, []);

    // 기록 저장
    const saveRecords = (records) => {
        try {
            localStorage.setItem('timeTrackerRecords', JSON.stringify(records));
            setTimeRecords(records);
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    };

    // 시급 저장
    useEffect(() => {
        if (hourlyWage) {
            try {
                localStorage.setItem('timeTrackerHourlyWage', hourlyWage);
            } catch (e) {
                console.error('LocalStorage error:', e);
            }
        }
    }, [hourlyWage]);

    // 근무 시작
    const startTracking = () => {
        const now = new Date();
        setStartTime(now);
        setIsTracking(true);
    };

    // 근무 종료
    const stopTracking = () => {
        if (!startTime) return;

        const endTime = new Date();
        const durationMs = endTime - startTime;
        const durationHours = durationMs / (1000 * 60 * 60);

        const newRecord = {
            id: Date.now(),
            date: selectedDate,
            startTime: startTime.toLocaleTimeString(),
            endTime: endTime.toLocaleTimeString(),
            durationHours,
            earnings: hourlyWage ? Number(hourlyWage) * durationHours : 0
        };

        const updatedRecords = [...timeRecords, newRecord];
        saveRecords(updatedRecords);

        setStartTime(null);
        setIsTracking(false);
    };

    // 기록 삭제
    const deleteRecord = (id) => {
        const updatedRecords = timeRecords.filter(record => record.id !== id);
        saveRecords(updatedRecords);
    };

    // 특정 날짜의 기록 필터링
    const filteredRecords = timeRecords.filter(record => record.date === selectedDate);

    // 통계 계산
    const calculateStats = () => {
        if (timeRecords.length === 0) return null;

        // 최근 7일 계산
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        const recentRecords = timeRecords.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= sevenDaysAgo;
        });

        // 이번 달 계산
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const thisMonthRecords = timeRecords.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
        });

        return {
            lastWeek: {
                totalHours: recentRecords.reduce((sum, record) => sum + record.durationHours, 0).toFixed(2),
                totalEarnings: recentRecords.reduce((sum, record) => sum + (record.earnings || 0), 0).toFixed(0)
            },
            thisMonth: {
                totalHours: thisMonthRecords.reduce((sum, record) => sum + record.durationHours, 0).toFixed(2),
                totalEarnings: thisMonthRecords.reduce((sum, record) => sum + (record.earnings || 0), 0).toFixed(0)
            },
            allTime: {
                totalHours: timeRecords.reduce((sum, record) => sum + record.durationHours, 0).toFixed(2),
                totalEarnings: timeRecords.reduce((sum, record) => sum + (record.earnings || 0), 0).toFixed(0)
            }
        };
    };

    const stats = calculateStats();

    // 시간 형식화
    const formatHours = (hours) => {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}시간 ${m}분`;
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <label htmlFor="hourlyWage" className="block text-sm font-medium text-gray-700 mb-1">
                    시급 (원)
                </label>
                <input
                    type="number"
                    id="hourlyWage"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="시급을 입력하세요"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700 mb-1">
                    날짜
                </label>
                <input
                    type="date"
                    id="selectedDate"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <div className="mb-6 flex justify-center">
                {!isTracking ? (
                    <button
                        onClick={startTracking}
                        className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        근무 시작하기
                    </button>
                ) : (
                    <button
                        onClick={stopTracking}
                        className="w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        근무 종료하기 ({startTime && startTime.toLocaleTimeString()} 부터)
                    </button>
                )}
            </div>

            {/* 통계 버튼 */}
            <div className="mb-4">
                <button
                    onClick={() => setShowStats(!showStats)}
                    className="w-full py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 flex justify-between items-center px-4"
                >
                    <span>통계 {showStats ? '숨기기' : '보기'}</span>
                    <svg className={`w-5 h-5 transform ${showStats ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* 통계 패널 */}
            {showStats && stats && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-3">근무 통계</h3>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded-md shadow-sm">
                            <p className="text-sm text-gray-500">최근 7일</p>
                            <p className="font-medium">{formatHours(parseFloat(stats.lastWeek.totalHours))}</p>
                            <p className="text-sm text-green-600">{parseInt(stats.lastWeek.totalEarnings).toLocaleString()}원</p>
                        </div>

                        <div className="bg-white p-3 rounded-md shadow-sm">
                            <p className="text-sm text-gray-500">이번 달</p>
                            <p className="font-medium">{formatHours(parseFloat(stats.thisMonth.totalHours))}</p>
                            <p className="text-sm text-green-600">{parseInt(stats.thisMonth.totalEarnings).toLocaleString()}원</p>
                        </div>

                        <div className="bg-white p-3 rounded-md shadow-sm">
                            <p className="text-sm text-gray-500">전체</p>
                            <p className="font-medium">{formatHours(parseFloat(stats.allTime.totalHours))}</p>
                            <p className="text-sm text-green-600">{parseInt(stats.allTime.totalEarnings).toLocaleString()}원</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 오늘의 기록 목록 */}
            <div>
                <h3 className="font-medium text-gray-700 mb-2">{selectedDate} 근무 기록</h3>

                {filteredRecords.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">기록이 없습니다</p>
                ) : (
                    <div className="space-y-2">
                        {filteredRecords.map((record) => (
                            <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <div>
                                    <p className="text-sm">
                                        {record.startTime} - {record.endTime}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatHours(record.durationHours)}
                                        {hourlyWage && ` · ${Math.round(record.earnings).toLocaleString()}원`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => deleteRecord(record.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimeTracker;