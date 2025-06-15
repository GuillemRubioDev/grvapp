import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { MdCheckCircle, MdError } from "react-icons/md";

interface ToastProps {
    message: React.ReactNode; // Cambiado de string a React.ReactNode
    type?: "success" | "error";
    duration?: number;
    onClose: () => void;
}

const Toast = ({ message, type = "success", duration = 3000, onClose }: ToastProps) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const startFadeOut = setTimeout(() => setFadeOut(true), duration - 400);
        const remove = setTimeout(onClose, duration);

        return () => {
            clearTimeout(startFadeOut);
            clearTimeout(remove);
        };
    }, [duration, onClose]);

    const Icon = type === "success" ? MdCheckCircle : MdError;

const toast = (
    <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark-surface text-text dark:text-dark-text border-l-4 ${
            type === "success"
                ? "border-green-500 text-green-600"
                : "border-red-500 text-red-600"
        } px-5 py-3 rounded-xl shadow-lg flex flex-row items-center gap-3 z-[9999] min-w-[280px] max-w-[90vw] ${
            fadeOut ? "animate-fade-out" : "animate-fade-in"
        }`}
    >
        <div className="mr-2 flex-shrink-0 flex items-start">
            <Icon className="text-2xl" />
        </div>
        <div className="flex-1 text-sm font-medium text-center">
            {message}
        </div>
    </div>
);

    const toastRoot = document.getElementById("toast-root");
    return toastRoot ? ReactDOM.createPortal(toast, toastRoot) : null;
};

export default Toast;