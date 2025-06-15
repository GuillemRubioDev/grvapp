import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars, FaChartBar, FaCog, FaFolderOpen, FaSignOutAlt, FaUser, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SwitchThemeGrv from '../switches/SwitchThemeGrv';

interface DecodedToken {
    sub: string;
}

const PrivateNavbar = () => {
    const [appMenuOpen, setAppMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { t } = useTranslation();

    let username = 'Usuario';
    if (token) {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            username = decoded.sub;
        } catch { }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        navigate('/login');
    };

    return (
        <header className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border px-6 py-4 flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-50">
            {/* Menú app (izquierda) */}
            <div className="relative">
                <button
                    onClick={() => setAppMenuOpen(!appMenuOpen)}
                    className="text-sm font-semibold text-text dark:text-dark-text hover:text-primary dark:hover:text-dark-primary flex items-center gap-2"
                >
                    <FaBars /> {t("menu")}
                </button>

                {appMenuOpen && (
                    <ul className="absolute left-0 mt-2 w-48 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded shadow-md z-10">
                        <li className="px-4 py-2 text-text dark:text-dark-text hover:bg-border dark:hover:bg-dark-border cursor-pointer flex items-center gap-2">
                            <FaChartBar /> {t("dashboard")}
                        </li>
                        <li className="px-4 py-2 text-text dark:text-dark-text hover:bg-border dark:hover:bg-dark-border cursor-pointer flex items-center gap-2">
                            <FaUsers /> {t("usuarios")}
                        </li>
                        <li className="px-4 py-2 text-text dark:text-dark-text hover:bg-border dark:hover:bg-dark-border cursor-pointer flex items-center gap-2">
                            <FaChartBar /> {t("reportes")}
                        </li>
                        <li className="px-4 py-2 text-text dark:text-dark-text hover:bg-border dark:hover:bg-dark-border cursor-pointer flex items-center gap-2">
                            <FaCog /> {t("configuracion")}
                        </li>
                        <li className="px-4 py-2 text-text dark:text-dark-text hover:bg-border dark:hover:bg-dark-border cursor-pointer flex items-center gap-2">
                            <FaFolderOpen /> {t("otrasSecciones")}
                        </li>
                    </ul>
                )}
            </div>

            {/* Menú usuario (derecha) */}
            <div className="relative">
                <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="text-sm text-text dark:text-dark-text hover:text-primary dark:hover:text-dark-primary"
                >
                    {username} ⌄
                </button>

                {userMenuOpen && (
                    <ul className="absolute right-0 mt-2 w-56 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded shadow-md z-10">
                        <li className="px-4 py-2 flex items-center gap-2 text-text dark:text-dark-text hover:bg-border dark:hover:bg-dark-border cursor-pointer">
                            <FaUser /> {t("perfil")}
                        </li>
                        <li className="px-4 py-2 flex items-center justify-between gap-2 text-text dark:text-dark-text hover:bg-border dark:hover:bg-dark-border cursor-pointer">
                            <span className="flex items-center gap-2">
                                <FaCog /> {t("modoOscuro")}
                            </span>
                            <SwitchThemeGrv />
                        </li>
                        <li
                            onClick={handleLogout}
                            className="px-4 py-2 flex items-center gap-2 text-text dark:text-dark-text hover:bg-border dark:hover:bg-dark-border cursor-pointer"
                        >
                            <FaSignOutAlt /> {t("cerrarSesion")}
                        </li>
                    </ul>
                )}
            </div>
        </header>
    );
};

export default PrivateNavbar;

