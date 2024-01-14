import styles from './Notifications.module.scss';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import Notification from './Notification';
import Notify from '../../../common/Notification/Notification';
import { useNavigate } from 'react-router-dom';
import { useNotificationsService } from '../../../../services/notificationsService';
import { useQueryClient } from 'react-query';

export default function Notifications() {
    const { username } = useAuthContext();
    const { getUserNotifications, useMarkAsRead } = useNotificationsService();
    const { notifications, notificationsFetchError } = getUserNotifications(username);
    const { markAsRead, isError } = useMarkAsRead();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const markAsReadHandler = async (id: number, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation();
        await markAsRead(id);
        await queryClient.invalidateQueries(['userNotifications', username]);
    };
    const readHandler = async (id: number, location: string, action: string) => {
        await markAsRead(id);
        await queryClient.invalidateQueries(['userNotifications', username]);
        action.includes('COMMENT') ? navigate(`/details/${location}/comments`) : navigate(`/details/${location}`);
    };

    return (
        <>
            {
                notifications && notifications.length > 0
                    ? <section className={styles['notifications-container']}>
                        {
                            notifications.map(notification =>
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
            }
            <Notify
                type={'fail'}
                isVisible={notificationsFetchError as boolean || isError}
                message={'Здравейте, имаме проблем с нотификациите и работим по отстраняването му.'}
            />
        </>
    )
}