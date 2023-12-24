import styles from './Navigation.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Search from './modules/Search';

export default function Navigation() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    return (
        <nav className={styles.navigation}>
            <Link to={'/'} className={styles.logo}>
                <h4 className={styles.logo}>All The Best
                    <div className={styles['logo-container']}>
                        <img src="/images/cooking.png" />
                    </div>
                    Recipes
                </h4>
            </Link>
            <div className={styles['nav-logo']} style={isExpanded ? {} : { display: 'none' }}>
                <img src="/images/cooking.png" />
            </div>
            <section className={styles['nav-right-section']}>
                <li className={styles['nav-item-search']}>
                    <FontAwesomeIcon
                        className={styles.search}
                        icon={faMagnifyingGlass}
                        onClick={() => showSearch ? setShowSearch(false) : setShowSearch(true)}
                    />
                </li>
                <ul
                    data-testid="nav-menu"
                    className={
                        `${styles['nav-menu']} 
                    ${isExpanded
                            ? `, ${styles['active-menu']}`
                            : ''
                        }`
                    }
                >
                    <li className={styles['nav-item']} onClick={() => setIsExpanded(!isExpanded)}>
                        <NavLink to='/catalogue' className={styles['nav-item-link']}>Каталог</NavLink>
                    </li>
                    <li className={styles['nav-item']} onClick={() => setIsExpanded(!isExpanded)}>
                        <NavLink to='/categories' className={styles['nav-item-link']}>Категории</NavLink>
                    </li>
                    <li className={styles['nav-item']} onClick={() => setIsExpanded(!isExpanded)}>
                        <NavLink to='/login' className={styles['nav-item-link']}>Вход</NavLink>
                    </li>
                    <li className={styles['nav-item']} onClick={() => setIsExpanded(!isExpanded)}>
                        <NavLink to='/profile' className={styles['nav-item-link']}>Моят Профил</NavLink>
                    </li>
                    <li className={styles['nav-item']} onClick={() => setIsExpanded(!isExpanded)}>
                        <NavLink to='/create' className={styles['nav-item-link']}>Създай Рецепта</NavLink>
                    </li>
                    <li className={styles['nav-item']} onClick={() => setIsExpanded(!isExpanded)}>
                        <NavLink to='/logout' className={styles['nav-item-link']}>Изход</NavLink>
                    </li>
                </ul>
                <div
                    data-testid="burger-icon"
                    className={`${styles.burger} ${isExpanded ? `, ${styles['active-burger']}` : ''}`}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                </div>
            </section>
            <Search
                show={showSearch}
                hideSearchHandler={() => setShowSearch(false)}
            />
        </nav >
    );
}