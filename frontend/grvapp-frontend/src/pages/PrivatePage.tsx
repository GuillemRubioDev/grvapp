import { useTranslation } from "react-i18next";

const PrivatePage = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-background dark:bg-dark-background min-h-screen p-8 text-text dark:text-dark-text">
            <h2 className="text-2xl font-bold mb-2">{t("zonaPrivadaTitulo")}</h2>
            <p>{t("zonaPrivadaDescripcion")}</p>
        </div>
    );
};

export default PrivatePage;
