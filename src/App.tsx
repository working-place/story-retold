import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import './App.scss';
import "../src/globals.scss";
import HomePage from './pages/main/HomePage/HomePage';
import LoginPage from "./pages/auth/LoginPage/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AdminHeroes from "./pages/admin/AdminHeroes/AdminHeroes";
import AdminHeroActions from "./pages/admin/AdminHeroActions/AdminHeroActions";
import USSRHeroesPage from "./pages/main/HeroesPage/USSRHeroesPage";
import SVOHeroesPage from "./pages/main/HeroesPage/SVOHeroesPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<HomePage />} />
          <Route path="/ussr-heroes" element={<USSRHeroesPage />} />
          <Route path="/svo-heroes" element={<SVOHeroesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* Защищенные админ-маршруты */}
          <Route
            path="/admin-heroes"
            element={
              <ProtectedRoute>
                <AdminHeroes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-heroes-actions"
            element={
              <ProtectedRoute>
                <AdminHeroActions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;