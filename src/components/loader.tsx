import styles from '../styles/loader.module.css';

const Loader = () => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.spinner} />
        </div>
    )
}

export default Loader;
