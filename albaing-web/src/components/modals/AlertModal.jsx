import React from 'react';
import Modal from './Modal';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const AlertModal = ({
                        isOpen,
                        onClose,
                        title = '알림',
                        message,
                        confirmText = '확인',
                        type = 'info',
                        onConfirm = null
                    }) => {
    const typeConfig = {
        info: {
            icon: <Info className="w-6 h-6 text-blue-500" />,
            title: title || '안내',
            buttonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            iconContainerClass: 'bg-blue-100'
        },
        success: {
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            title: title || '성공',
            buttonClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
            iconContainerClass: 'bg-green-100'
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
            title: title || '주의',
            buttonClass: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
            iconContainerClass: 'bg-yellow-100'
        },
        error: {
            icon: <XCircle className="w-6 h-6 text-red-500" />,
            title: title || '오류',
            buttonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            iconContainerClass: 'bg-red-100'
        }
    };

    // 형식이 없는 경우 기본값으로 info 사용
    const config = typeConfig[type] || typeConfig.info;

    // 확인 버튼 클릭 처리
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
            title={config.title}
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

            <div className="mt-6 text-right">
                <button
                    type="button"
                    onClick={handleConfirm}
                    className={`px-4 py-2 text-white rounded-md transition-colors ${config.buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}

export default AlertModal;