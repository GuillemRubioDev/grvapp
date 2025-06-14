import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const TextInput = ({ className, ...props }: TextInputProps) => {
    return (
        <input
            {...props}
            className={clsx(
                "w-full p-2 rounded border border-border dark:border-dark-border bg-background dark:bg-dark-background text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary transition",
                className
            )}
        />
    );
};

export default TextInput;
