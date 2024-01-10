import styles from './Notifications.module.scss';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import Notification from './Notification';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNotificationsService } from '../../../../services/notificationsService';

export default function Notifications() {
    const { username } = useAuthContext();
    const { getUserNotifications, useMarkAsRead } = useNotificationsService();
    const { notifications } = getUserNotifications(username);
    const { markAsRead } = useMarkAsRead();
    const [notificationsData, setNotificationsData] = useState(notifications);
    const navigate = useNavigate();

    useEffect(() => {
        setNotificationsData(notifications);
    }, [notifications]);

    const markAsReadHandler = async (id: number, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation();

        await markAsRead(id);

        setNotificationsData((oldState) => {
            return oldState ? oldState?.filter(notification => notification.id !== id) : oldState;
        });
    };
    const readHandler = async (id: number, location: string, action: string) => {
        await markAsRead(id);

        action.includes('COMMENT') ? navigate(`/details/${location}/comments`) : navigate(`/details/${location}`);
    };

    return (
        notificationsData && notificationsData.length > 0
            ? <section className={styles['notifications-container']}>
                {
                    notificationsData.map(notification =>
                        <Notification
                            key={notification.createdAt}
                            {...notification}
                            markAsReadHandler={markAsReadHandler}
                            readHandler={readHandler}
                        />
                    )
                }
            </section>
            : <h2 className={styles['no-new-notifications']}>Нямате нови известия</h2>

    )
}