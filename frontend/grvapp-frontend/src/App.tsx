
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PrivatePage from './pages/PrivatePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import RequireAuth from './components/RequireAuth';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoutes from './components/PrivateRoutes';
import PrivateHomePage from './pages/private/PrivateHomePage';
import PublicRoute from './components/PublicRoutes';
import { useToast } from './hooks/UseToast';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
function App() {
  return (
    <Router>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/registro" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/confirmar-email" element={<PublicRoute><ConfirmEmailPage /></PublicRoute>} />
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/no-autorizado" element={<UnauthorizedPage />} />

        {/* Privadas */}
        <Route path="/private" element={<PrivateRoutes />}>{/* esta es de prueba */}
          <Route path="home" element={<PrivateHomePage />} />
          {/* aquí irán más páginas privadas en el futuro */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>

  );
}

export default App;
