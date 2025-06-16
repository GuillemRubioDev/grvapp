import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getUserProfile } from "../services/api";

export interface UserProfile {
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

interface UserContextType {
    user: UserProfile | null;
    loading: boolean;
}

export const UserContext = createContext<UserContextType>({ user: null, loading: true });

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (username) {
            getUserProfile(username)
                .then(setUser)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    //*Para hacer pruebas dandoole 3 segundos para ver el spinner}
    // useEffect(() => {
    //     const username = localStorage.getItem("username");
    //     if (username) {
    //         getUserProfile(username)
    //             .then(setUser)
    //             .finally(() => {
    //                 setTimeout(() => setLoading(false), 3000); // Fuerza 3 segundos de spinner
    //             });
    //     } else {
    //         setTimeout(() => setLoading(false), 3000); // También fuerza 3 segundos si no hay usuario
    //     }
    // }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);