import { Link } from "react-router-dom";
import styles from '../../Navigation.module.scss';

type CategoriesMenuProps = {
    expandHandler: () => void,
}

export default function CategoriesMenu({ expandHandler }: CategoriesMenuProps) {
    return (
        <>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/catalogue?category=Пилешко' className={styles['nav-item-link']}>Пилешко</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/catalogue?category=Свинско' className={styles['nav-item-link']}>Свинско</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/catalogue?category=Телешко' className={styles['nav-item-link']}>Телешко</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/catalogue?category=Телешко-свинско' className={styles['nav-item-link']}>Телешко-свинско</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/catalogue?category=Риба' className={styles['nav-item-link']}>Риба</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/catalogue?category=Други месни' className={styles['nav-item-link']}>Други месни</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/catalogue?category=Вегитариански' className={styles['nav-item-link']}>Вегитариански</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/catalogue?category=Салати' className={styles['nav-item-link']}>Салати</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/catalogue?category=Тестени' className={styles['nav-item-link']}>Тестени</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/catalogue?category=Десерти' className={styles['nav-item-link']}>Десерти</Link>
            </li>
            <li className={styles['nav-item']} onClick={expandHandler}>
                <Link to='/catalogue?category=Други' className={styles['nav-item-link']}>Други</Link>
            </li>
        </>
    );
}