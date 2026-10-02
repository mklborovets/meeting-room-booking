import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    subtitle?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    subtitle,
    maxWidth = 'md',
}: ModalProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                modalRef.current?.focus();
            }, 0);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const titleId = useId();
    const modalRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    }[maxWidth];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className={`w-full ${maxWidthClass} rounded-xl bg-white p-6 shadow-lg outline-none`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 id={titleId} className="text-lg font-bold text-gray-900">
                            {title}
                        </h2>
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};
