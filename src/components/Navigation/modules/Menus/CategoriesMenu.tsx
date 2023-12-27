import { Link } from "react-router-dom";
import styles from '../../Navigation.module.scss';

type CategoriesMenuProps = {
    expandHandler: () => void,
}

export default function CategoriesMenu({ expandHandler }: CategoriesMenuProps) {
    return (
        <>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/category?name=Пилешко' className={styles['nav-item-link']}>Пилешко</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/category?name=Свинско' className={styles['nav-item-link']}>Свинско</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/category?name=Телешко' className={styles['nav-item-link']}>Телешко</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/category?name=Телешко-свинско' className={styles['nav-item-link']}>Телешко-свинско</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/category?name=Риба' className={styles['nav-item-link']}>Риба</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/category?name=Други месни' className={styles['nav-item-link']}>Други месни</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/category?name=Вегитариански' className={styles['nav-item-link']}>Вегитариански</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/category?name=Салати' className={styles['nav-item-link']}>Салати</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/category?name=Тестени' className={styles['nav-item-link']}>Тестени</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/category?name=Десерти' className={styles['nav-item-link']}>Десерти</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/category?name=Други' className={styles['nav-item-link']}>Други</Link>
            </li>
        </>
    );
}