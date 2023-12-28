import { Link, NavLink } from "react-router-dom";
import styles from '../../Navigation.module.scss';
import { useAuthContext } from "../../../../hooks/useAuthContext";

type AuthenticatedMenuProps = {
    expandHandler: () => void,
}

export default function AuthenticatedMenu({ expandHandler }: AuthenticatedMenuProps) {
    const { userLogout } = useAuthContext();

    const logoutHandler = () => {
        userLogout();
        expandHandler();
    }

    return (
        <>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <NavLink to='/profile' className={styles['nav-item-link']}>Моят Профил</NavLink>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <NavLink to='/create' className={styles['nav-item-link']}>Създай Рецепта</NavLink>
            </li>
            <li className={styles['nav-item']} onClick={logoutHandler}>
                <Link to='/catalogue' className={styles['nav-item-link']}>Изход</Link>
            </li>
        </>
    )
}