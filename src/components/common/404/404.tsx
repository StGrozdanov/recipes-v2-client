import { Link } from 'react-router-dom';
import FallbackImage from '../FallbackImage/FallbackImage';
import styles from './404.module.scss';

export default function Page404() {
    return (
        <div className={styles["div-404"]}>
            <h1 className={styles.h1}>Попаднахте в космоса!</h1>
            <Link to='/catalogue'>
                <h2 className={styles["back-to-earth-404"]}>Обратно към земята</h2>
                <div className={styles["earth-container-404"]}>
                    <FallbackImage
                        className={styles.img}
                        src="/images/BackToEarth.gif"
                        alt="back-to-earth"
                    />
                </div>
            </Link>
            <div className={styles.background}>
                <FallbackImage
                    className={styles.img}
                    src="/images/404.webp"
                    alt="ERROR"
                />
            </div>
        </div >
    );
}
