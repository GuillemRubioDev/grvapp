import { useTranslation } from "react-i18next";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import ButtonHomeGrv from "../../components/buttons/ButtonHomeGrv";
import SpinnerGrv from "../../components/feedback/SpinnerGrv";
import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react"; // Added useState and useEffect
import TextInputGrv from "../../components/inputs/TextInputGrv"; // Added TextInputGrv

const PrivateProfilePage = () => {
    const { t } = useTranslation();
    const { user, loading } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
            });
        }
    }, [user]);

    if (loading || !user) return <SpinnerGrv />;

    const handleEdit = () => {
        setIsEditing(true);
        setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
        });
    };

    const handleSave = () => {
        console.log("Saving:", formData);
        // Placeholder for API call: api.updateUserProfile(formData)
        setIsEditing(false);
        // Optional: updateUser({ ...user, ...formData });
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset formData if needed, but it's re-initialized on edit
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-xl mx-auto bg-surface dark:bg-dark-surface rounded-xl shadow-lg p-8 mt-8">
            <div className="flex flex-col items-center gap-2">
                {user.profilePictureUrl ? (
                    <img
                        src={user.profilePictureUrl}
                        alt={t("profile.pictureAltText", { name: (user.firstName || "") + " " + (user.lastName || "") })}
                        className="w-24 h-24 rounded-full object-cover mb-2 shadow-md"
                    />
                ) : (
                    <FaUserCircle className="text-6xl text-primary dark:text-dark-primary mb-2" />
                )}
                {isEditing ? (
                    <div className="w-full flex flex-col gap-4 mb-4">
                        <TextInputGrv
                            label={t("profile.firstNameLabel")}
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder={t("profile.firstNamePlaceholder") || "Enter first name"}
                        />
                        <TextInputGrv
                            label={t("profile.lastNameLabel")}
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder={t("profile.lastNamePlaceholder") || "Enter last name"}
                        />
                    </div>
                ) : (
                    <h2 className="text-2xl font-bold text-text dark:text-dark-text mb-1">
                        {(user.firstName || "") + " " + (user.lastName || "")}
                    </h2>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    @{user.username || ""}
                </span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-3">
                    <FaEnvelope className="text-lg text-secondary dark:text-dark-secondary" />
                    <span className="text-text dark:text-dark-text">{user.email || ""}</span>
                </div>

                {isEditing ? (
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-opacity-50"
                        >
                            {t("common.save")}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-focus focus:ring-opacity-50"
                        >
                            {t("common.cancel")}
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleEdit}
                            className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary-focus focus:ring-opacity-50"
                        >
                            {t("profile.editProfileButton")}
                        </button>
                    </div>
                )}
                <div className="mt-4"> {/* Added margin top for spacing */}
                  <ButtonHomeGrv />
                </div>
            </div>
        </div>
    );
};

export default PrivateProfilePage;