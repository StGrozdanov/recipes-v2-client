import styles from './Navigation.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { faLeftLong, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Search from './modules/Search/Search';
import MainMenu from './modules/Menus/MainMenu';
import CategoriesMenu from './modules/Menus/CategoriesMenu';

export default function Navigation() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [menu, setMenu] = useState('main');

    const expandHandler = () => setIsExpanded(!isExpanded);

    const switchMenuHandler = () => {
        menu === 'main' ? setMenu('categories') : setMenu('main');
        setIsExpanded(true);
    }

    const backClickHandler = () => {
        expandHandler();
        setTimeout(() => {
            switchMenuHandler();
        }, 400);
    }

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
            {
                menu !== 'main' && isExpanded && <div
                    onClick={backClickHandler}
                    className={styles.back}
                >
                    <FontAwesomeIcon
                        icon={faLeftLong}
                    />
                    Главно Меню
                </div>
            }
            <div className={styles['nav-logo']} style={isExpanded && menu === 'main' ? {} : { display: 'none' }}>
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
                    {
                        menu === 'main'
                            ? <MainMenu
                                expandHandler={expandHandler}
                                switchMenuHandler={switchMenuHandler}
                            />
                            : <CategoriesMenu
                                expandHandler={expandHandler}
                            />
                    }
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