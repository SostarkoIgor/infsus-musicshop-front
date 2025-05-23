import styles from "../styles/navbar.module.css";	
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
        <div className={styles.logo}>
            <span className={'material-symbols-outlined ' + styles.logoIcon}>music_note</span>
            <a href="/" className={styles.logoText}>Music shop</a>
        </div>
        <div className={styles.links}>
            <a href="/order" className={styles.link}>Orders</a>
            <a href="/product" className={styles.link}>Products</a>
        </div>
    </div>
  );
}
export default Navbar;