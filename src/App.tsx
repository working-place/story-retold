import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import './App.scss';
import MainLayout from "./components/layout/MainLayout/MainLayout";
import MetrikaRouteTracker from "./components/common/MetrikaRouteTracker/MetrikaRouteTracker";

import HomePage from './pages/main/HomePage/HomePage';

const LoginPage = lazy(() => import("./pages/auth/LoginPage/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const HeroesPage = lazy(() => import("./pages/main/HeroesPage/HeroesPage"));
const HeroDetailPage = lazy(() => import("./pages/main/HeroDetailPage/HeroDetailPage"));
const PreviewHeroPage = lazy(() => import("./pages/main/HeroDetailPage/PreviewHeroPage"));
const HeroDetailPageAdmin = lazy(() => import("./pages/main/HeroDetailPage/HeroDetailPageAdmin"));
const FeedBackPage = lazy(() => import("./pages/main/FeedBackPage/FeedBackPage"));
const NotFoundPage = lazy(() => import("./pages/main/NotFoundPage/NotFoundPage"));

const AdminLayout = lazy(() => import("./components/layout/AdminLayout/AdminLayout"));
const AdminPanelForm = lazy(() => import("./components/common/Form/AdminPanelForm"));
const AdminEditForm = lazy(() => import("./components/common/Form/AdminEditForm"));
const HeroAllCards = lazy(() => import("./components/admin/HeroCards/HeroAllCards"));
const ReviewCards = lazy(() => import("./components/admin/ReviewCards/ReviewCards"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <MetrikaRouteTracker />
        <Suspense fallback={<div className="app-loader">Загрузка…</div>}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/ussr-heroes" element={<HeroesPage chapter="gpw" title="Герои СССР" />} />
              <Route path="/svo-heroes" element={<HeroesPage chapter="svo" title="Герои СВО" />} />
              <Route path="/hero/:id" element={<HeroDetailPage />} />
              <Route path="/preview-hero" element={<PreviewHeroPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/restore/:token" element={<ResetPasswordPage />} />

            <Route
              path="/admin-heroes"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="new-card" element={<AdminPanelForm />} />
              <Route path="on-review" element={<ReviewCards />} />
              <Route path="feedback" element={<FeedBackPage />} />
              <Route path="edit/:id" element={<AdminEditForm />} />
              <Route path="ussr-heroes" element={<HeroAllCards type="gpw" title="Герои СССР" />} />
              <Route path="svo-heroes" element={<HeroAllCards type="svo" title="Герои СВО" />} />
              <Route path="hero-card/:id" element={<HeroDetailPageAdmin />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
