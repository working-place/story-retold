import { type ReactNode } from "react";
import styles from "./MainLayout.module.scss"
import Header from "../../header/Header";
import Footer from "../../footer/Footer";

interface MainLayoutProps {
    children?: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {

    return (
        <div className={styles.mainLayout}>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}
