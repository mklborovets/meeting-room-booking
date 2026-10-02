import { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'outline' | 'ghost';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, variant = 'primary', isLoading, icon, className = '', ...props }, ref) => {
        const baseClass = "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50";

        let variantClass = "";
        switch (variant) {
            case 'primary':
                variantClass = "bg-blue-600 px-4 py-2 text-white hover:bg-blue-700";
                break;
            case 'danger':
                variantClass = "bg-red-600 px-4 py-2 text-white hover:bg-red-700";
                break;
            case 'outline':
                variantClass = "border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50";
                break;
            case 'ghost':
                variantClass = "border border-transparent p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900";
                break;
        }

        return (
            <button
                ref={ref}
                className={`${baseClass} ${variantClass} ${className}`}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {icon && !isLoading && <span className="h-4 w-4">{icon}</span>}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';
