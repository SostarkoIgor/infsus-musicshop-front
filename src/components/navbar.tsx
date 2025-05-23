import styles from "../styles/navbar.module.css";	
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
        <div className={styles.logo}>
            <span className={'material-symbols-outlined ' + styles.logoIcon}>music_note</span>
            <Link to="/" className={styles.logoText}>Music shop</Link>
        </div>
        <div className={styles.links}>
            <Link to="/order" className={styles.link}>Orders</Link>
            <Link to="/product" className={styles.link}>Products</Link>
        </div>
    </div>
  );
}
export default Navbar;