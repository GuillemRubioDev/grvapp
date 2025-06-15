
/**
 * PublicRoute
 * -----------
 * Este componente se utiliza para proteger rutas públicas, como login o registro,
 * evitando que usuarios autenticados accedan a ellas.
 * 
 * ¿Cómo funciona?
 * - Comprueba si existe un token JWT en el localStorage.
 * - Si hay token, lo decodifica y verifica si está vigente (no expirado).
 *   - Si el token es válido y no ha expirado, redirige al usuario a la ruta privada principal (por ejemplo, "/private/home").
 *   - Si el token es inválido o ha expirado, permite el acceso a la ruta pública.
 * - Si no hay token, permite el acceso a la ruta pública.
 * 
 * Uso:
 * Envuelve rutas públicas para que los usuarios autenticados no puedan acceder a ellas.
 * 
 * Ejemplo:
 * <Route path="/login" element={
 *   <PublicRoute>
 *     <LoginPage />
 *   </PublicRoute>
 * } />
 */
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate } from 'react-router-dom';

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

