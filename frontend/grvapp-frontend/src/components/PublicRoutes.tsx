import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    exp: number;
}

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp > now) {
                return <Navigate to="/private/home" />;
            }
        } catch (e) {
            // Token inválido, continuar
        }
    }

    return children;
};

export default PublicRoute;

