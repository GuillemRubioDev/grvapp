import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="bg-background dark:bg-dark-background text-text dark:text-dark-text min-h-screen flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold">{t("accesoDenegado")}</h2>
            <p className="mt-2">{t("debesIniciarSesion")}</p>
            <button
                onClick={() => navigate('/')}
                className="mt-4 bg-primary dark:bg-dark-primary text-white py-2 px-4 rounded hover:bg-secondary dark:hover:bg-dark-secondary"
            >
                {t("irAlLogin")}
            </button>
        </div>
    );
};

export default UnauthorizedPage;
