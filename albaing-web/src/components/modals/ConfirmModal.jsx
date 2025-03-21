import React, { useState } from 'react';
import Modal from './Modal';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

const ConfirmModal = ({
                          isOpen,
                          onClose,
                          onConfirm,
                          title = '확인',
                          message,
                          confirmText = '확인',
                          cancelText = '취소',
                          type = 'warning',
                          isDestructive = false,
                          hideCancel = false,
                          processing = false // 처리 중 상태 추가
                      }) => {
    const [isProcessing, setIsProcessing] = useState(processing);

    const typeConfig = {
        info: {
            icon: <HelpCircle className="h-6 w-6 text-blue-600" />,
            iconContainerClass: 'bg-blue-100',
            confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        },
        warning: {
            icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
            iconContainerClass: 'bg-yellow-100',
            confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        },
        error: {
            icon: <AlertCircle className="h-6 w-6 text-red-600" />,
            iconContainerClass: 'bg-red-100',
            confirmButtonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        }
    };

    // 형식이 없는 경우 기본값으로 warning 사용
    const config = typeConfig[type] || typeConfig.warning;

    // 파괴적 작업(예: 삭제)인 경우 확인 버튼 스타일 오버라이드
    const confirmButtonClass = isDestructive
        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        : config.confirmButtonClass;

    const handleConfirm = () => {
        setIsProcessing(true);

        // onConfirm이 Promise를 반환하는 경우 처리
        if (typeof onConfirm === 'function') {
            const result = onConfirm();
            if (result && typeof result.then === 'function') {
                result
                    .then(() => {
                        setIsProcessing(false);
                        onClose();
                    })
                    .catch((error) => {
                        console.error('Confirmation action failed:', error);
                        setIsProcessing(false);
                        // 오류 처리 로직 (필요시)
                    });
            } else {
                // Promise가 아닌 경우 바로 종료
                setIsProcessing(false);
                onClose();
            }
        } else {
            setIsProcessing(false);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            showClose={!isProcessing}
            closeOnOutsideClick={!isProcessing}
        >
            <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${config.iconContainerClass}`}>
                    {config.icon}
                </div>
                <div className="flex-1 mt-0.5">
                    <p className="text-gray-700">{message}</p>
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                {!hideCancel && (
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className={`px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {cancelText}
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className={`px-4 py-2 text-white rounded-md ${confirmButtonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isProcessing ? 'opacity-70 cursor-wait' : ''
                    }`}
                >
                    {isProcessing ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            처리 중...
                        </div>
                    ) : (
                        confirmText
                    )}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;