// context/ToastContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import Toast from "../components/ui/Toast";

interface ToastData {
    message: string;
    icon: string;
}

const ToastContext = createContext<{
    showToast: (message: string, icon?: string) => void;
} | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<ToastData | null>(null);

    const showToast = (message: string, icon = "✅") => {
        setToast({ message, icon });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast debe usarse dentro de ToastProvider");
    }
    return context;
};
