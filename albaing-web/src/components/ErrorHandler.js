import {useModalContext} from "../contexts/ModalContext";
import useModal from "./modals/useModal";

export const ErrorHandler = () => {
    const modal = useModal();
    const context = useModalContext(); // 글로벌 모달 컨텍스트도 가져옴

    // 에러 처리 함수
    const handleError = (error, customMessage = null) => {
        const message = customMessage || getErrorMessage(error);
        
        if (context && typeof context.openAlertModal === 'function') {
            context.openAlertModal({
                title: '오류 발생',
                message: message,
                type: 'error'
            });
        } else if (modal) {
            // modal.openModal 사용
            modal.openModal({
                title: '오류 발생',
                message: message,
                type: 'error'
            });
        } else {
            // fallback: 콘솔에 에러 출력
            console.error('에러:', message);
        }

        // 개발 모드에서만 콘솔에 자세한 오류 기록
        if (process.env.NODE_ENV === 'development') {
            console.error('에러 상세:', error);
        }

        return message;
    };

    // 성공 메시지 처리
    const handleSuccess = (message) => {
        if (context && typeof context.openAlertModal === 'function') {
            context.openAlertModal({
                title: '성공',
                message: message,
                type: 'success'
            });
        } else if (modal) {
            modal.openModal({
                title: '성공',
                message: message,
                type: 'success'
            });
        } else {
            console.log('성공:', message);
        }
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

        if (context && typeof context.openConfirmModal === 'function') {
            return context.openConfirmModal({
                title,
                message,
                confirmText,
                cancelText,
                type,
                isDestructive,
                onConfirm
            });
        } else if (modal) {
            return modal.openModal({
                title,
                message,
                confirmText,
                cancelText,
                type,
                isDestructive,
                onConfirm
            });
        } else {
            // fallback: 확인창 사용
            if (window.confirm(message)) {
                onConfirm();
                return Promise.resolve(true);
            }
            return Promise.reject(new Error('User cancelled'));
        }
    };

    return {
        handleError,
        handleSuccess,
        confirmAction
    };
};