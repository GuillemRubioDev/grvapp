import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const ToggleThemeSwitch = () => {
    const { theme, toggleTheme } = useTheme();
    const enabled = theme === "dark";

    return (
        <div
            onClick={toggleTheme}
            className={`w-10 h-5 flex items-center rounded-full p-[2px] cursor-pointer transition-colors duration-300
        ${enabled ? "bg-gray-600 dark:bg-gray-400" : "bg-gray-300 dark:bg-gray-600"}`}
        >
            <div
                className={`w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ease-in-out flex items-center justify-center text-xs
          ${enabled ? "translate-x-[1.125rem] bg-dark-primary" : "translate-x-0 bg-primary"}`}
            >
                {enabled ? <FaMoon className="text-white" /> : <FaSun className="text-white" />}
            </div>
        </div>
    );
};

export default ToggleThemeSwitch;

