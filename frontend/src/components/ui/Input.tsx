import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, id, ...props }, ref) => {
        const textareaId = id || props.name;

        return (
            <div className="w-full">
                <label htmlFor={textareaId} className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                </label>
                <textarea
                    ref={ref}
                    id={textareaId}
                    {...props}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';
