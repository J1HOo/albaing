const Pagination = ({totalItems, itemsPerPage, currentPage, setCurrentPage}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPages = 3; // 한 번에 보여줄 페이지 개수 -> 한 번에 10개씩 보여주고 싶지 않다면 추후 수정 바람

    if (totalPages <= 1) return null;

    const startPage = Math.floor((currentPage - 1) / maxPages) * maxPages + 1;
    const endPage = Math.min(startPage + maxPages - 1, totalPages);

    return (
        <div className="flex justify-center mt-6 space-x-2 items-center">
            {/* 이전 버튼 */}
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={`px-3 py-1 rounded-md ${currentPage === 1 ? "text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
                    disabled={currentPage === 1}>이전
            </button>
            {/* 현재 페이지 위치 버튼 */}
            {Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md ${currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
                    {page}
                </button>
            ))}
            {/* 다음 버튼 */}
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={`px-3 py-1 rounded-md ${currentPage === totalPages ? "text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
                    disabled={currentPage === totalPages}>다음
            </button>
        </div>
    );
};

export default Pagination;

/*
const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPageNumbers = 10; // 한 번에 표시할 페이지 개수

    if (totalPages <= 1) return null; // 페이지가 1개 이하라면 페이지네이션 표시 안함

    const startPage = Math.floor((currentPage - 1) / maxPageNumbers) * maxPageNumbers + 1;
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="flex justify-center mt-6 space-x-2 items-center">
            {/* 이전 버튼 * /}
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? "text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
            >
                이전
            </button>

            {/* 페이지 숫자 버튼 * /}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* 다음 버튼 * /}
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? "text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
            >
                다음
            </button>
        </div>
    );
};

export default Pagination;

*/
/*
1. 번호 넘김처리 안한 페이지 네이션

const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    // 페이지가 1개 이하라면 페이지네이션 표시 안하게 처리
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
*/