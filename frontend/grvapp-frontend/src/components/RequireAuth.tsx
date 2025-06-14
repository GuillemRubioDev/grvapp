import { jwtDecode } from 'jwt-decode';
import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';


interface Props {
    children: ReactElement;
}

interface DecodedToken {
    exp: number;
}

const RequireAuth = ({ children }: Props) => {
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/no-autorizado" />;

    try {
        const decoded: DecodedToken = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp < now) {
            localStorage.removeItem('token');
            return <Navigate to="/no-autorizado" />;
        }

        return children;
    } catch (e) {
        return <Navigate to="/no-autorizado" />;
    }
};

export default RequireAuth;
