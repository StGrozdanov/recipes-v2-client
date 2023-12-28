import { NavLink } from "react-router-dom";
import styles from '../../Navigation.module.scss';

type NonAuthenticatedMenuProps = {
    expandHandler: () => void,
}

export default function NonAuthenticatedMenu({ expandHandler }: NonAuthenticatedMenuProps) {
    return (
        <>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <NavLink to='/login' className={styles['nav-item-link']}>Вход</NavLink>
            </li>
        </>
    )
}