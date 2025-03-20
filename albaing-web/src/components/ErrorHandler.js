// ErrorHandler.js
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
export const setupAxiosInterceptors = (axios, navigate) => {
    // 요청 인터셉터
    axios.interceptors.request.use(
        (config) => {
            // 요청 시작 시 로딩 상태 표시 (전역 상태에 연결 가능)
            // window.dispatchEvent(new CustomEvent('axios-loading', { detail: { isLoading: true } }));

            // 요청 헤더에 토큰 추가 등의 작업 가능
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => {
            // window.dispatchEvent(new CustomEvent('axios-loading', { detail: { isLoading: false } }));
            return Promise.reject(error);
        }
    );

    // 응답 인터셉터
    axios.interceptors.response.use(
        (response) => {
            // 요청 완료 시 로딩 상태 해제
            // window.dispatchEvent(new CustomEvent('axios-loading', { detail: { isLoading: false } }));
            return response;
        },
        (error) => {
            // window.dispatchEvent(new CustomEvent('axios-loading', { detail: { isLoading: false } }));

            // 401 에러(인증 실패)가 발생한 경우 로그인 페이지로 리다이렉트
            if (error.response && error.response.status === 401) {
                // 로컬 스토리지에서 사용자 정보와 토큰 제거 (로그아웃 처리)
                localStorage.removeItem('token');
                localStorage.removeItem('authUser');

                // 로그인 페이지로 리다이렉트 (중복 리다이렉트 방지)
                if (!window.location.pathname.includes('/login')) {
                    navigate('/login', { state: { from: window.location.pathname, message: '세션이 만료되었습니다. 다시 로그인해주세요.' } });
                }
            }

            // 403 에러(권한 없음)가 발생한 경우 알림 후 홈으로 리다이렉트
            if (error.response && error.response.status === 403) {
                if (!window.location.pathname.includes('/login') && !window.location.pathname === '/') {
                    navigate('/', { state: { message: '해당 작업을 수행할 권한이 없습니다.' } });
                }
            }

            return Promise.reject(error);
        }
    );
};

// 후크: 에러 모달 표시를 위한 편의 함수
export const useErrorHandler = () => {
    const alertModal = useModal();

    // 에러 처리 함수
    const handleError = (error, customMessage = null) => {
        const message = customMessage || getErrorMessage(error);

        alertModal.openModal({
            title: '오류 발생',
            message: message,
            type: 'error'
        });

        // 에러 콘솔 로깅 (개발 모드에서만)
        if (process.env.NODE_ENV === 'development') {
            console.error('Error details:', error);
        }

        return message;
    };

    // 성공 메시지 처리
    const handleSuccess = (message) => {
        alertModal.openModal({
            title: '성공',
            message: message,
            type: 'success'
        });
    };

    // 확인 모달 표시
    const confirmAction = (message, onConfirm, title = '확인', confirmText = '확인', cancelText = '취소', type = 'warning') => {
        return new Promise((resolve) => {
            alertModal.openModal({
                title,
                message,
                confirmText,
                cancelText,
                type,
                onConfirm: () => {
                    onConfirm();
                    resolve(true);
                },
                onClose: () => {
                    resolve(false);
                }
            });
        });
    };

    return {
        handleError,
        handleSuccess,
        confirmAction
    };
};

// API 호출에 대한 재시도 로직
export const retryRequest = (apiCall, maxRetries = 3, delayMs = 1000) => {
    return new Promise((resolve, reject) => {
        const attempt = (retryCount) => {
            apiCall()
                .then(resolve)
                .catch((error) => {
                    if (retryCount < maxRetries) {
                        console.log(`Request failed, retrying (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => attempt(retryCount + 1), delayMs);
                    } else {
                        reject(error);
                    }
                });
        };

        attempt(0);
    });
};

// 전역 로딩 상태 관리를 위한 이벤트 리스너 설정
export const setupLoadingListener = (setGlobalLoading) => {
    const handleLoadingChange = (event) => {
        setGlobalLoading(event.detail.isLoading);
    };

    window.addEventListener('axios-loading', handleLoadingChange);

    return () => {
        window.removeEventListener('axios-loading', handleLoadingChange);
    };
};