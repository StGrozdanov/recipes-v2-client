import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ProfileRoot.module.scss';
import { faCommentDots, faStar, faUserPen, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useLocation } from 'react-router-dom';
import { useNotificationsService } from '../../services/notificationsService';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function ProfileRoot({ children }: { children: JSX.Element }) {
    const { username } = useAuthContext();
    const { getUserNotifications } = useNotificationsService();
    const { notifications } = getUserNotifications(username);
    const { pathname } = useLocation();
    return (
        <section className={styles["my-profile-section"]}>
            <section className={styles["user-profile"]}>
                <NavLink
                    to="/profile/notifications"
                    className={styles["profile-navigation-button"]}
                    style={{ position: 'relative' }}
                >
                    <FontAwesomeIcon icon={faCommentDots} />
                    <span
                        className={styles.counter}
                        style={
                            notifications && notifications.length > 0 && pathname !== '/profile/notifications'
                                ? {}
                                : { display: 'none' }
                        }
                    >
                        {notifications?.length}
                    </span>
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