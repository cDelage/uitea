import Header from "./Header";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
