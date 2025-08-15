import React from 'react';
import { clsx } from 'clsx';

const Input = React.forwardRef(
    ({ label, error, helperText, className = '', onChange, ...props }, ref) => {
        const inputClasses = clsx(
            'input',
            error && 'input-error',
            className
        );

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref} // ✅ Forward RHF's ref
                    className={inputClasses}
                    {...props} // ✅ Includes RHF's name, onBlur, etc.
                    onChange={(e) => {
                        if (onChange) onChange(e); // ✅ Your custom onChange
                        if (props.onChange) props.onChange(e); // ✅ RHF's onChange
                    }}
                />
                {error && (
                    <p className="mt-1 text-sm text-danger-600">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input'; // ✅ Required for forwardRef

export default Input;