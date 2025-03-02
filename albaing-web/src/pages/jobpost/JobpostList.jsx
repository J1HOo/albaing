import React, {useState} from 'react';
import {Link} from 'react-router-dom';

// 더미 데이터
const jobListings = [
    {
        id: 1,
        title: '주5일 평일 오전 카페 알바',
        company: '스타벅스 강남점',
        location: '서울시 강남구',
        type: '파트타임',
        salary: '시급 10,000원',
        workingDays: '월~금',
        workingHours: '09:00~15:00',
        dueDate: '2025-03-15',
        createdAt: '2025-02-25',
        logoUrl: 'https://via.placeholder.com/40',
    },
    {
        id: 2,
        title: '주말 서빙 알바 모집',
        company: '맛있는 식당',
        location: '서울시 서초구',
        type: '파트타임',
        salary: '시급 12,000원',
        workingDays: '토~일',
        workingHours: '17:00~22:00',
        dueDate: '2025-03-10',
        createdAt: '2025-02-24',
        logoUrl: 'https://via.placeholder.com/40',
    },
    {
        id: 3,
        title: '웹 개발 인턴 채용',
        company: '테크 스타트업',
        location: '서울시 성동구',
        type: '인턴십',
        salary: '월급 250만원',
        workingDays: '월~금',
        workingHours: '10:00~18:00',
        dueDate: '2025-03-20',
        createdAt: '2025-02-23',
        logoUrl: 'https://via.placeholder.com/40',
    },
    {
        id: 4,
        title: '편의점 야간 알바',
        company: 'GS25 홍대점',
        location: '서울시 마포구',
        type: '야간',
        salary: '시급 12,500원',
        workingDays: '월~일 (주 3일)',
        workingHours: '22:00~08:00',
        dueDate: '2025-03-05',
        createdAt: '2025-02-22',
        logoUrl: 'https://via.placeholder.com/40',
    },
    {
        id: 5,
        title: '헬스장 트레이너',
        company: '건강한 짐',
        location: '서울시 용산구',
        type: '정규직',
        salary: '월급 300만원',
        workingDays: '화~토',
        workingHours: '13:00~22:00',
        dueDate: '2025-03-25',
        createdAt: '2025-02-21',
        logoUrl: 'https://via.placeholder.com/40',
    },
    {
        id: 6,
        title: '물류센터 상품 포장',
        company: '쿠팡',
        location: '경기도 부천시',
        type: '계약직',
        salary: '시급 11,000원',
        workingDays: '월~금',
        workingHours: '09:00~18:00',
        dueDate: '2025-03-12',
        createdAt: '2025-02-20',
        logoUrl: 'https://via.placeholder.com/40',
    }
];

// 카테고리 분류 더미 데이터
const categories = [
    {name: '전체', value: 'all'},
    {name: '사무직', value: 'office'},
    {name: '서비스업', value: 'service'},
    {name: 'IT/개발', value: 'it'},
    {name: '판매/영업', value: 'sales'},
    {name: '교육', value: 'education'},
    {name: '생산/건설', value: 'production'},
    {name: '운전/배달', value: 'delivery'},
];

// 지역 분류 더미 데이터
const locations = [
    {name: '전체', value: 'all'},
    {name: '서울', value: 'seoul'},
    {name: '경기', value: 'gyeonggi'},
    {name: '인천', value: 'incheon'},
    {name: '부산', value: 'busan'},
    {name: '대구', value: 'daegu'},
    {name: '대전', value: 'daejeon'},
    {name: '광주', value: 'gwangju'},
];

export default function JobpostList() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">채용 정보</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        다양한 채용공고를 확인하고 지금 바로 지원해보세요!
                    </p>
                </div>

                {/* 검색 필터 */}
                <div className="bg-white shadow rounded-lg mb-8 p-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                        <div className="sm:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">검색어</label>
                            <input
                                type="text"
                                id="search"
                                placeholder="직무, 회사명, 지역명 등"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="category"
                                   className="block text-sm font-medium text-gray-700 mb-1">직종</label>
                            <select
                                id="category"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="location"
                                   className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                            <select
                                id="location"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                {locations.map((location) => (
                                    <option key={location.value} value={location.value}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            검색하기
                        </button>
                    </div>
                </div>

                {/* 채용 공고 목록 */}
                <div>
                    <ul className="space-y-4">
                        {jobListings.map((job) => (
                            <li key={job.id}
                                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <Link to={`/jobs/${job.id}`} className="block">
                                    <div className="p-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <img className="h-10 w-10 rounded-full" src={job.logoUrl}
                                                     alt={job.company}/>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                                                    <span
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {job.type}
                          </span>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">{job.company}</p>
                                                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                             fill="currentColor">
                                                            <path fillRule="evenodd"
                                                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                        {job.location}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                             fill="currentColor">
                                                            <path fillRule="evenodd"
                                                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                        {job.workingDays}, {job.workingHours}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                             fill="currentColor">
                                                            <path
                                                                d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                                                            <path fillRule="evenodd"
                                                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                        {job.salary}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="text-sm text-gray-500">
                                                등록일: {job.createdAt}
                                            </div>
                                            <div className="text-sm font-medium text-red-600">
                                                마감일: {job.dueDate}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* 페이지네이션 */}
                    <div className="mt-8 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                             aria-label="Pagination">
                            <span className="sr-only">이전</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                 fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd"
                                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                      clipRule="evenodd"/>
                            </svg>
                            <a href="#"
                               className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                1
                            </a>
                            <a href="#"
                               className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                                2
                            </a>
                            <a href="#"
                               className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                3
                            </a>
                            <span
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
                            <a href="#"
                               className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                8
                            </a>
                            <a href="#"
                               className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                9
                            </a>
                            <a href="#"
                               className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                10
                            </a>
                            <span className="sr-only">다음</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                 fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clipRule="evenodd"/>
                            </svg>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}