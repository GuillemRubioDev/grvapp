import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaExclamationTriangle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";


const ConfirmEmail = () => {
    const [params] = useSearchParams();
    const [status, setStatus] = useState<React.ReactNode>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const token = params.get("token");

        if (!token) {
            setStatus(
                <span className="flex items-center gap-2 text-red-600">
                    <FaTimesCircle /> {t("tokenNoProporcionado")}
                </span>
            );
            return;
        }

        setStatus(
            <span className="flex items-center gap-2 text-yellow-500">
                <FaHourglassHalf /> {t("validandoToken")}
            </span>
        );

        axios
            .get(`http://localhost:8080/api/auth/confirm?token=${token}`)
            .then((res) => {
                if (res.data?.message === "tokenValidadoOK") {
                    setStatus(
                        <span className="flex items-center gap-2 text-green-600">
                            <FaCheckCircle /> {t("tokenValidadoOK")}
                        </span>
                    );
                } else {
                    setStatus(
                        <span className="flex items-center gap-2 text-red-600">
                            <FaExclamationTriangle /> {t("respuestaInesperada")}
                        </span>
                    );
                }
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || "";
                if (msg === "tokenValidadoKO") {
                    setStatus(
                        <span className="flex items-center gap-2 text-red-600">
                            <FaTimesCircle /> {t("tokenValidadoKO")}
                        </span>
                    );
                } else {
                    setStatus(
                        <span className="flex items-center gap-2 text-red-600">
                            <FaExclamationTriangle /> {t("errorInesperado")}
                        </span>
                    );
                }
            });
    }, []);



    return (
        <div className="text-center p-4">
            <h2 className="text-xl font-bold">{status}</h2>
        </div>
    );
};

export default ConfirmEmail;
