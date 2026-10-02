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
                {...props}
                className={`${baseClass} ${variantClass} ${className}`}
                disabled={isLoading || props.disabled}
            >
                {isLoading && (
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {icon && !isLoading && (
                    <span className="flex shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
                        {icon}
                    </span>
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';
