import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './Notifications.module.scss';
import FallbackImage from '../../../common/FallbackImage/FallbackImage';
import { Notifications } from '../../../../services/types';
import { notificationConstants } from './constants';

type NotificationProps = Notifications & {
    action: keyof typeof notificationConstants,
    readHandler: (id: number, locationName: string, action: string) => void,
    markAsReadHandler: (id: number, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void,
};

export default function Notification({
    id,
    action,
    createdAt,
    locationName,
    senderAvatar,
    senderUsername,
    readHandler,
    markAsReadHandler,
}: NotificationProps) {
    return (
        <article
            className={styles['notification-article']}
            onClick={() => readHandler(id, locationName, action)}
        >
            <header className={styles["notification-article-header"]}>
                <FallbackImage
                    className={styles["notification-avatar-image"]}
                    src={senderAvatar}
                    alt={"/images/Avatar.png"}
                />
            </header>
            <main>
                <p><b>{senderUsername}</b> {notificationConstants[action] as string} в</p>
                <p>{locationName}</p>
                <p>{createdAt.replace('T', ', ').substring(0, 17)}</p>
            </main>
            <FontAwesomeIcon
                icon={faXmark}
                onClick={(e) => markAsReadHandler(id, e)}
            />
        </article >
    )
}