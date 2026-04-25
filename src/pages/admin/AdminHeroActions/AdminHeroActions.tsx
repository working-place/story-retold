import type { JSX } from "react";
import AdminLayout from "../../../components/layout/AdminLayout/AdminLayout";
import styles from "./AdminHeroActions.module.scss"
import { NavLink } from "react-router-dom";

// interface AdminHeroActionsProps {
//     text?: string | undefined;
// }

export default function AdminHeroActions( ): JSX.Element {

    return (
        <AdminLayout>
            <div className={styles.adminHeroActions}>
                <h1>AdminHeroActions</h1>
                <NavLink to="/">Главная</NavLink>
            </div>
        </AdminLayout>
    )
}
