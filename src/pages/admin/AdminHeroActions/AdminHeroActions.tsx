import type { JSX } from "react";
import styles from "./AdminHeroActions.module.scss"
import { NavLink } from "react-router-dom";

export default function AdminHeroActions( ): JSX.Element {

    return (
        // <AdminLayout>
            <div className={styles.adminHeroActions}>
                <h1>AdminHeroActions</h1>
                <NavLink to="/">Главная</NavLink>
            </div>
        // </AdminLayout>
    )
}
