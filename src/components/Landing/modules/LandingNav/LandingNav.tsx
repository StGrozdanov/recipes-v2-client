import styles from './LandingNav.module.scss';
import { Link } from 'react-router-dom';

export default function LandingNav() {
    return (
        <nav className={styles["landing-nav"]}>
            <img src="images/cooking.png" alt="cooking image" />
            <Link to='/catalogue' className={styles["landing-nav-link"]}>Към рецептите на сайта</Link>
            <img src="images/cooking.png" alt="cooking image" />
        </nav>
    )
}