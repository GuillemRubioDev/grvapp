import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <main className="grid min-h-screen place-items-center bg-background dark:bg-dark-background px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-primary dark:text-dark-primary">404</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-text dark:text-dark-text sm:text-7xl">
                    {t("paginaNoEncontrada")}
                </h1>
                <p className="mt-6 text-lg text-text/70 dark:text-dark-text/70">
                    {t("descripcion404")}
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="rounded-md bg-primary dark:bg-dark-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary dark:hover:bg-dark-secondary"
                    >
                        {t("volverAlInicio")}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default NotFoundPage;
