import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/UseToast';


const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const { t } = useTranslation();

    const navigate = useNavigate();
    const { showToast, ToastComponent } = useToast();

    const handleRegister = async () => {
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

            showToast(response.data.message || "Registro exitoso", 'success');
            navigate('/login');
        } catch (err: any) {
            showToast(err.response?.data?.message || "Registro fallido", 'error');
        }
    };

    return (
        <>
            <div className="bg-surface dark:bg-dark-surface p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-text dark:text-dark-text">{t("registroNuevoUsuario")}</h2>

                <input
                    placeholder={t("nombre")}
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full p-2 mb-3 rounded border"
                />

                <input
                    placeholder={t("apellido")}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full p-2 mb-3 rounded border"
                />

                <select
                    value={documentType}
                    onChange={e => setDocumentType(e.target.value)}
                    className="w-full p-2 mb-3 rounded border"
                >
                    <option value="">{t("tipoDocumento")}</option>
                    <option value="DNI">{t("documento.DNI")}</option>
                    <option value="NIE">{t("documento.NIE")}</option>
                    <option value="PASSPORT">{t("documento.PASSPORT")}</option>
                </select>

                <input
                    placeholder={t("numeroDocumento")}
                    value={documentNumber}
                    onChange={e => setDocumentNumber(e.target.value)}
                    className="w-full p-2 mb-3 rounded border"
                />

                <input
                    placeholder={t("usuario")}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full p-2 mb-3 rounded border"
                />

                <input
                    placeholder={t("correoElectronico")}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 mb-3 rounded border"
                />

                <input
                    placeholder={t("contrasena")}
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 rounded border"
                />

                <button
                    onClick={handleRegister}
                    className="w-full bg-primary text-white py-2 rounded hover:bg-secondary"
                >
                    {t("registrarse")}
                </button>
            </div>

            {ToastComponent}
        </>
    );
};

export default RegisterForm;
