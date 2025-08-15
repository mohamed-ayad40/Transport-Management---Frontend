import React from 'react';
import { clsx } from 'clsx';

const Card = ({
    children,
    title,
    subtitle,
    className = '',
    ...props
}) => {
    return (
        <div className={clsx('card', className)} {...props}>
            {(title || subtitle) && (
                <div className="card-header">
                    {title && (
                        <h3 className="card-title">{title}</h3>
                    )}
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card; 