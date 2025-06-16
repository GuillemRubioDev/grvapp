import { useTranslation } from "react-i18next";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import ButtonHomeGrv from "../../components/buttons/ButtonHomeGrv";
import SpinnerGrv from "../../components/feedback/SpinnerGrv";
import { useUser } from "../../context/UserContext";

const PrivateProfilePage = () => {
    const { t } = useTranslation();
    const { user, loading } = useUser();

    if (loading || !user) return <SpinnerGrv />;

    return (
        <div className="max-w-xl mx-auto bg-surface dark:bg-dark-surface rounded-xl shadow-lg p-8 mt-8">
            <div className="flex flex-col items-center gap-2">
                <FaUserCircle className="text-6xl text-primary dark:text-dark-primary mb-2" />
                <h2 className="text-2xl font-bold text-text dark:text-dark-text mb-1">
                    {(user.firstName || "") + " " + (user.lastName || "")}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    @{user.username || ""}
                </span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-3">
                    <FaEnvelope className="text-lg text-secondary dark:text-dark-secondary" />
                    <span className="text-text dark:text-dark-text">{user.email || ""}</span>
                </div>
                <ButtonHomeGrv />
            </div>


        </div>
    );
};

export default PrivateProfilePage;