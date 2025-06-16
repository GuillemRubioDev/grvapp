import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/UseToast";
import PasswordInputGrv from "../inputs/PasswordInputGrv";
import TextInputGrv from "../inputs/TextInputGrv";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { showToast, ToastComponent } = useToast();
    const { t } = useTranslation();
    const isFormValid = username.trim() !== "" && password.trim() !== "";

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    username,
                    password,
                }
            );

            const token = response.data.token;
            const roles = response.data.roles;

            localStorage.setItem('username', username);
            localStorage.setItem("token", token);
            localStorage.setItem("roles", JSON.stringify(roles));

            showToast(t("loginOk"), "success");

            setTimeout(() => {
                navigate("/private/home");
            }, 300);
        } catch (error: any) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {

                const { message, remainingAttempts } = error.response.data;
                let toastMsg: React.ReactNode = t(message);
                if (typeof remainingAttempts === "number" && remainingAttempts > 0) {
                    toastMsg = (
                        <>
                            {t(message)}
                            <br />
                            <span className="block w-full text-center">
                                {t("leQuedanIntentos")} {remainingAttempts} {t("intentos")}
                            </span>
                        </>
                    );
                }
                showToast(toastMsg, "error");
            } else {
                showToast(t("loginKo"), "error");
            }
        }
    };

    return (
        <>
            <div className="bg-surface dark:bg-dark-surface p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl text-primary dark:text-dark-primary font-semibold mb-6 text-center">
                    Login GRVA_APP
                </h2>

                {/* Campo Usuario */}
                <TextInputGrv
                    type="text"
                    placeholder={t("usuario")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    icon={<FaUser />}
                />

                {/* Campo Contraseña */}
                <PasswordInputGrv
                    placeholder={t("password")}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />

                {/* Boton Login */}
                <button
                    onClick={handleLogin}
                    disabled={!isFormValid}
                    className={`w-full py-2 rounded transition-colors ${isFormValid
                        ? "bg-primary dark:bg-dark-primary text-white hover:bg-secondary dark:hover:bg-dark-secondary"
                        : "bg-gray-400 cursor-not-allowed text-white"
                        }`}
                >
                    {t("login")}
                </button>

                {/* Boton Registrarse */}
                <button
                    onClick={() => navigate("/registro")}
                    className="w-full mt-3 text-sm text-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-dark-primary underline"
                >
                    {t("registrarse")}
                </button>
            </div>

            {ToastComponent}
        </>
    );
};

export default LoginForm;
