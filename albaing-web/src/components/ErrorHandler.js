import { useModal } from "../components";

// API 에러 메시지 해석 및 사용자 친화적 메시지 반환
export const getErrorMessage = (error) => {
    // API 응답에서 오류 메시지 추출
    const serverMessage = error?.response?.data?.message;

    // HTTP 상태 코드 기반 에러 메시지
    if (error?.response) {
        switch (error.response.status) {
            case 400:
                return serverMessage || "잘못된 요청입니다. 입력 정보를 확인해주세요.";
            case 401:
                return "로그인이 필요하거나 인증 정보가 만료되었습니다.";
            case 403:
                return "이 작업을 수행할 권한이 없습니다.";
            case 404:
                return serverMessage || "요청하신 정보를 찾을 수 없습니다.";
            case 409:
                return serverMessage || "요청이 현재 상태와 충돌합니다.";
            case 422:
                return serverMessage || "입력 정보를 처리할 수 없습니다. 다시 확인해주세요.";
            case 500:
                return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            default:
                return serverMessage || "오류가 발생했습니다. 다시 시도해주세요.";
        }
    }

    // 네트워크 오류
    if (error?.message === 'Network Error') {
        return "네트워크 연결을 확인해주세요.";
    }

    // 기타 오류
    return error?.message || "오류가 발생했습니다. 다시 시도해주세요.";
};

// axios 인터셉터 설정 함수
export const setupAxiosInterceptors = (axios, navigate, setGlobalLoading = null) => {
    // 요청 인터셉터
    axios.interceptors.request.use(
        (config) => {
            // 요청 시작 시 로딩 상태 표시
            if (setGlobalLoading) {
                setGlobalLoading(true);
            } else {
                window.dispatchEvent(new CustomEvent('axios-loading', { detail: { isLoading: true } }));
            }

            // CSRF 토큰이 있는 경우 요청 헤더에 추가
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                config.headers['X-CSRF-TOKEN'] = csrfToken;
            }

            return config;
        },
        (error) => {
            if (setGlobalLoading) {
                setGlobalLoading(false);
            } else {
                window.dispatchEvent(new CustomEvent('axios-loading', { detail: { isLoading: false } }));
            }
            return Promise.reject(error);
        }
    );

    // 응답 인터셉터
    axios.interceptors.response.use(
        (response) => {
            // 요청 완료 시 로딩 상태 해제
            if (setGlobalLoading) {
                setGlobalLoading(false);
            } else {
                window.dispatchEvent(new CustomEvent('axios-loading', { detail: { isLoading: false } }));
            }
            return response;
        },
        (error) => {
            if (setGlobalLoading) {
                setGlobalLoading(false);
            } else {
                window.dispatchEvent(new CustomEvent('axios-loading', { detail: { isLoading: false } }));
            }

            // 401 에러(인증 실패) 처리 - 로그인 페이지로 리다이렉트
            if (error.response && error.response.status === 401) {
                // 세션 스토리지 및 로컬 스토리지 클리어
                sessionStorage.clear();
                localStorage.removeItem('authUser');

                // 로그인 페이지로 리다이렉트 (중복 리다이렉트 방지)
                if (navigate && !window.location.pathname.includes('/login')) {
                    navigate('/login', {
                        state: {
                            from: window.location.pathname,
                            message: '세션이 만료되었습니다. 다시 로그인해주세요.'
                        }
                    });
                }
            }

            // 403 에러(권한 없음) 처리
            if (error.response && error.response.status === 403) {
                if (navigate && !window.location.pathname.includes('/login') && window.location.pathname !== '/') {
                    navigate('/', {
                        state: {
                            message: '해당 작업을 수행할 권한이 없습니다.'
                        }
                    });
                }
            }

            return Promise.reject(error);
        }
    );
};

// 후크: 에러 모달 표시를 위한 편의 함수
export const useErrorHandler = () => {
    const { openAlertModal, openConfirmModal } = useModal();

    // 에러 처리 함수
    const handleError = (error, customMessage = null) => {
        const message = customMessage || getErrorMessage(error);

        openAlertModal({
            title: '오류 발생',
            message: message,
            type: 'error'
        });

        // 개발 모드에서만 콘솔에 자세한 오류 기록
        if (process.env.NODE_ENV === 'development') {
            console.error('에러 상세:', error);
        }

        return message;
    };

    // 성공 메시지 처리
    const handleSuccess = (message) => {
        openAlertModal({
            title: '성공',
            message: message,
            type: 'success'
        });
    };

    // 확인 모달 표시
    const confirmAction = (message, onConfirm, options = {}) => {
        const {
            title = '확인',
            confirmText = '확인',
            cancelText = '취소',
            type = 'warning',
            isDestructive = false
        } = options;

        return new Promise((resolve) => {
            openConfirmModal({
                title,
                message,
                confirmText,
                cancelText,
                type,
                isDestructive,
                onConfirm: () => {
                    onConfirm();
                    resolve(true);
                }
            });
        });
    };

    // 경고 표시
    const handleWarning = (message, title = '주의') => {
        openAlertModal({
            title,
            message,
            type: 'warning'
        });
    };

    // 정보 메시지 표시
    const handleInfo = (message, title = '안내') => {
        openAlertModal({
            title,
            message,
            type: 'info'
        });
    };

    return {
        handleError,
        handleSuccess,
        handleWarning,
        handleInfo,
        confirmAction
    };
};

// 에러 메시지 컴포넌트
export const ErrorMessage = ({ message, className = '', onClose }) => (
    <div className={`mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-start justify-between ${className}`}>
        <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3">
                <p className="text-sm">{message}</p>
            </div>
        </div>
        {onClose && (
            <button
                type="button"
                className="ml-auto flex-shrink-0 -mt-1 -mr-1 p-1 rounded-full text-red-400 hover:bg-red-100 focus:outline-none"
                onClick={onClose}
            >
                <span className="sr-only">닫기</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        )}
    </div>
);

// 성공 메시지 컴포넌트
export const SuccessMessage = ({ message, className = '', onClose }) => (
    <div className={`mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-start justify-between ${className}`}>
        <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3">
                <p className="text-sm">{message}</p>
            </div>
        </div>
        {onClose && (
            <button
                type="button"
                className="ml-auto flex-shrink-0 -mt-1 -mr-1 p-1 rounded-full text-green-400 hover:bg-green-100 focus:outline-none"
                onClick={onClose}
            >
                <span className="sr-only">닫기</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        )}
    </div>
);

// 경고 메시지 컴포넌트
export const WarningMessage = ({ message, className = '', onClose }) => (
    <div className={`mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded flex items-start justify-between ${className}`}>
        <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3">
                <p className="text-sm">{message}</p>
            </div>
        </div>
        {onClose && (
            <button
                type="button"
                className="ml-auto flex-shrink-0 -mt-1 -mr-1 p-1 rounded-full text-yellow-400 hover:bg-yellow-100 focus:outline-none"
                onClick={onClose}
            >
                <span className="sr-only">닫기</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        )}
    </div>
);

// 정보 메시지 컴포넌트
export const InfoMessage = ({ message, className = '', onClose }) => (
    <div className={`mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded flex items-start justify-between ${className}`}>
        <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3">
                <p className="text-sm">{message}</p>
            </div>
        </div>
        {onClose && (
            <button
                type="button"
                className="ml-auto flex-shrink-0 -mt-1 -mr-1 p-1 rounded-full text-blue-400 hover:bg-blue-100 focus:outline-none"
                onClick={onClose}
            >
                <span className="sr-only">닫기</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        )}
    </div>
);

export default {
    getErrorMessage,
    setupAxiosInterceptors,
    useErrorHandler,
    ErrorMessage,
    SuccessMessage,
    WarningMessage,
    InfoMessage
};