import styles from './BackToTopButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function BackToTopButton({ scrollVisibility = 500 }) {
    const [buttonIsVisible, setButtonIsVisible] = useState(false);

    function backToTopHandler() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function toggleBackToTopButton() {
        if (window.scrollY > scrollVisibility) {
            setButtonIsVisible(true);
        } else {
            setButtonIsVisible(false);
        }
    }

    window.addEventListener('scroll', () => toggleBackToTopButton());

    return (
        <div
            className={styles['button-to-top']}
            onClick={backToTopHandler}
            style={buttonIsVisible ? {} : { opacity: 0 }}
        >
            <FontAwesomeIcon className={styles.icon} icon={faAngleUp} />
        </div>
    );
}