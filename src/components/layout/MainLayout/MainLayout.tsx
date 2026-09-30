import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.scss"
import Header from "../../header/Header";
import Footer from "../../footer/Footer";

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
