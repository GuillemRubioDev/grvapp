import React, { useState, useEffect, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaUserCircle, FaCamera, FaSpinner } from "react-icons/fa";
import ButtonHomeGrv from "../../components/buttons/ButtonHomeGrv";
import SpinnerGrv from "../../components/feedback/SpinnerGrv";
import { useUser } from "../../context/UserContext";
import TextInputGrv from "../../components/forms/TextInputGrv";
import { updateUserProfile, uploadProfileImage, getProfileImageUrl } from "../../services/api"; // Adjust path if needed
import toast from 'react-hot-toast';

const PrivateProfilePage = () => {
    const { t } = useTranslation();
    const { user, loading: userLoading, setUser } = useUser();

    // State for editable profile fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // State for image handling
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); // Currently selected file for upload
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // Local blob URL for immediate preview
    const [currentProfileImageUrl, setCurrentProfileImageUrl] = useState<string | null>(null); // URL of the currently saved profile image

    // Loading states
    const [isSaving, setIsSaving] = useState(false); // For text profile data
    const [isUploadingImage, setIsUploadingImage] = useState(false); // For image upload

    // State for cache-busting the profile image
    // Both key and timestamp are used for robustness, though one might often suffice.
    // Key forces React to re-create the img element, timestamp ensures URL is unique.
    const [profileImageKey, setProfileImageKey] = useState<string>(Date.now().toString());

    /**
     * Populates form fields and fetches the current profile image URL
     * when the user data is loaded or changed.
     */
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            // Ensure user.id is available before attempting to generate the image URL.
            // This is important as user data might be loaded asynchronously.
            if (user.id) {
                setCurrentProfileImageUrl(getProfileImageUrl(user.id));
            }
        }
    }, [user]); // Dependency: re-run when user object changes.

    /**
     * Cleans up the local object URL (blob URL) created for image preview
     * when the component unmounts or when the preview URL itself changes.
     * This prevents memory leaks.
     */
    useEffect(() => {
        return () => {
            if (imagePreviewUrl && imagePreviewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]); // Dependency: re-run when imagePreviewUrl changes.

    // Display spinner while user data is loading or if user/user.id is not yet available.
    if (userLoading || !user) return <SpinnerGrv />;
    if (!user.id) return <SpinnerGrv message={t('loadingUserSpecificData', 'Loading user data...')} />;

    /**
     * Handles the selection of a new profile image.
     * Creates a local preview and then immediately attempts to upload the image.
     * @param event The change event from the file input.
     */
    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImageFile(file); // Store the selected file

            // Create a local URL for immediate preview of the selected image.
            // Revoke any existing blob URL to prevent memory leaks.
            if (imagePreviewUrl && imagePreviewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            const newPreviewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(newPreviewUrl);

            // User ID is essential for the upload API endpoint.
            if (!user.id) {
                toast.error(t('errors.userIdMissing', "User ID is missing, cannot upload image."));
                return;
            }

            setIsUploadingImage(true);
            try {
                // Call the API service to upload the image.
                const updatedUser = await uploadProfileImage(user.id.toString(), file);
                toast.success(t('profile.imageUploadSuccess', 'Image uploaded successfully!'));

                // Update user context with the potentially updated user object from the backend.
                if (setUser) setUser(updatedUser);

                // Force refresh of the displayed profile image using cache-busting techniques.
                setProfileImageKey(Date.now().toString()); // Changing the key forces React to re-render the <img> element.
                setCurrentProfileImageUrl(`${getProfileImageUrl(user.id)}?t=${Date.now()}`); // Appending a timestamp makes the URL unique.

                setImagePreviewUrl(null); // Clear the local preview, as the main image should now reflect the uploaded version.
                setSelectedImageFile(null); // Clear the stored file.
            } catch (error) {
                console.error("Image upload failed:", error);
                toast.error(t('profile.imageUploadFailed', 'Image upload failed. Please try again.'));
                // Optionally, could clear imagePreviewUrl here to revert to the old image if upload fails.
            } finally {
                setIsUploadingImage(false);
            }
        }
    };

    /**
     * Handles saving changes to the user's first and last names.
     * Calls the API service to update the profile.
     */
    const handleSaveChanges = async () => {
        if (!user.id) {
            toast.error(t('errors.userIdMissing', "User ID is missing, cannot save changes."));
            return;
        }
        setIsSaving(true);
        try {
            const updatedUserData = await updateUserProfile(user.id.toString(), { firstName, lastName });
            toast.success(t('profile.profileUpdatedSuccess', 'Profile updated successfully!'));
            if (setUser) setUser(updatedUserData); // Update user context.
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error(t('profile.profileUpdateFailed', 'Profile update failed. Please try again.'));
        } finally {
            setIsSaving(false);
        }
    };

    // This variable was defined but not used. The JSX uses imagePreviewUrl and currentProfileImageUrl directly.
    // const displayImageUrl = imagePreviewUrl || `${currentProfileImageUrl}?key=${profileImageKey}`;

    return (
        <div className="max-w-2xl mx-auto bg-surface dark:bg-dark-surface rounded-xl shadow-lg p-8 mt-8">
            <div className="flex flex-col items-center gap-4">
                {/* Profile Image Display and Upload Section */}
                <div className="relative group w-32 h-32">
                    {isUploadingImage ? (
                        // Display a spinner while the image is uploading
                        <div className="w-32 h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                            <FaSpinner className="animate-spin text-4xl text-primary dark:text-dark-primary" />
                        </div>
                    ) : (
                        // Display image preview or current profile image
                        <>
                            {imagePreviewUrl ? (
                                // Show local preview if a new image has been selected
                                <img src={imagePreviewUrl} alt={t('profile.previewAlt', "Profile Preview")} className="w-32 h-32 rounded-full object-cover shadow-md" />
                            ) : currentProfileImageUrl ? (
                                // Show current profile image fetched from backend
                                <img
                                    key={profileImageKey} // React key: forces re-render if key changes (used for cache busting)
                                    src={currentProfileImageUrl} // Source URL, potentially with cache-busting timestamp
                                    alt={t('profile.alt', "Profile")}
                                    className="w-32 h-32 rounded-full object-cover shadow-md bg-gray-300 dark:bg-gray-600"
                                    onError={(e) => {
                                        // Image error handling:
                                        // 1. If the initial load fails, try once more with a cache-busting timestamp.
                                        // This can help if a CDN or browser cache serves a stale image after an update.
                                        const target = e.currentTarget;
                                        if (!target.src.includes('?t=')) {
                                            target.src = `${getProfileImageUrl(user.id)}?t=${Date.now()}`; // Use getProfileImageUrl to ensure base is correct
                                        } else {
                                           // 2. If the cache-busted version also fails, hide the <img> tag.
                                           // The fallback FaUserCircle icon will then be displayed.
                                           target.style.display = 'none';
                                        }
                                    }}
                                    onLoad={(e) => {
                                        // Ensure image is visible if it loads successfully (e.g., after an error and successful retry)
                                        e.currentTarget.style.display = 'block';
                                    }}
                                />
                            ) : null}

                            {/* Fallback Icon Logic:
                                Displayed if:
                                - No local image preview is active, AND
                                - EITHER no currentProfileImageUrl is set (user has no image)
                                - OR the <img> tag for currentProfileImageUrl is hidden due to loading error.
                                  (The DOM query here is a bit of a workaround for not having a dedicated 'imageLoadFailed' state,
                                   but often works for this kind of fallback).
                            */}
                            { !imagePreviewUrl && (!currentProfileImageUrl || (document.querySelector(`img[key="${profileImageKey}"]`) as HTMLImageElement)?.style.display === 'none' ) && (
                                 <FaUserCircle className="w-32 h-32 text-primary dark:text-dark-primary" />
                            )}
                        </>
                    )}
                    {/* Image upload button (camera icon), hidden during upload */}
                    {!isUploadingImage && (
                        <label htmlFor="profileImageInput" title={t('profile.changeImageTitle', "Change profile image")} className="absolute bottom-0 right-0 bg-secondary dark:bg-dark-secondary text-white p-2 rounded-full cursor-pointer hover:bg-secondary-dark dark:hover:bg-dark-secondary-dark transition-colors group-hover:opacity-100 opacity-0">
                            <FaCamera />
                        </label>
                    )}
                    <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={isUploadingImage}
                    />
                </div>

                <h2 className="text-2xl font-bold text-text dark:text-dark-text">
                    {firstName} {lastName}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    @{user.username || ""}
                </span>
            </div>

            <div className="mt-8 space-y-6">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-text dark:text-dark-text mb-1">
                        {t('profile.firstNameLabel', 'First Name')}
                    </label>
                    <TextInputGrv
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={t('profile.firstNamePlaceholder', 'Enter your first name')}
                        disabled={isSaving}
                    />
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-text dark:text-dark-text mb-1">
                        {t('profile.lastNameLabel', 'Last Name')}
                    </label>
                    <TextInputGrv
                        id="lastName"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={t('profile.lastNamePlaceholder', 'Enter your last name')}
                        disabled={isSaving}
                    />
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <FaEnvelope className="text-lg text-secondary dark:text-dark-secondary" />
                    <span className="text-text dark:text-dark-text">{user.email || ""}</span>
                </div>

                <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={isSaving || isUploadingImage}
                    className="w-full bg-primary hover:bg-primary-dark dark:bg-dark-primary dark:hover:bg-dark-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-surface dark:focus:ring-dark-primary disabled:opacity-50 flex items-center justify-center"
                >
                    {isSaving ? <FaSpinner className="animate-spin mr-2" /> : null}
                    {t('profile.saveChangesButton', 'Save Changes')}
                </button>

                <div className="mt-6 text-center">
                    <ButtonHomeGrv />
                </div>
            </div>
        </div>
    );
};

export default PrivateProfilePage;