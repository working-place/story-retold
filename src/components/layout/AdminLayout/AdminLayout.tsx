import { type ReactNode } from "react";
import AdminSidebar from "../../admin/AdminSidebar/AdminSidebar";
import styles from "./AdminLayout.module.scss"

interface AdminLayoutProps {
    children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {

    return (
        <div className={styles.adminLayout}>
            <AdminSidebar
            // isAdmin={true}
            />
            <main>
                {children}
            </main>
        </div>
    )
}
