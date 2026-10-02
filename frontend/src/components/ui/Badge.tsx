export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'secondary';
    icon?: React.ReactNode;
}

export const Badge = ({ children, variant = 'primary', icon }: BadgeProps) => {
    let variantClass = '';
    switch (variant) {
        case 'primary':
            variantClass = 'bg-blue-50 text-blue-700';
            break;
        case 'success':
            variantClass = 'bg-green-50 text-green-700';
            break;
        case 'secondary':
            variantClass = 'bg-gray-100 text-gray-700';
            break;
    }

    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClass}`}>
            {icon && <span className="h-3 w-3">{icon}</span>}
            {children}
        </span>
    );
};
