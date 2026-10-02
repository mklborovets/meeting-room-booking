import { ReactNode } from 'react';

export interface EmptyStateProps {
    title: string;
    description: string;
    icon: ReactNode;
    action?: ReactNode;
}

export const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                {icon}
            </div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
};
