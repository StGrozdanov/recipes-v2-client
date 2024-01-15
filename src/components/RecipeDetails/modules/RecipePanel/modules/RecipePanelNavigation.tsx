import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faComment, faExclamationTriangle, faPenToSquare, faShareNodes, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from './RecipePanelNavigation.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../../../hooks/useAuthContext';
import { useQueryClient } from 'react-query';
import Notification from '../../../../common/Notification/Notification';
import { useModalContext } from '../../../../../hooks/useModalContext';
import { useRecipesService } from '../../../../../services/recipesService';
import { useMobilePushNotification } from '../../../../../services/mobilePushNotificationService';
import { NotificationActions } from '../../../../../constants/notificationActions';
import FallbackImage from "../../../../common/FallbackImage/FallbackImage";
import { useNotificationsWebsocket } from '../../../../../hooks/useNotificationsWebsocket';
import { BaseCommentData } from '../../../../../services/types';
import { validationSchemas } from "../../../../../configs/yupConfig";
import { useFormik } from "formik";
import { useCommentService } from '../../../../../services/commentService';

type RecipePanelNavigationProps = {
    recipeName?: string,
    ownerId?: number,
}

const selectedStyle = { backgroundSize: '100% 0.15em', color: '#57595fc9' };

export default function RecipePanelNavigation({ recipeName, ownerId }: RecipePanelNavigationProps) {
    const { isAdministrator, isModerator, isResourceOwner, username, avatar, userId, isAuthenticated } = useAuthContext();
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
    const { sendJsonMessage } = useNotificationsWebsocket();
    const { useCreateComment } = useCommentService();
    const [failedComment, setFailedComment] = useState(false);
    const { createComment } = useCreateComment();

    useEffect(() => {
        pathname.endsWith('comments') ? setSelected('comments') : setSelected('products');
    }, [pathname]);

    const createMobilePushNotificationHandler = async () => {
        try {
            const { pushNotificationResponse } = await createPushNotification({
                subject: NotificationActions.NEW_COMMENT,
                content: `${username} ${NotificationActions.POSTED_NEW_COMMENT}`,
            });
            await pushNotificationResponse;
        } catch (err) {
            console.error(err);
        }
    }

    const submitHandler = async (values: { comment: string }) => {
        setFailedComment(false);
        try {
            const newComment: BaseCommentData = {
                content: values.comment,
                recipeName: recipeName!,
                owner: {
                    username: username,
                    id: userId,
                }
            }
            const { createCommentResponse } = await createComment(newComment);
            const response = await createCommentResponse;
            console.info(response);
            await queryClient.invalidateQueries(['recipeComments', recipeName!.toLowerCase()]);
            formik.resetForm();
            await Promise.all([
                createMobilePushNotificationHandler(),
                sendJsonMessage({
                    action: 'CREATED_COMMENT',
                    locationName: recipeName!,
                    senderAvatar: avatar,
                    senderId: userId,
                    senderUsername: username,
                })
            ]);
        } catch (err) {
            console.error(err);
            setFailedComment(true);
        }
        formik.setTouched({ comment: false });
    }

    const formik = useFormik({
        initialValues: { comment: "" },
        validationSchema: validationSchemas.commentValidationSchema,
        onSubmit: submitHandler,
    });

    const createCommentMobilePushNotificationHandler = async () => {
        const { pushNotificationResponse } = await createPushNotification({
            subject: NotificationActions.NEW_RECIPE,
            content: `${username} ${NotificationActions.DELETED_RECIPE}`,
        });
        await pushNotificationResponse;
    }

    const recipeDeleteHandler = async () => {
        try {
            await Promise.all([
                createCommentMobilePushNotificationHandler(),
                sendJsonMessage({
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
            const { recipeDeleteResponse } = await deleteRecipe(recipeName!);
            await recipeDeleteResponse;
            await Promise.all([
                queryClient.invalidateQueries(['recipe', recipeName!.toLowerCase()]),
                queryClient.invalidateQueries(['recipes']),
                queryClient.invalidateQueries(['favouriteRecipes', username]),
                queryClient.invalidateQueries(['recipesByUser', username]),
            ]);
            navigate('/catalogue');
        } catch (err) {
            setDeleteFailed(true);
            console.error(err);
        }
    }

    return (
        <>
            <nav className={styles.navigation}>
                <section
                    className={styles['add-comment-section']}
                    style={isAuthenticated && pathname.endsWith('comments') ? {} : { display: 'none' }}
                >
                    <div className={styles['image-container']}>
                        <FallbackImage src={avatar} alt={"/images/avatar.png"} />
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <input
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.comment}
                            style={formik.touched.comment && formik.errors.comment ? { borderBottomColor: 'red' } : {}}
                            type="text"
                            name="comment"
                            placeholder="Добави коментар ..."
                            autoComplete="off"
                            onSubmit={formik.handleReset}
                        />
                        {
                            formik.touched.comment && formik.errors.comment
                                ? <>
                                    <FontAwesomeIcon icon={faExclamationTriangle} className={styles['warning-icon']} />
                                    <span className={styles['fail-validation-msg']}>{formik.errors.comment}</span>
                                </>
                                : null
                        }
                    </form>
                </section>
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
            <Notification
                type={'fail'}
                isVisible={failedComment}
                message={'Нещо се обърка при създаването на коментар. Моля опитайте по-късно.'}
            />
        </>
    );
}