
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoutes from './components/ui/PrivateRoutes';
import PublicRoute from './components/ui/PublicRoutes';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import PrivateHomePage from './pages/private/PrivateHomePage';
import LoginPage from './pages/public/LoginPage';
import NotFoundPage from './pages/public/NotFoundPage';
import RegisterPage from './pages/public/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
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
