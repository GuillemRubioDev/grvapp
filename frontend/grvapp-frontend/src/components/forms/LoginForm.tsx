import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/UseToast';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { showToast, ToastComponent } = useToast();
    const { t } = useTranslation();
    const isFormValid = username.trim() !== '' && password.trim() !== '';


    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password,
            });

            const token = response.data.token;
            const roles = response.data.roles;

            localStorage.setItem('token', token);
            localStorage.setItem('roles', JSON.stringify(roles));

            showToast(t('loginOk'), 'success');

            setTimeout(() => {
                navigate('/private/home');
            }, 300);
        } catch {
            showToast(t('loginKo'), 'error');
        }
    };

    return (
        <>
            <div className="bg-surface dark:bg-dark-surface p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl text-primary dark:text-dark-primary font-semibold mb-6 text-center">
                    Login GRVA_APP
                </h2>

                {/* Campo Usuario */}
                <div className="relative mb-4">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text dark:text-dark-text" />
                    <input
                        type="text"
                        placeholder={t('usuario')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 p-2 rounded border border-border dark:border-dark-border bg-background dark:bg-dark-background text-text dark:text-dark-text"
                    />
                </div>

                {/* Campo Contraseña */}
                <div className="relative mb-4">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text dark:text-dark-text" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 p-2 rounded border border-border dark:border-dark-border bg-background dark:bg-dark-background text-text dark:text-dark-text"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text dark:text-dark-text focus:outline-none"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Boton Login */}
                <button
                    onClick={handleLogin}
                    disabled={!isFormValid}
                    className={`w-full py-2 rounded transition-colors ${isFormValid
                        ? 'bg-primary dark:bg-dark-primary text-white hover:bg-secondary dark:hover:bg-dark-secondary'
                        : 'bg-gray-400 cursor-not-allowed text-white'
                        }`}
                >
                    {t('login')}
                </button>

                {/* Boton Registrarse */}
                <button
                    onClick={() => navigate('/registro')}
                    className="w-full mt-3 text-sm text-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-dark-primary underline"
                >
                    {t('registrarse')}
                </button>
            </div>

            {ToastComponent}
        </>
    );
};

export default LoginForm;
