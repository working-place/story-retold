import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.scss"
import Header from "../../header/Header";
import Footer from "../../footer/Footer";

/**
 * Layout для публичных страниц. Используется как layout-route:
 *   <Route element={<MainLayout/>}>
 *     <Route path="/" element={<HomePage/>} />
 *     ...
 *   </Route>
 * Содержимое страницы рендерится через <Outlet/>, благодаря чему
 * Header/Footer не перемонтируются при переходах между страницами.
 */
export default function MainLayout() {
    return (
        <div className={styles.mainLayout}>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
