import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ButtonHomeGrvProps {
    className?: string;
    label?: string;
}

const ButtonHomeGrv: React.FC<ButtonHomeGrvProps> = ({ className = "", label = "Home" }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/private/home")}
            className={`flex items-center gap-2 px-4 py-2 rounded bg-primary dark:bg-dark-primary text-white hover:bg-secondary dark:hover:bg-dark-secondary transition-colors ${className}`}
        >
            <FaHome />
            {label}
        </button>
    );
};

export default ButtonHomeGrv;