import axios from "axios";
import { User } from "../context/UserContext"; // Assuming User type is available here

// Base URL is already defined
const API_URL = "http://localhost:8080/api"; // Keep existing or use environment variable

// Helper to get token, to keep it DRY
/**
 * Retrieves authentication headers.
 * Reads the JWT token from localStorage.
 * @returns An object containing the Authorization header if token is found, otherwise an empty object.
 * @remarks In a production app, missing token might trigger a redirect to login or throw an error.
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.warn("Authentication token not found. API calls may fail.");
        // Depending on app strategy, could throw an error here or return a more specific signal.
        return {};
    }
    return { Authorization: `Bearer ${token}` };
};

/**
 * Fetches a user's profile by their username.
 * @param username The username of the user to fetch.
 * @returns A Promise resolving to the User object.
 * @throws Will throw an error if the request fails (e.g., network error, user not found).
 */
export const getUserProfile = async (username: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/users/username/${username}`, {
        headers: getAuthHeaders(),
    });
    return response.data; // Axios automatically throws for non-2xx responses
};

/**
 * Updates a user's profile information.
 * @param userId The ID of the user to update.
 * @param data An object containing the fields to update (e.g., firstName, lastName).
 * @returns A Promise resolving to the updated User object.
 * @throws Will throw an error if the request fails.
 */
export const updateUserProfile = async (userId: string, data: { firstName?: string, lastName?: string }): Promise<User> => {
    const response = await axios.put(`${API_URL}/users/${userId}/profile`, data, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
    });
    // Axios throws an error for non-2xx status codes by default.
    // The explicit check below is redundant if this default behavior is relied upon.
    // However, if specific handling for statuses like 201, 204 were needed without error,
    // then more detailed checks or axios's `validateStatus` option would be used.
    if (response.status !== 200) {
        throw new Error(response.data?.message || 'Failed to update profile');
    }
    return response.data;
};

/**
 * Uploads a profile image for the specified user.
 * @param userId The ID of the user for whom the image is being uploaded.
 * @param imageFile The image file to upload.
 * @returns A Promise resolving to the updated User object (assuming the backend returns this).
 * @throws Will throw an error if the request fails.
 */
export const uploadProfileImage = async (userId: string, imageFile: File): Promise<User> => {
    const formData = new FormData();
    formData.append('image', imageFile); // "image" must match @RequestParam name in backend

    const response = await axios.post(`${API_URL}/users/${userId}/image`, formData, {
        headers: {
            ...getAuthHeaders(),
            // 'Content-Type': 'multipart/form-data' is automatically set by the browser
            // when using FormData with axios/fetch, including the boundary.
            // Manually setting it can lead to errors.
        },
    });
    // Similar to updateUserProfile, axios handles non-2xx errors by default.
    if (response.status !== 200) {
        throw new Error(response.data?.message || 'Failed to upload image');
    }
    return response.data;
};

/**
 * Constructs the URL for a user's profile image.
 * @param userId The ID of the user.
 * @returns The full URL string to the user's profile image.
 */
export const getProfileImageUrl = (userId: string | number): string => {
    return `${API_URL}/users/${userId}/image`;
};