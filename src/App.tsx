import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import './App.scss';
import HomePage from './pages/main/HomePage/HomePage';
import LoginPage from "./pages/auth/LoginPage/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import HeroesPage from "./pages/main/HeroesPage/HeroesPage";
import HeroDetailPage from "./pages/main/HeroDetailPage/HeroDetailPage";
import MainLayout from "./components/layout/MainLayout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout/AdminLayout";
import AdminPanelForm from "./components/common/Form/AdminPanelForm";
import HeroAllCards from "./components/admin/HeroCards/HeroAllCards";
import AdminEditForm from "./components/common/Form/AdminEditForm";
import ReviewCards from "./components/admin/ReviewCards/ReviewCards";
import NotFoundPage from "./pages/main/NotFoundPage/NotFoundPage";
import PreviewHeroPage from "./pages/main/HeroDetailPage/PreviewHeroPage";
import FeedBackPage from "./pages/main/FeedBackPage/FeedBackPage";
import AdminHeroActions from "./pages/admin/AdminHeroActions/AdminHeroActions";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Публичные маршруты под общим layout (Header/Footer не перемонтируются) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/ussr-heroes" element={<HeroesPage chapter="gpw" title="Герои СССР" />} />
            <Route path="/svo-heroes" element={<HeroesPage chapter="svo" title="Герои СВО" />} />
            <Route path='/hero/:id' element={<HeroDetailPage />} />

            <Route path="/preview-hero" element={<PreviewHeroPage />} />
          </Route>

          {/* Auth-страницы без основного layout */}
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
            <Route path="on-review" element={<ReviewCards />} />
            <Route path="feedback" element={<FeedBackPage/>} />
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
