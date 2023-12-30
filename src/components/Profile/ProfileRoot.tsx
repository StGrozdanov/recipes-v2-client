import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ProfileRoot.module.scss';
import { faCommentDots, faStar, faUserPen, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

export default function ProfileRoot({ children }: { children: JSX.Element }) {
    return (
        <section className={styles["my-profile-section"]}>
            <section className={styles["user-profile"]}>
                <NavLink
                    to="/profile/notifications"
                    className={styles["profile-navigation-button"]}
                    style={{ position: 'relative' }}
                >
                    <FontAwesomeIcon icon={faCommentDots} />
                    <span className={styles.counter}>0</span>
                    Известия
                </NavLink>
                <NavLink
                    to="/profile/my-recipes"
                    className={styles["profile-navigation-button"]}
                >
                    <FontAwesomeIcon icon={faUtensils} />
                    Моите рецепти
                </NavLink>
                <NavLink
                    to="/profile/favourite-recipes"
                    className={styles["profile-navigation-button"]}
                >
                    <FontAwesomeIcon icon={faStar} />
                    Любими рецепти
                </NavLink>
                <NavLink
                    to="/profile/edit"
                    className={styles["profile-navigation-button"]}
                >
                    <FontAwesomeIcon icon={faUserPen} />
                    Редактирай профила
                </NavLink>
            </section>
            {children}
        </section >
    );
}