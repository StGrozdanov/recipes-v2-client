import { NavLink } from "react-router-dom";
import styles from '../../Navigation.module.scss';
import { useAuthContext } from "../../../../hooks/useAuthContext";
import AuthenticatedMenu from "./AuthenticatedMenu";
import NonAuthenticatedMenu from "./NonAuthenticatedMenu";

type MainMenuProps = {
    expandHandler: () => void,
    switchMenuHandler: () => void,
}

export default function MainMenu({ expandHandler, switchMenuHandler }: MainMenuProps) {
    const { isAuthenticated } = useAuthContext();

    const categoriesClickHandler = () => {
        expandHandler();
        setTimeout(() => {
            switchMenuHandler();
        }, 400);
    }

    return (
        <>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <NavLink to='/catalogue' className={styles['nav-item-link']}>Каталог</NavLink>
            </li>
            <li className={styles['nav-item']} onClick={categoriesClickHandler}>
                <a className={styles['nav-item-link']}>Категории</a>
            </li>
            {
                isAuthenticated
                    ? <AuthenticatedMenu expandHandler={expandHandler} />
                    : <NonAuthenticatedMenu expandHandler={expandHandler} />
            }
        </>
    )
}