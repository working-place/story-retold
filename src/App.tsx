import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.scss'
import "../src/globals.scss"
import HomePage from './pages/main/HomePage/HomePage'
import LoginPage from "./pages/auth/LoginPage/LoginPage";
import AdminHeroes from "./pages/admin/AdminHeroes/AdminHeroes";
import AdminHeroActions from "./pages/admin/AdminHeroActions/AdminHeroActions";
import USSRHeroesPage from "./pages/main/HeroesPage/USSRHeroesPage";
import SVOHeroesPage from "./pages/main/HeroesPage/SVOHeroesPage";
import HeroDetailPage from "./pages/main/HeroDetailPage/HeroDetailPage";

function App() {

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={<HomePage />}
        />
        <Route
          path='/ussr-heroes'
          element={<USSRHeroesPage/>}
        />
                <Route
          path='/svo-heroes'
          element={<SVOHeroesPage/>}
        />
        <Route
          path='/hero/:id'
          element={<HeroDetailPage/>}
        />
        {/* Сделать Protected Routes для админки */}
        {/* <ProtectedRoute
          isAuthenticated={isAuthenticated}
          redirectPath={'/login'}
        > */}
        <Route
          path='/login'
          element={<LoginPage />}
        />
        <Route
          path='/admin-heroes'
          element={<AdminHeroes />}
        />
        <Route
          path='/admin-heroes-actions'
          element={<AdminHeroActions />}
        />
        {/* </ProtectedRoute> */}

      </Routes>
    </Router>
  )
}

export default App
