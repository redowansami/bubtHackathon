import React from 'react';

export const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    error,
    placeholder = '',
    required = false,
    disabled = false,
    className = '',
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-600 ml-1">*</span>}
                </label>
            )}
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-500' : ''
                    }`}
            />
            {error && <p className="text-red-600 text-sm font-medium mt-1">{error}</p>}
        </div>
    );
};

export default Input;
