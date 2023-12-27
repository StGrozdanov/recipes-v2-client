import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './Search.module.scss';
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type SearchProps = {
    show: boolean,
    hideSearchHandler: () => void,
}

const unmountedStyle = { left: '50vw', bottom: '100%', transition: 'all .6s ease-in' };
const mountedStyle = {top: '74px', transition: 'all .6s ease-out' };
const inputUnmountedStyle = { background: 'white', transition: 'all 0.7s ease-in' };

export default function Search({ show, hideSearchHandler }: SearchProps) {
    const [searchInputValue, setSearchInputValue] = useState('');
    const navigate = useNavigate();

    const searchHandler = (e: React.MouseEvent<SVGSVGElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (searchInputValue.trim() != '') {
            setSearchInputValue('');
            hideSearchHandler();
            navigate(`/search?=${searchInputValue}`);
        }
    }

    return (
        <form
            className={styles['search-article']}
            style={!show ? unmountedStyle : mountedStyle}
            onSubmit={searchHandler}
        >
            <FontAwesomeIcon
                className={styles['search-input-icon']}
                icon={faMagnifyingGlass}
                onClick={searchHandler}
            />
            <input
                className={styles['search-input']}
                type="text"
                placeholder='Търсете по име на рецепта ...'
                style={!show ? inputUnmountedStyle : {}}
                defaultValue={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
            />
            <FontAwesomeIcon
                className={styles['cancel-input-icon']}
                icon={faXmark}
                onClick={hideSearchHandler}
            />
        </form>
    );
}