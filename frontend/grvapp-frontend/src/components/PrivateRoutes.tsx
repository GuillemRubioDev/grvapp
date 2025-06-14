import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom';

interface DecodedToken {
    exp: number;
}

const PrivateRoutes = () => {
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/login" />;

    try {
        const decoded: DecodedToken = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }

        return <Outlet />;
    } catch (e) {
        return <Navigate to="/login" />;
    }
};

export default PrivateRoutes;
