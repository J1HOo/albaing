import React from 'react';
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
                          isDestructive = false
                      }) => {
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
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            showClose={false}
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
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    {cancelText}
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    className={`px-4 py-2 text-white rounded-md ${confirmButtonClass} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;