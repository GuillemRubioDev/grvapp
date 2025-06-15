import React from 'react';

interface TextInputGrvProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  className?: string;
}

const TextInputGrv: React.FC<TextInputGrvProps> = ({
  icon,
  className = '',
  ...props
}) => (
  <div className="relative mb-4">
    {icon && (
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text dark:text-dark-text">
        {icon}
      </span>
    )}
    <input
      {...props}
      className={`w-full pl-10 p-2 rounded border border-border dark:border-dark-border bg-background dark:bg-dark-background text-text dark:text-dark-text ${className}`}
    />
  </div>
);

export default TextInputGrv;