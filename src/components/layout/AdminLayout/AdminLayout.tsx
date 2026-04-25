import AdminSidebar from "../../admin/AdminSidebar/AdminSidebar";
import styles from "./AdminLayout.module.scss"
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {

    return (
        <div className={styles.adminLayout}>
            <AdminSidebar
            // isAdmin={true}
            />
            <main>
                <Outlet />
            </main>
        </div>
    )
}
