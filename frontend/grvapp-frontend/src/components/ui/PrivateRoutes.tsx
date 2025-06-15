/**
 * PrivateRoutes
 * --------------
 * Este componente actúa como un "guard" para rutas privadas en la aplicación.
 * 
 * ¿Cómo funciona?
 * - Comprueba si existe un token JWT en el localStorage.
 * - Si no hay token, redirige al usuario a la página de login.
 * - Si hay token, lo decodifica y verifica si ha expirado.
 *   - Si el token ha expirado, lo elimina del localStorage y redirige al login.
 *   - Si el token es válido, renderiza el componente <Outlet />, permitiendo el acceso a las rutas hijas protegidas.
 * - Si ocurre algún error al decodificar el token, también redirige al login.
 * 
 * Uso:
 * Este componente se utiliza en la configuración de rutas (por ejemplo, con React Router)
 * para envolver rutas que solo deben ser accesibles por usuarios autenticados.
 * 
 * Ejemplo:
 * <Route element={<PrivateRoutes />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 */
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


