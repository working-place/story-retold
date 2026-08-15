import styles from "./AdminLayout.module.scss";
import { NavLink, Outlet } from "react-router-dom";
import { IconOnReview } from "../../../assets/images/icons/OnReviewIcon";
import { IconUSSR } from "../../../assets/images/icons/IconUSSR";
import { IconSVO } from "../../../assets/images/icons/IconSVO";
import { IconNewCard } from "../../../assets/images/icons/IconNewCard";

import { IconOnReviewMobile } from "../../../assets/images/icons/OnReviewIconMobile";
import { IconUSSRMobile } from "../../../assets/images/icons/IconUSSRMobile";
import { IconSVOMobile } from "../../../assets/images/icons/IconSVOMobile";
import { IconNewCardMobile } from "../../../assets/images/icons/IconNewCardMobile";

import { useState } from "react";

export default function AdminLayout() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { path: "/admin-heroes/on-review", label: "На проверке", icon: <IconOnReview /> },
    { path: "/admin-heroes/ussr-heroes", label: "Герои СССР", icon: <IconUSSR /> },
    { path: "/admin-heroes/svo-heroes", label: "Герои СВО", icon: <IconSVO /> },
    { path: "/admin-heroes/new-card", label: "Новая карточка", icon: <IconNewCard /> },
  ];

  const menuItemsMobile = [
    { path: "/admin-heroes/on-review", label: "На проверке", icon: <IconOnReviewMobile /> },
    { path: "/admin-heroes/ussr-heroes", label: "Герои СССР", icon: <IconUSSRMobile /> },
    { path: "/admin-heroes/svo-heroes", label: "Герои СВО", icon: <IconSVOMobile /> },
    { path: "/admin-heroes/new-card", label: "Новая карточка", icon: <IconNewCardMobile /> },
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

      <aside className={`${styles.sidebarMobile}`}>

        <div className={styles.sidebarMobile__logo}>
          <img src="/logo-footer.png" alt="" />
        </div>

        <button
          className={`${styles.burgerButton} ${isMenuOpen ? styles.burgerButton_active : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
        </button>

      </aside>

      {isMenuOpen && (
        <div className={styles.menuOverlay}>
          <nav className={styles.menuPopup}>

            <button
              className={styles.closeButton}
              onClick={closeMenu}
              aria-label="Close menu"
            >
              ✕
            </button>

            {menuItemsMobile.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.sidebarMobile__link} ${isActive ? styles.sidebarMobile__link_active : ""}`
                }
              >
                <span className={styles.sidebarMobile__linkIcon}>{item.icon}</span>
                <span className={styles.sidebarMobile__linkText}>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
