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
        return new Promise((resolve) => {
            setAlertModal({
                isOpen: true,
                title: title || '알림',
                message,
                confirmText: confirmText || '확인',
                type: type || 'info',
                onConfirm: () => {
                    if (typeof onConfirm === 'function') {
                        onConfirm();
                    }
                    resolve(true);
                },
            });
        });
    };

    // 알림 모달 닫기
    const closeAlertModal = () => {
        setAlertModal((prev) => ({ ...prev, isOpen: false }));
    };

    // 확인 모달 열기 (Promise 반환)
    const openConfirmModal = ({
                                  title,
                                  message,
                                  confirmText,
                                  cancelText,
                                  type,
                                  isDestructive,
                                  onConfirm,
                              }) => {
        return new Promise((resolve, reject) => {
            setConfirmModal({
                isOpen: true,
                title: title || '확인',
                message,
                confirmText: confirmText || '확인',
                cancelText: cancelText || '취소',
                type: type || 'warning',
                isDestructive: isDestructive || false,
                onConfirm: () => {
                    if (typeof onConfirm === 'function') {
                        // onConfirm이 Promise를 반환하는 경우 처리
                        const result = onConfirm();
                        if (result && typeof result.then === 'function') {
                            result
                                .then((value) => {
                                    resolve(value);
                                })
                                .catch((error) => {
                                    reject(error);
                                });
                        } else {
                            resolve(true);
                        }
                    } else {
                        resolve(true);
                    }
                },
                onCancel: () => {
                    reject(new Error('User cancelled'));
                }
            });
        });
    };

    // 확인 모달 닫기
    const closeConfirmModal = (shouldResolve = false) => {
        setConfirmModal((prev) => {
            if (shouldResolve && typeof prev.onConfirm === 'function') {
                prev.onConfirm();
            } else if (!shouldResolve && typeof prev.onCancel === 'function') {
                prev.onCancel();
            }
            return { ...prev, isOpen: false };
        });
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
                onClose={() => {
                    closeAlertModal();
                    if (alertModal.onConfirm) {
                        alertModal.onConfirm();
                    }
                }}
                title={alertModal.title}
                message={alertModal.message}
                confirmText={alertModal.confirmText}
                type={alertModal.type}
                onConfirm={alertModal.onConfirm}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => closeConfirmModal(false)} // 취소로 간주
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                type={confirmModal.type}
                isDestructive={confirmModal.isDestructive}
                onConfirm={() => closeConfirmModal(true)} // 확인으로 간주
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

// 모달 커스텀 훅 (Promise 지원 메서드 포함)
export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalProps, setModalProps] = useState({});
    const context = useModalContext();

    const openModal = (props = {}) => {
        setModalProps(props);
        setIsOpen(true);

        // Promise 기반 작업 처리를 위한 반환
        return new Promise((resolve, reject) => {
            const originalOnConfirm = props.onConfirm;
            const originalOnClose = props.onClose;

            // onConfirm 래핑
            const wrappedOnConfirm = (...args) => {
                let result;
                if (typeof originalOnConfirm === 'function') {
                    result = originalOnConfirm(...args);
                }

                // Promise 체인 처리
                if (result && typeof result.then === 'function') {
                    result
                        .then((value) => {
                            resolve(value);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                } else {
                    resolve(result);
                }
            };

            // 원본 props를 유지하면서 onConfirm만 래핑
            setModalProps(prev => ({
                ...prev,
                onConfirm: wrappedOnConfirm,
                onClose: () => {
                    if (typeof originalOnClose === 'function') {
                        originalOnClose();
                    }
                    reject(new Error('Modal closed without confirmation'));
                }
            }));
        });
    };

    const closeModal = () => {
        setIsOpen(false);

        setTimeout(() => {
            if (typeof modalProps.onClose === 'function') {
                modalProps.onClose();
            }
        }, 100);
    };

    // 모달 컨텍스트 메서드를 활용한 래퍼 메서드
    const showAlert = (options) => {
        return context.openAlertModal(options);
    };

    const showConfirm = (options) => {
        return context.openConfirmModal(options);
    };

    return {
        isOpen,
        modalProps,
        openModal,
        closeModal,
        showAlert,
        showConfirm
    };
};

export default ModalContext;