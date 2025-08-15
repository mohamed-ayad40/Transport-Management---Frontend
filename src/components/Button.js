import React from 'react';
import { clsx } from 'clsx';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
    ...props
}) => {
    const baseClasses = 'btn font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
        danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
        warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
    };

    const classes = clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
    );

    return (
        <button
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="loading ml-2" />
            )}
            {children}
        </button>
    );
};

export default Button;