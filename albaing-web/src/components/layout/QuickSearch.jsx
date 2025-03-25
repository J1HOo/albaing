import React, { useState, useEffect } from 'react';

const QuickSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);

    // 로컬 스토리지에서
    useEffect(() => {
        try {
            const savedSearches = localStorage.getItem('recentJobSearches');
            if (savedSearches) {
                setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
            }
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    }, []);

    // 검색 히스토리 저장
    const saveSearch = (term) => {
        if (!term.trim()) return;

        try {
            const savedSearches = localStorage.getItem('recentJobSearches');
            let searches = savedSearches ? JSON.parse(savedSearches) : [];

            // 중복 제거 후 앞에 추가
            searches = [term, ...searches.filter(s => s !== term)].slice(0, 5);

            localStorage.setItem('recentJobSearches', JSON.stringify(searches));
            setRecentSearches(searches);
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            saveSearch(searchTerm);
            onSearch(searchTerm);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="mb-2">
                <div className="flex">
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="채용 공고 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </form>

            {recentSearches.length > 0 && (
                <div>
                    <div className="flex items-center mb-1">
                        <p className="text-xs text-gray-500">최근 검색어</p>
                        <button
                            className="text-xs text-gray-400 ml-auto"
                            onClick={() => {
                                localStorage.removeItem('recentJobSearches');
                                setRecentSearches([]);
                            }}
                        >
                            지우기
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {recentSearches.map((term, idx) => (
                            <button
                                key={idx}
                                className="text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 truncate max-w-[100px]"
                                onClick={() => {
                                    setSearchTerm(term);
                                    saveSearch(term);
                                    onSearch(term);
                                }}
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuickSearch;