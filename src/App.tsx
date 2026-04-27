import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.scss'
import "../src/globals.scss"
import HomePage from './pages/main/HomePage/HomePage'
import LoginPage from "./pages/auth/LoginPage/LoginPage";
import AdminHeroes from "./pages/admin/AdminHeroes/AdminHeroes";
import AdminHeroActions from "./pages/admin/AdminHeroActions/AdminHeroActions";
import USSRHeroesPage from "./pages/main/USSRHeroesPage/USSRHeroesPage";
import SVOHeroesPage from "./pages/main/USSRHeroesPage/SVOHeroesPage";

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
