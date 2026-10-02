import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
    isLoading = false,
}: ConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    {isDestructive && (
                        <div className="rounded-full bg-red-100 p-2 text-red-600">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                    )}
                    <p className="text-sm text-gray-600 flex-1 mt-1">
                        {description}
                    </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 mt-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={isDestructive ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
