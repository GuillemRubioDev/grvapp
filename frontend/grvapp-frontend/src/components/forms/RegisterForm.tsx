import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiEye, FiEyeOff, FiFileText, FiHash, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/UseToast';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const { t } = useTranslation();

    const navigate = useNavigate();
    const { showToast, ToastComponent } = useToast();

    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length > 0;
    const isUsernameValid = username.length > 0;
    const isRepeatPasswordValid = repeatPassword === password && repeatPassword.length > 0;

    const isFormValid = isEmailValid && isPasswordValid && isUsernameValid && isRepeatPasswordValid;

    // Helper para el asterisco rojo
    const Required = () => <span className="text-danger">*</span>;

    const handleRegister = async () => {
    if (!isFormValid) return;
    try {
        const response = await axios.post('http://localhost:8080/api/auth/register', {
            username,
            password,
            email,
            firstName,
            lastName,
            documentType,
            documentNumber
        });

        showToast(t(response.data.message) || t("registroOk"), 'success');
        navigate('/login');
      } catch (err: any) {
        if (err.response && err.response.data && err.response.data.message) {
            const { message } = err.response.data;
            showToast(t(message), 'error');
        } else {
            showToast(t("registroKo"), 'error');
        }
    }
};

    return (
        <>
            <div className="bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-lg w-full max-w-md mx-auto flex flex-col gap-4">
                <h2 className="text-2xl font-bold mb-6 text-text dark:text-dark-text text-center">{t("registroNuevoUsuario")}</h2>

                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder={t("nombre")}
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="w-full p-2 pl-10 rounded border bg-transparent text-text dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text"
                        />
                    </div>

                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder={t("apellido")}
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="w-full p-2 pl-10 rounded border bg-transparent text-text dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text"
                        />
                    </div>

                    <div className="relative">
                        <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={documentType}
                            onChange={e => setDocumentType(e.target.value)}
                            className="w-full p-2 pl-10 rounded border bg-transparent text-text dark:text-dark-text"
                        >
                            <option value="">{t("tipoDocumento")}</option>
                            <option value="DNI">{t("documento.DNI")}</option>
                            <option value="NIE">{t("documento.NIE")}</option>
                            <option value="PASSPORT">{t("documento.PASSPORT")}</option>
                        </select>
                    </div>

                    <div className="relative">
                        <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder={t("numeroDocumento")}
                            value={documentNumber}
                            onChange={e => setDocumentNumber(e.target.value)}
                            className="w-full p-2 pl-10 rounded border bg-transparent text-text dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text"
                        />
                    </div>

                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder={t("usuario")}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full p-2 pl-10 rounded border bg-transparent text-text dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2"><Required /></span>
                    </div>

                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder={t("correoElectronico")}
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 pl-10 rounded border bg-transparent text-text dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2"><Required /></span>
                        {email && !isEmailValid && (
                            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-danger text-xs">{t("emailInvalido") || "Email inválido"}</span>
                        )}
                    </div>

                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder={t("contrasena")}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-2 pl-10 pr-10 rounded border bg-transparent text-text dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text"
                        />
                        <button
                            type="button"
                            className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400"
                            onClick={() => setShowPassword(v => !v)}
                            tabIndex={-1}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2"><Required /></span>
                    </div>

                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder={t("repetirContrasena")}
                            type={showRepeatPassword ? "text" : "password"}
                            value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                            className="w-full p-2 pl-10 pr-10 rounded border bg-transparent text-text dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text"
                        />
                        <button
                            type="button"
                            className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400"
                            onClick={() => setShowRepeatPassword(v => !v)}
                            tabIndex={-1}
                        >
                            {showRepeatPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2"><Required /></span>
                        {repeatPassword && !isRepeatPasswordValid && (
                            <span className="absolute right-16 top-1/2 -translate-y-1/2 text-danger text-xs">{t("contrasenasNoCoinciden") || "No coinciden"}</span>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleRegister}
                    className={`w-full bg-primary dark:bg-dark-primary text-white py-2 rounded mt-4 font-semibold hover:bg-secondary dark:hover:bg-dark-secondary transition-colors ${!isFormValid && 'opacity-50 cursor-not-allowed'}`}
                    disabled={!isFormValid}
                >
                    {t("registrarse")}
                </button>

                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    <Required /> {t("camposRequeridos") || "Los campos marcados con * son obligatorios."}
                </div>

                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-primary dark:text-dark-primary mb-2 hover:underline w-fit"
                    type="button"
                >
                    <FiArrowLeft className="text-lg" />
                    {t("volverLogin") || "Volver al login"}
                </button>
            </div>
            {ToastComponent}
        </>
    );
};

export default RegisterForm;