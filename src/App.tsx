import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.ts'; // Importa desde el hook
import { type ReactNode } from 'react';

// Se importan las páginas que vamos a crear
// import LoginPage from './pages/LoginPage.tsx';
// import RegisterPage from './pages/RegisterPage.tsx';
// import DashboardPage from './pages/DashboardPage.tsx';

// Define la interfaz para los props de la ruta protegida
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Aún no creamos las páginas, por lo que las comentamos.
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      */}
      <Route path="/" element={
        <ProtectedRoute>
          {/* <DashboardPage /> */}
          <p className='text-amber-500 text-2xl'>Ruta protegida</p>
        </ProtectedRoute>
      } />
      <Route path="*" element={<p>404 - Página no encontrada</p>} />
    </Routes>
  );
}

export default App;