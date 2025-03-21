import React, { createContext, useContext, useState } from 'react';
import AlertModal from '../components/modals/AlertModal';
import ConfirmModal from '../components/modals/ConfirmModal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    // 알림 모달 상태
    const [alertModal, setAlertModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '확인',
        type: 'info',
        onConfirm: null,
    });

    // 확인 모달 상태
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '확인',
        cancelText: '취소',
        type: 'warning',
        isDestructive: false,
        onConfirm: () => {},
    });

    // 알림 모달 열기
    const openAlertModal = ({
                                title,
                                message,
                                confirmText,
                                type,
                                onConfirm,
                            }) => {
        setAlertModal({
            isOpen: true,
            title: title || '알림',
            message,
            confirmText: confirmText || '확인',
            type: type || 'info',
            onConfirm: onConfirm || null,
        });
    };

    // 알림 모달 닫기
    const closeAlertModal = () => {
        setAlertModal((prev) => ({ ...prev, isOpen: false }));
    };

    // 확인 모달 열기
    const openConfirmModal = ({
                                  title,
                                  message,
                                  confirmText,
                                  cancelText,
                                  type,
                                  isDestructive,
                                  onConfirm,
                              }) => {
        setConfirmModal({
            isOpen: true,
            title: title || '확인',
            message,
            confirmText: confirmText || '확인',
            cancelText: cancelText || '취소',
            type: type || 'warning',
            isDestructive: isDestructive || false,
            onConfirm: onConfirm || (() => {}),
        });
    };

    // 확인 모달 닫기
    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <ModalContext.Provider
            value={{
                openAlertModal,
                closeAlertModal,
                openConfirmModal,
                closeConfirmModal,
            }}
        >
            {children}

            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={closeAlertModal}
                title={alertModal.title}
                message={alertModal.message}
                confirmText={alertModal.confirmText}
                type={alertModal.type}
                onConfirm={alertModal.onConfirm}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                type={confirmModal.type}
                isDestructive={confirmModal.isDestructive}
                onConfirm={confirmModal.onConfirm}
            />
        </ModalContext.Provider>
    );
};

// 모달 컨텍스트 훅
export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalContext must be used within a ModalProvider');
    }
    return context;
};

// 모달 커스텀 훅
export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalProps, setModalProps] = useState({});

    const openModal = (props = {}) => {
        setModalProps(props);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setTimeout(() => {
            if (typeof modalProps.onClose === 'function') {
                modalProps.onClose();
            }
        }, 100);
    };

    return {
        isOpen,
        modalProps,
        openModal,
        closeModal,
    };
};

export default ModalContext;