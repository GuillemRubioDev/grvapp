import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    return (
        <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 bg-primary text-white p-2 rounded"
        >
            {t("cambiarTemaA")}  {t(theme === "light" ? "modoOscuro" : "modoClaro")}
        </button>
    );
};

export default ThemeToggle;
