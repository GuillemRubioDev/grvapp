import { useState } from "react";
import Toast from "../components/feedback/ToastGrv";

type ToastType = "success" | "error";

export const useToast = () => {
    const [toast, setToast] = useState<{
        message: React.ReactNode; // Cambiado de string a React.ReactNode
        type: ToastType;
    } | null>(null);

    const showToast = (message: React.ReactNode, type: ToastType = "success") => { // Cambiado de string a React.ReactNode
        setToast({ message, type });
    };

    const ToastComponent = toast ? (
        <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
        />
    ) : null;

    return { showToast, ToastComponent };
};