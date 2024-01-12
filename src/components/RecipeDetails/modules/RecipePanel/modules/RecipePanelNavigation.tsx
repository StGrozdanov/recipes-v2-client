import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faComment, faPenToSquare, faShareNodes, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from './RecipePanelNavigation.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../../../hooks/useAuthContext';
import { useQueryClient } from 'react-query';
import Notification from '../../../../common/Notification/Notification';
import { useModalContext } from '../../../../../hooks/useModalContext';
import { useRecipesService } from '../../../../../services/recipesService';
import { useMobilePushNotification } from '../../../../../services/mobilePushNotificationService';
import { useNotificationsService } from '../../../../../services/notificationsService';
import { NotificationActions } from '../../../../../constants/notificationActions';

type RecipePanelNavigationProps = {
    recipeName?: string,
    ownerId?: number,
}

const selectedStyle = { backgroundSize: '100% 0.15em', color: '#57595fc9' };

export default function RecipePanelNavigation({ recipeName, ownerId }: RecipePanelNavigationProps) {
    const { isAdministrator, isModerator, isResourceOwner, username, avatar, userId } = useAuthContext();
    const { useDeleteRecipe } = useRecipesService();
    const { deleteRecipe } = useDeleteRecipe();
    const [selected, setSelected] = useState('products');
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [deleteFailed, setDeleteFailed] = useState(false);
    const queryClient = useQueryClient();
    const confirmModal = useModalContext();
    const { useCreatePushNotification } = useMobilePushNotification();
    const { createPushNotification } = useCreatePushNotification();
    const { useCreateWebNotification } = useNotificationsService();
    const { createWebNotification } = useCreateWebNotification();

    useEffect(() => {
        pathname.endsWith('comments') ? setSelected('comments') : setSelected('products');
    }, [pathname]);

    const createMobilePushNotificationHandler = async () => {
        const { pushNotificationResponse } = await createPushNotification({
            subject: NotificationActions.NEW_RECIPE,
            content: `${username} ${NotificationActions.DELETED_RECIPE}`,
        });
        await pushNotificationResponse;
    }

    const recipeDeleteHandler = async () => {
        try {
            await Promise.all([
                createMobilePushNotificationHandler(),
                createWebNotification({
                    action: 'DELETED_RECIPE',
                    locationName: recipeName!,
                    senderAvatar: avatar,
                    senderId: userId,
                    senderUsername: username,
                })
            ])
        } catch (err) {
            console.error(err);
        }
        try {
            const { error } = await deleteRecipe(recipeName!)
            if (error) {
                setDeleteFailed(true);
            } else {
                await Promise.all([
                    queryClient.invalidateQueries(['recipe', recipeName!.toLowerCase()]),
                    queryClient.invalidateQueries(['recipes']),
                    queryClient.invalidateQueries(['favouriteRecipes', username]),
                    queryClient.invalidateQueries(['recipesByUser', username]),
                ]);
                navigate('/catalogue');
            }
        } catch (err) {
            console.error(err);
            navigate('/catalogue');
        }
    }

    return (
        <>
            <nav className={styles.navigation}>
                <ul>
                    <FontAwesomeIcon
                        style={selected == 'products' ? selectedStyle : {}}
                        icon={faCartShopping}
                        className={styles['nav-icon']}
                        onClick={() => navigate(`/details/${recipeName}`)}
                    />
                    <FontAwesomeIcon
                        style={selected == 'comments' ? selectedStyle : {}}
                        icon={faComment}
                        className={styles['nav-icon']}
                        onClick={() => navigate(`/details/${recipeName}/comments`)}
                    />
                    <FontAwesomeIcon
                        style={isAdministrator || isModerator || ownerId && isResourceOwner(ownerId) ? {} : { display: 'none' }}
                        icon={faPenToSquare}
                        className={styles['nav-icon']}
                        onClick={() => navigate(`/edit/${recipeName}`)}
                    />
                    <FontAwesomeIcon
                        style={isAdministrator || ownerId && isResourceOwner(ownerId) ? {} : { display: 'none' }}
                        icon={faTrashCan}
                        className={styles['nav-icon']}
                        onClick={() => {
                            confirmModal({ title: 'Сигурни ли сте, че искате да изтриете рецептата?' })
                                .then(() => {
                                    recipeDeleteHandler();
                                })
                                .catch(() => console.info('action canceled.'))
                        }}
                    />
                    <FontAwesomeIcon
                        icon={faShareNodes}
                        className={styles['nav-icon']}
                    />
                </ul>
            </nav>
            <Notification
                type={'fail'}
                isVisible={deleteFailed}
                message={'Не успяхме да изтрием рецептата. Моля опитайте по-късно.'}
            />
        </>
    );
}