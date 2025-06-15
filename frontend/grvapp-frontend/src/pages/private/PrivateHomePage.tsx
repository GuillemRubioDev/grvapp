import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PrivateNavbar from '../../components/layouts/PrivateNavbar';


interface DecodedToken {
    exp: number;
    sub: string;
}

const PrivateHomePage = () => {
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const [username, setUsername] = useState<string>('');
    const [roles, setRoles] = useState<string[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedRoles = localStorage.getItem('roles');

        if (!token) return;

        const decoded: DecodedToken = jwtDecode(token);
        setUsername(decoded.sub || 'Usuario');

        try {
            if (storedRoles) {
                const parsedRoles = JSON.parse(storedRoles);
                setRoles(Array.isArray(parsedRoles) ? parsedRoles : []);
            }
        } catch (e) {
            setRoles([]);
        }

        const updateCountdown = () => {
            const now = Math.floor(Date.now() / 1000);
            const diff = decoded.exp - now;
            setRemainingTime(diff > 0 ? diff : 0);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <><PrivateNavbar />
            {/* <PrivateLayout>
                <h1>dsd</h1>
                <main className="flex-1 flex flex-col items-center justify-start px-4 py-12 w-full bg-background dark:bg-dark-background text-text dark:text-dark-text">
                    <h1 className="text-2xl font-bold mb-4">{t("bienvenido", { username })}</h1>

                    <p className="mb-2">
                        {t("rol")}: <strong>{roles.join(', ')}</strong>
                    </p>

                    <p className="mb-8 flex items-center gap-2">
                        <FaHourglassHalf className="text-primary dark:text-dark-primary" />
                        <span>
                            {t("tiempoTokenRestante")}: <strong>{remainingTime}s</strong>
                        </span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <MenuCardGrv
                            title={t("entrenosTitulo")}
                            description={t("entrenosDescripcion")}
                            icon={<FaDumbbell className="text-xl" />}
                            onClick={() => alert("Ir a entrenos")}
                        />
                        <MenuCardGrv
                            title={t("dietasTitulo")}
                            description={t("dietasDescripcion")}
                            icon={<FaUtensils className="text-xl" />}
                            onClick={() => alert("Ir a dietas")}
                        />
                    </div>
                </main>
            </PrivateLayout> */}
        </>
    );

};

export default PrivateHomePage;
