import React from 'react';

// 로딩 스피너 종류
const SPINNER_TYPES = {
    // 기본 스피너 (원형 테두리)
    DEFAULT: 'default',
    // 점 3개 애니메이션
    DOTS: 'dots',
    // 풀스크린 오버레이
    OVERLAY: 'overlay',
    // 스켈레톤 로딩 (콘텐츠 자리 표시자)
    SKELETON: 'skeleton'
};

/**
 * 로딩 스피너 컴포넌트
 * @param {Object} props
 * @param {string} [props.message='로딩 중...'] - 표시할 메시지
 * @param {boolean} [props.fullScreen=false] - 화면 전체에 표시할지 여부
 * @param {string} [props.className=''] - 추가 CSS 클래스
 * @param {string} [props.type='default'] - 스피너 타입 (default, dots, overlay, skeleton)
 * @param {string} [props.size='md'] - 스피너 크기 (sm, md, lg)
 * @param {string} [props.color='blue'] - 스피너 색상 (blue, gray, green, red, yellow)
 * @param {boolean} [props.showMessage=true] - 메시지 표시 여부
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({
                            message = "로딩 중...",
                            fullScreen = false,
                            className = '',
                            type = SPINNER_TYPES.DEFAULT,
                            size = 'md',
                            color = 'blue',
                            showMessage = true
                        }) => {
    // 크기별 클래스
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    // 색상별 클래스
    const colorClasses = {
        blue: 'border-blue-500 text-blue-500',
        gray: 'border-gray-500 text-gray-500',
        green: 'border-green-500 text-green-500',
        red: 'border-red-500 text-red-500',
        yellow: 'border-yellow-500 text-yellow-500'
    };

    // 컨테이너 클래스
    const containerClass = `flex justify-center items-center ${fullScreen ? 'min-h-screen fixed inset-0 bg-white bg-opacity-90 z-50' : 'py-10'} ${className}`;

    // 렌더링할 스피너 유형 선택
    const renderSpinner = () => {
        switch(type) {
            case SPINNER_TYPES.DOTS:
                return (
                    <div className="flex space-x-2">
                        <div className={`rounded-full ${sizeClasses.sm} animate-bounce bg-${color}-500`} style={{ animationDelay: '0ms' }}></div>
                        <div className={`rounded-full ${sizeClasses.sm} animate-bounce bg-${color}-500`} style={{ animationDelay: '150ms' }}></div>
                        <div className={`rounded-full ${sizeClasses.sm} animate-bounce bg-${color}-500`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                );

            case SPINNER_TYPES.OVERLAY:
                return (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
                            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-t-transparent ${colorClasses[color]}`}></div>
                            {showMessage && <p className="mt-4 text-gray-700 font-medium">{message}</p>}
                        </div>
                    </div>
                );

            case SPINNER_TYPES.SKELETON:
                return (
                    <div className="space-y-3 w-full">
                        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-11/12"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-9/12"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-10/12"></div>
                    </div>
                );

            case SPINNER_TYPES.DEFAULT:
            default:
                return (
                    <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-t-transparent ${colorClasses[color]}`}></div>
                );
        }
    };

    return (
        <div className={containerClass}>
            {renderSpinner()}
            {showMessage && type !== SPINNER_TYPES.OVERLAY && (
                <p className={`ml-3 text-lg text-gray-700 ${type === SPINNER_TYPES.SKELETON ? 'sr-only' : ''}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

// 테이블용 로딩 스켈레톤
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
    <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-t mb-2"></div>
        {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex mb-2">
                {[...Array(columns)].map((_, colIndex) => (
                    <div key={colIndex} className="h-8 bg-gray-200 rounded mx-1 flex-1"></div>
                ))}
            </div>
        ))}
    </div>
);

// 카드용 로딩 스켈레톤
export const CardSkeleton = ({ count = 1 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(count)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                <div className="mt-6 flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);

LoadingSpinner.TYPES = SPINNER_TYPES;

export default LoadingSpinner;