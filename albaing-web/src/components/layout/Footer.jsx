import React from 'react';
import { Link } from 'react-router-dom';
import albaingLogo from '../../assets/svg/albaing_logo.svg';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 text-sm bg-white mt-auto w-screen">
            <div className="max-w-[1200px] mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    {/* 로고 및 회사 정보 */}
                    <div className="flex items-start space-x-8 mb-6 md:mb-0">
                        {/* 로고 */}
                        <div>
                            <Link to="/">
                                <img src={albaingLogo} alt="알바잉 로고" className="h-16 md:h-20 w-auto" />
                            </Link>
                        </div>

                        {/* 회사 정보 */}
                        <div>
                            <p className="text-gray-800 font-semibold">(주) 잡잡</p>
                            <p className="mt-2 text-gray-500">
                                사업자등록번호: 123-456-12345 <br />
                                서울특별시 강남구 테헤란로14길 6<br />
                                남도빌딩 2층, 3층, 4층
                            </p>
                            <p className="mt-2 text-gray-500">
                                © 2025 jobjob. All rights reserved.
                            </p>
                        </div>
                    </div>

                    {/* 메뉴 링크들 */}
                    <div className="flex-wrap justify-between md:space-x-12 hidden md:flex">
                        {/* 서비스 */}
                        <div className="w-1/2 md:w-auto mb-6 md:mb-0">
                            <h3 className="font-semibold mb-4 text-gray-900">서비스</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li><Link to="/jobs" className="hover:text-blue-600">채용정보</Link></li>
                                <li><Link to="/companies" className="hover:text-blue-600">기업정보</Link></li>
                                <li><Link to="/resumes" className="hover:text-blue-600">이력서</Link></li>
                                <li><Link to="/calculator" className="hover:text-blue-600">계산기</Link></li>
                            </ul>
                        </div>

                        {/* 고객지원 */}
                        <div className="w-1/2 md:w-auto mb-6 md:mb-0">
                            <h3 className="font-semibold mb-4 text-gray-900">고객지원</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li><Link to="/customer/faq" className="hover:text-blue-600">자주 묻는 질문</Link></li>
                                <li><Link to="/customer/contact" className="hover:text-blue-600">문의하기</Link></li>
                                <li><Link to="/notices" className="hover:text-blue-600">공지사항</Link></li>
                                <li><Link to="/chatbot" className="hover:text-blue-600">챗봇</Link></li>
                            </ul>
                        </div>

                        {/* 회사 정보 */}
                        <div className="w-1/2 md:w-auto">
                            <h3 className="font-semibold mb-4 text-gray-900">회사 정보</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li><Link to="/about" className="hover:text-blue-600">회사 소개</Link></li>
                                <li><Link to="/terms" className="hover:text-blue-600">이용약관</Link></li>
                                <li><Link to="/privacy" className="hover:text-blue-600">개인정보처리방침</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 py-4 text-center text-gray-500 text-xs w-full">
                <div className="max-w-[1200px] mx-auto px-4">
                    <p>본 사이트는 구직자와 기업을 연결해주는 플랫폼으로 잡잡(주)는 통신판매중개자이며 통신판매의 당사자가 아닙니다.</p>
                </div>
            </div>
        </footer>
    );
}