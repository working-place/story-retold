import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import './App.scss';
import "../src/globals.scss";
import HomePage from './pages/main/HomePage/HomePage';
import LoginPage from "./pages/auth/LoginPage/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AdminHeroActions from "./pages/admin/AdminHeroActions/AdminHeroActions";
import USSRHeroesPage from "./pages/main/HeroesPage/USSRHeroesPage";
import SVOHeroesPage from "./pages/main/HeroesPage/SVOHeroesPage";
import HeroDetailPage from "./pages/main/HeroDetailPage/HeroDetailPage";
import AdminLayout from "./components/layout/AdminLayout/AdminLayout";
import AdminPanelForm from "./components/common/Form/AdminPanelForm";
import HeroAllCards from "./components/admin/HeroCards/HeroAllCards";
import AdminEditForm from "./components/common/Form/AdminEditForm";
import NotFoundPage from "./pages/main/NotFoundPage/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<HomePage />} />
          <Route path="/ussr-heroes" element={<USSRHeroesPage />} />
          <Route path="/svo-heroes" element={<SVOHeroesPage />} />
          <Route path='/hero/:id' element={<HeroDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/restore/:token" element={<ResetPasswordPage />} />

          {/* Защищенные админ-маршруты */}
          <Route path="/admin-heroes"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="new-card" element={<AdminPanelForm />} />
            {/* <Route path="on-review" element={<div>На проверке</div>} /> */}
            <Route path="edit/:id" element={<AdminEditForm />} />
            <Route path="ussr-heroes" element={<HeroAllCards type="gpw" title="Герои СССР" />} />
            <Route path="svo-heroes" element={<HeroAllCards type="svo" title="Герои СВО" />} />
          </Route>

          <Route path="/admin-heroes-actions"
            element={
              <ProtectedRoute>
                <AdminHeroActions />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
