import { useAuth } from "../../../contexts/AuthContext";
import Button from "../../common/Button/Button";
import styles from "./AdminSidebar.module.scss";

export default function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <div className={styles.sidebar}>
      <h1>AdminSidebar</h1>
      <Button onClick={logout} variant="secondary">
        Выйти
      </Button>
    </div>
  );
}