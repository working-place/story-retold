import styles from "./AdminLayout.module.scss";
import { NavLink, Outlet } from "react-router-dom";
import { IconOnReview } from "../../../assets/images/icons/OnReviewIcon";
import { IconUSSR } from "../../../assets/images/icons/IconUSSR";
import { IconSVO } from "../../../assets/images/icons/IconSVO";
import { IconNewCard } from "../../../assets/images/icons/IconNewCard";
import AdminPanelForm from "../../common/Form/AdminPanelForm";


export default function AdminLayout() {

  const menuItems = [

    { path: "/admin-heroes/on-review", label: "На проверке", icon: <IconOnReview /> },
    { path: "/admin-heroes/ussr-heroes", label: "Герои СССР", icon: <IconUSSR /> },
    { path: "/admin-heroes/svo-heroes", label: "Герои СВО", icon: <IconSVO /> },
    { path: "/admin-heroes/new-card", label: "Новая карточка", icon: <IconNewCard /> },
  ];

  return (
    <div className={styles.adminLayout}>

      <aside className={`${styles.sidebar}`}>

        <div className={styles.sidebar__logo}>
          <img src="/logo-footer.png" alt="" />
        </div>

        <nav className={styles.sidebar__nav}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.sidebar__link} ${isActive ? styles.sidebar__link_active : ""}`
              }
            >
              <span className={styles.sidebar__linkIcon}>{item.icon}</span>
              <span className={styles.sidebar__linkText}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={styles.content}>
        <Outlet />
       {/* форма (переиспользовать с главной страницы) */}
       <AdminPanelForm/>
      </main>
    </div>
  );
}
