import type { ReactNode } from "react";


interface DashboardCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    onClick?: () => void;
}

const DashboardCard = ({ title, description, icon, onClick }: DashboardCardProps) => {
    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-surface dark:bg-dark-surface text-text dark:text-dark-text border border-border dark:border-dark-border rounded-xl shadow-md p-6 flex flex-col items-center justify-center transition transform hover:-translate-y-1 hover:shadow-lg duration-300 w-64 h-40"
        >
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-center text-text/70 dark:text-dark-text/70">{description}</p>
        </div>
    );
};

export default DashboardCard;
