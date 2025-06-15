import { createContext, useContext, useState, type ReactNode } from "react";
import Toast from "../components/ui/Toast";

interface ToastData {
    message: React.ReactNode;
    type: "success" | "error";
}

const ToastContext = createContext<{
    showToast: (message: React.ReactNode, type?: "success" | "error") => void;
} | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<ToastData | null>(null);

    const showToast = (message: React.ReactNode, type: "success" | "error" = "success") => {
        setToast({ message, type });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
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