
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateLayout from './components/layouts/PrivateLayout';
import PrivateRoutes from './components/ui/PrivateRoutes';
import PublicRoute from './components/ui/PublicRoutes';
import { UserProvider } from './context/UserContext';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import PrivateHomePage from './pages/private/PrivateHomePage';
import PrivateProfilePage from './pages/private/PrivateProfilePage';
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
        <Route element={<PrivateRoutes />}>
          <Route
            element={
              <UserProvider>
                <PrivateLayout />
              </UserProvider>
            }
          >
            <Route path="/private/home" element={<PrivateHomePage />} />
            <Route path="/private/perfil" element={<PrivateProfilePage />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>

  );
}

export default App;
