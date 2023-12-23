import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import styles from './Notification.module.scss';
import { useEffect } from 'react';

type NotificationProps = {
    type: 'success' | 'info' | 'warning' | 'fail',
    message: string,
    isVisible: boolean,
    handler: () => void,
    style: object,
}

const iconTypes = {
    success: { icon: faCircleCheck, color: '#66c066', background: 'rgb(210 242 210 / 95%)' },
    info: { icon: faCircleInfo, color: 'rgb(107 141 238)', background: 'rgb(222 226 247 / 95%)' },
    warning: { icon: faTriangleExclamation, color: '#ea9c0f', background: 'rgb(246 241 216 / 95%)' },
    fail: { icon: faTriangleExclamation, color: '#ea5656', background: 'rgb(251 229 229 / 95%)' },
}

const unmountedStyleNotification = {
    opacity: 0,
    top: '100vh',
    transition: 'all 700ms ease-in'
};

export default function Notification({
    type,
    message,
    isVisible,
    handler,
    style = {}
}: NotificationProps) {
    useEffect(() => {
        if (type === 'success' && isVisible) {
            setTimeout(() => handler(), 2500);
        }
    }, [isVisible])

    return (
        <article
            className={styles.notification}
            style={
                !isVisible
                    ? unmountedStyleNotification
                    : !style
                        ? { backgroundColor: iconTypes[type].background }
                        : { ...style, backgroundColor: iconTypes[type].background }
            }
        >
            <div className={styles["icon-container"]} style={{ backgroundColor: iconTypes[type].color }}>
                <FontAwesomeIcon
                    icon={iconTypes[type].icon}
                    className={styles.icon}
                />
            </div>
            <p className={styles.content}>{message || 'Notification message'}</p>
            <FontAwesomeIcon
                icon={faXmark}
                className={styles['x-mark']}
                onClick={() => handler()}
            />
        </article>
    );
}