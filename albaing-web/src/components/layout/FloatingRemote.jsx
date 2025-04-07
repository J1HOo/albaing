import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../components/modals/Modal';
import SalaryCalculator from './SalaryCalculator';
import {Link, useNavigate} from 'react-router-dom';
import QuickSearch from './QuickSearch';
import TimeTracker from './TimeTracker';
import WageChecker from './WageChecker';
import CommuteCalculator from './CommuteCalculator';

const FloatingRemote = () => {
    const [openModal, setOpenModal] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('calculator');
    const navigate = useNavigate();

    // 챗봇 관련 상태
    const [messages, setMessages] = useState([{ sender: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" }]);
    const [chatInput, setChatInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const closeModalHandler = () => setOpenModal(null);

    const [recentUsage, setRecentUsage] = useState(() => {
        try {
            const saved = localStorage.getItem('recentRemoteUsage');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('LocalStorage error:', e);
            return {};
        }
    });

    const trackUsage = (feature) => {
        const updated = {
            ...recentUsage,
            [feature]: Date.now()
        };
        setRecentUsage(updated);
        try {
            localStorage.setItem('recentRemoteUsage', JSON.stringify(updated));
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    };

    const getFrequentFeatures = () => {
        return Object.entries(recentUsage)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([feature]) => feature);
    };

    // 챗봇 메시지 전송 함수
    const sendChatMessage = () => {
        if (!chatInput.trim()) return;

        const userMessage = { sender: "user", text: chatInput };
        const currentInput = chatInput;

        setMessages(prevMessages => [...prevMessages, userMessage]);
        setChatInput("");
        setIsLoading(true);
        trackUsage('chatbot');

        // axios & promise 방식 사용 (async/await 사용 금지)
        axios.post("http://localhost:8080/chatbot/dialogflow", null, {
            params: { sessionId: "user-" + Date.now(), message: currentInput }
        })
            .then(response => {
                const botReply = response.data.response;
                setMessages(prevMessages => [...prevMessages, {
                    sender: "bot",
                    text: botReply
                }]);
            })
            .catch(error => {
                console.error("Error:", error);
                setMessages(prevMessages => [...prevMessages, {
                    sender: "bot",
                    text: "오류가 발생했어요. 다시 시도해주세요."
                }]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const tabs = [
        { id: 'calculator', label: '계산기', icon: 'calculator' },
        { id: 'search', label: '채용검색', icon: 'search' },
        { id: 'chatbot', label: '챗봇', icon: 'chat' },
        { id: 'tools', label: '도구', icon: 'tools' },
        { id: 'recent', label: '최근', icon: 'clock' }
    ];

    const renderIcon = (iconName) => {
        switch (iconName) {
            case 'calculator':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
            case 'search':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                );
            case 'chat':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                );
            case 'tools':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'clock':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'calculator':
                return (
                    <div className="p-4 space-y-3">
                        <button
                            onClick={() => {
                                setOpenModal('annual');
                                trackUsage('annual');
                            }}
                            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            연봉 계산기
                        </button>
                        <button
                            onClick={() => {
                                setOpenModal('hourly');
                                trackUsage('hourly');
                            }}
                            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            시급 계산기
                        </button>
                        <button
                            onClick={() => {
                                setOpenModal('monthly');
                                trackUsage('monthly');
                            }}
                            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            월급 계산기
                        </button>
                        <button
                            onClick={() => {
                                setOpenModal('wage-checker');
                                trackUsage('wage-checker');
                            }}
                            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            최저임금 체크
                        </button>
                        <div className="pt-2 border-t mt-2">
                            <a
                                href="/calculator"
                                className="flex justify-between items-center text-blue-600 hover:text-blue-800"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/calculator');
                                    setIsMenuOpen(false);
                                    trackUsage('salary-page');
                                }}
                            >
                                <span>상세 계산기 페이지</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                );
            case 'search':
                return (
                    <div className="p-4">
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">빠른 채용 검색</h3>
                            <QuickSearch
                                onSearch={(term) => {
                                    navigate(`/jobs?search=${term}`);
                                    setIsMenuOpen(false);
                                    trackUsage('job-search');
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-600">인기 검색어</h3>
                            <div className="flex flex-wrap gap-2">
                                {['프론트엔드', '마케팅', '디자인', '경영지원', '영업'].map(term => (
                                    <button
                                        key={term}
                                        onClick={() => {
                                            navigate(`/jobs?search=${term}`);
                                            setIsMenuOpen(false);
                                            trackUsage('popular-search');
                                        }}
                                        className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'chatbot':
                return (
                    <div className="flex flex-col h-96">
                        {/* 채팅 메시지 영역 */}
                        <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-3">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`max-w-3/4 p-3 rounded-lg ${
                                        msg.sender === "user"
                                            ? "self-end bg-blue-600 text-white"
                                            : "self-start bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="self-start bg-gray-100 text-gray-800 p-3 rounded-lg flex items-center space-x-2">
                                    <span>처리 중</span>
                                    <span className="flex">
                                        <span className="animate-bounce">.</span>
                                        <span className="animate-bounce delay-100">.</span>
                                        <span className="animate-bounce delay-200">.</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* 입력 영역 */}
                        <div className="border-t border-gray-200 p-3 flex">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="메시지를 입력하세요..."
                                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendChatMessage}
                                disabled={isLoading}
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* 전체 화면 링크 */}
                        <div className="border-t border-gray-200 p-2">
                            <Link
                                to="/chatbot"
                                className="flex justify-between items-center text-sm text-blue-600 hover:text-blue-800"
                                onClick={() => trackUsage('chatbot-fullscreen')}
                            >
                                <span>전체 화면에서 채팅하기</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                );
            case 'tools':
                return (
                    <div className="p-4 space-y-3">
                        <button
                            onClick={() => {
                                setOpenModal('time-tracker');
                                trackUsage('time-tracker');
                            }}
                            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            출퇴근 시간 기록기
                        </button>
                        <button
                            onClick={() => {
                                setOpenModal('commute-calculator');
                                trackUsage('commute-calculator');
                            }}
                            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            통근 시간 계산기
                        </button>
                        <button
                            onClick={() => {
                                navigate('/resumes');
                                setIsMenuOpen(false);
                                trackUsage('resume-check');
                            }}
                            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            이력서 체크리스트
                        </button>
                    </div>
                );
            case 'recent':
                return (
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-3">최근 사용한 기능</h3>
                        <div className="space-y-2">
                            {getFrequentFeatures().length > 0 ? (
                                getFrequentFeatures().map(feature => {
                                    // 각 기능별 버튼 표시
                                    let buttonText = '';
                                    let action = () => {};

                                    switch(feature) {
                                        case 'annual':
                                            buttonText = '연봉 계산기';
                                            action = () => setOpenModal('annual');
                                            break;
                                        case 'monthly':
                                            buttonText = '월급 계산기';
                                            action = () => setOpenModal('monthly');
                                            break;
                                        case 'hourly':
                                            buttonText = '시급 계산기';
                                            action = () => setOpenModal('hourly');
                                            break;
                                        case 'wage-checker':
                                            buttonText = '최저임금 체크';
                                            action = () => setOpenModal('wage-checker');
                                            break;
                                        case 'time-tracker':
                                            buttonText = '출퇴근 시간 기록기';
                                            action = () => setOpenModal('time-tracker');
                                            break;
                                        case 'commute-calculator':
                                            buttonText = '통근 시간 계산기';
                                            action = () => setOpenModal('commute-calculator');
                                            break;
                                        case 'job-search':
                                            buttonText = '채용 검색';
                                            action = () => {
                                                setActiveTab('search');
                                            };
                                            break;
                                        case 'resume-check':
                                            buttonText = '이력서 체크리스트';
                                            action = () => navigate('/resume/check');
                                            break;
                                        case 'salary-page':
                                            buttonText = '상세 계산기 페이지';
                                            action = () => navigate('/calculator');
                                            break;
                                        case 'chatbot':
                                            buttonText = '챗봇';
                                            action = () => setActiveTab('chatbot');
                                            break;
                                        case 'chatbot-fullscreen':
                                            buttonText = '전체화면 챗봇';
                                            action = () => navigate('/chatbot');
                                            break;
                                        default:
                                            buttonText = feature;
                                            break;
                                    }

                                    return (
                                        <button
                                            key={feature}
                                            onClick={() => {
                                                action();
                                                trackUsage(feature);
                                                feature.includes('page') && setIsMenuOpen(false);
                                            }}
                                            className="w-full py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-left"
                                        >
                                            {buttonText}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-500">최근 사용 기록이 없습니다.</p>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* 플로팅 빠른 메뉴 버튼 및 패널 - 우측 하단에 위치 */}
            <div className="fixed right-4 bottom-4 z-50">
                <div className="relative">
                    {!isMenuOpen && (
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                            aria-label="빠른 메뉴 열기"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    )}

                    {isMenuOpen && (
                        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform origin-bottom-right w-80">
                            <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                                <h3 className="font-medium">알바잉 도우미</h3>
                                <button onClick={() => setIsMenuOpen(false)} className="text-white hover:text-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* 탭 네비게이션 */}
                            <div className="flex border-b">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        className={`flex-1 py-2 text-center flex flex-col items-center text-xs ${
                                            activeTab === tab.id
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {renderIcon(tab.icon)}
                                        <span className="mt-1">{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* 탭 컨텐츠 */}
                            {renderTabContent()}
                        </div>
                    )}
                </div>
            </div>

            {/* 모달들 */}
            <Modal isOpen={openModal === 'annual'} onClose={closeModalHandler} title="연봉 계산기" size="lg">
                <SalaryCalculator initialTab="annual" />
            </Modal>

            <Modal isOpen={openModal === 'hourly'} onClose={closeModalHandler} title="시급 계산기" size="lg">
                <SalaryCalculator initialTab="hourly" />
            </Modal>

            <Modal isOpen={openModal === 'monthly'} onClose={closeModalHandler} title="월급 계산기" size="lg">
                <SalaryCalculator initialTab="monthly" />
            </Modal>

            <Modal isOpen={openModal === 'wage-checker'} onClose={closeModalHandler} title="최저임금 체크" size="md">
                <WageChecker />
            </Modal>

            <Modal isOpen={openModal === 'time-tracker'} onClose={closeModalHandler} title="출퇴근 시간 기록기" size="lg">
                <TimeTracker />
            </Modal>

            <Modal isOpen={openModal === 'commute-calculator'} onClose={closeModalHandler} title="통근 시간 계산기" size="md">
                <CommuteCalculator />
            </Modal>
        </>
    );
};

export default FloatingRemote;