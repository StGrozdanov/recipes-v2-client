import { NavLink } from "react-router-dom";
import styles from '../../Navigation.module.scss';

type MainMenuProps = {
    expandHandler: () => void,
    switchMenuHandler: () => void,
}

export default function MainMenu({ expandHandler, switchMenuHandler }: MainMenuProps) {
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
            <li className={styles['nav-item']} onClick={expandHandler}>
                <NavLink to='/login' className={styles['nav-item-link']}>Вход</NavLink>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <NavLink to='/profile' className={styles['nav-item-link']}>Моят Профил</NavLink>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <NavLink to='/create' className={styles['nav-item-link']}>Създай Рецепта</NavLink>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <NavLink to='/logout' className={styles['nav-item-link']}>Изход</NavLink>
            </li>
        </>
    )
}