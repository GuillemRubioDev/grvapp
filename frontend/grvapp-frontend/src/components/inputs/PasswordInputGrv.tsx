import React from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

interface PasswordInputGrvProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
    requiredMark?: React.ReactNode;
}

const PasswordInputGrv: React.FC<PasswordInputGrvProps> = ({
    value,
    onChange,
    placeholder,
    showPassword,
    setShowPassword,
    className = '',
    requiredMark,
    ...props
}) => (
    <div className="relative mb-4">
        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text dark:text-dark-text" />
        <input
            {...props}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
            placeholder={placeholder}
            className={`w-full pl-10 pr-10 p-2 rounded border border-border dark:border-dark-border bg-background dark:bg-dark-background text-text dark:text-dark-text ${className}`}
        />
        <button
            type="button"
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-text dark:text-dark-text"
            onClick={() => setShowPassword(v => !v)}
            tabIndex={-1}
        >
            {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
        {requiredMark && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-danger">{requiredMark}</span>
        )}
    </div>
);
export default PasswordInputGrv;