import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import styles from './Notification.module.scss';
import { useEffect, useState } from 'react';

type NotificationProps = {
    type: 'success' | 'info' | 'warning' | 'fail',
    message: string,
    isVisible: boolean,
    style?: React.CSSProperties,
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
    style = {}
}: NotificationProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (type === 'success' && isVisible) {
            setTimeout(() => setVisible(false), 2500);
        } else if (isVisible) {
            setVisible(true);
        } else if (!isVisible) {
            setVisible(false);
        }
    }, [isVisible])

    return (
        <article
            className={styles.notification}
            style={
                visible
                    ? {
                        ...style,
                        backgroundColor: iconTypes[type].background,
                    }
                    : unmountedStyleNotification
            }
            onClick={() => setVisible(false)}
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
                onClick={() => setVisible(false)}
            />
        </article>
    );
}