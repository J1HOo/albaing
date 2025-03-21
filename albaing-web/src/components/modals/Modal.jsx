import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   size = 'md',
                   showClose = true,
                   closeOnOutsideClick = true,
                   className = '',
                   footer = null
               }) => {
    const modalRef = useRef(null);

    // 모달 열릴 때 body 스크롤 방지
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = originalStyle;
        }

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [isOpen]);

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    // 클릭 외부 감지
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && closeOnOutsideClick) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, closeOnOutsideClick]);

    if (!isOpen) return null;

    // 모달 크기에 따른 클래스
    const sizeClasses = {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        full: 'max-w-full'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 animate-fadeIn overflow-y-auto">
            <div
                ref={modalRef}
                className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all duration-300 animate-slideIn ${className}`}
            >
                {/* 모달 헤더 */}
                {title && (
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                        {showClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                                aria-label="닫기"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* 모달 내용 */}
                <div className="p-6">{children}</div>

                {/* 모달 푸터 */}
                {footer && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;