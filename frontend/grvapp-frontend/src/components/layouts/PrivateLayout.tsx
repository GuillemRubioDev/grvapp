
import type { ReactNode } from "react";
import PrivateNavbar from "./PrivateNavbar";


const PrivateLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col bg-background dark:bg-dark-background text-text dark:text-dark-text">
            <PrivateNavbar />
            <main className="flex-1 pt-20 px-4">
                {children}
            </main>
        </div>
    );
};

export default PrivateLayout;

