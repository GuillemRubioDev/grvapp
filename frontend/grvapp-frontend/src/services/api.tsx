import axios from "axios";

// Puedes ajustar la URL base según tu entorno
const API_URL = "http://localhost:8080/api";

export const getUserProfile = async (username: string) => {

    const token = localStorage.getItem("token");

    console.log("Token:", token);
    console.log("URL:", `${API_URL}/users/${username}`);
    const response = await axios.get(`${API_URL}/users/${username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};