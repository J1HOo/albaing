import React from 'react';

const AlertModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                <h3 className="text-lg font-bold mb-4">알림</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-blue-50"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
