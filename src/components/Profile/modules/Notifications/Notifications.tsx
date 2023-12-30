import styles from './Notifications.module.scss';
import * as notificationsService from '../../../../services/notificationsService';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import Notification from './Notification';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Notifications() {
    const { username, token } = useAuthContext();
    const { notifications } = notificationsService.getUserNotifications(username, token);
    const { markAsRead } = notificationsService.useMarkAsRead();
    const [notificationsData, setNotificationsData] = useState(notifications);
    const navigate = useNavigate();

    useEffect(() => {
        setNotificationsData(notifications);
    }, [notifications]);

    const markAsReadHandler = async (id: number, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation();

        await markAsRead({ token, id });

        setNotificationsData((oldState) => {
            return oldState ? oldState?.filter(notification => notification.id !== id) : oldState;
        });
    };
    const readHandler = async (id: number, location: string, action: string) => {
        await markAsRead({ token, id });

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