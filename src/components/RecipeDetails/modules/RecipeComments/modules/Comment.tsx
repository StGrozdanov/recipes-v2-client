import { Link, useParams } from 'react-router-dom';
import FallbackImage from '../../../../common/FallbackImage/FallbackImage';
import styles from './Comment.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPenToSquare, faTrashCan, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { CommentsProps } from '../../../../Landing/modules/LandingComments/LandingComments';
import { useAuthContext } from '../../../../../hooks/useAuthContext';
import { useModalContext } from '../../../../../hooks/useModalContext';
import Notification from '../../../../common/Notification/Notification';
import { useQueryClient } from 'react-query';
import { useCommentService } from '../../../../../services/commentService';
import { useMobilePushNotification } from '../../../../../services/mobilePushNotificationService';
import { NotificationActions } from '../../../../../constants/notificationActions';
import { useNotificationsWebsocket } from '../../../../../hooks/useNotificationsWebsocket';

export default function Comment({ content, createdAt, owner, id }: CommentsProps) {
    const [editComment, setEditComment] = useState(false);
    const [commentContent, setCommentContent] = useState(content);
    const { isAdministrator, isModerator, username, avatar, userId } = useAuthContext();
    const { useDeleteComment, useEditComment } = useCommentService();
    const confirmModal = useModalContext();
    const [fail, setFail] = useState(false);
    const { deleteComment } = useDeleteComment();
    const { editComment: edit } = useEditComment();
    const queryClient = useQueryClient();
    const { name } = useParams();
    const { useCreatePushNotification } = useMobilePushNotification();
    const { createPushNotification } = useCreatePushNotification();
    const { sendJsonMessage } = useNotificationsWebsocket();

    const createEditMobilePushNotificationHandler = async () => {
        try {
            const { pushNotificationResponse } = await createPushNotification({
                subject: NotificationActions.NEW_COMMENT,
                content: `${username} ${NotificationActions.EDITED_COMMENT}`,
            });
            await pushNotificationResponse;
        } catch (err) {
            console.error(err);
        }
    }

    const createDeleteMobilePushNotificationHandler = async () => {
        try {
            const { pushNotificationResponse } = await createPushNotification({
                subject: NotificationActions.NEW_COMMENT,
                content: `${username} ${NotificationActions.DELETED_COMMENT}`,
            });
            await pushNotificationResponse;
        } catch (err) {
            console.error(err);
        }
    }

    const editCommentHandler = async () => {
        setFail(false);
        try {
            if (commentContent.trim() != '') {
                const { editCommentResponse } = await edit(id!, commentContent);
                await editCommentResponse;
                await queryClient.invalidateQueries(['recipeComments', name!.toLowerCase()]);
                setEditComment(false);
                await Promise.all([
                    createEditMobilePushNotificationHandler(),
                    sendJsonMessage({
                        action: 'EDITED_COMMENT',
                        locationName: name!,
                        senderAvatar: avatar,
                        senderId: userId,
                        senderUsername: username,
                        ownerName: owner.username,
                    })
                ]);
            }
        } catch (err) {
            setFail(true);
            console.error(err);
        }
    }

    const deleteCommentHandler = async () => {
        setFail(false);
        try {
            await sendJsonMessage({
                action: 'DELETED_COMMENT',
                locationName: name!,
                senderAvatar: avatar,
                senderId: userId,
                senderUsername: username,
                ownerName: owner.username,
            });
            const { deleteCommentResponse } = await deleteComment(id!);
            await deleteCommentResponse;
            await queryClient.invalidateQueries(['recipeComments', name!.toLowerCase()]);
            await createDeleteMobilePushNotificationHandler();
        } catch (err) {
            setFail(true);
            console.error(err);
        }
    }

    return (
        <>
            <article className={styles.comment}>
                <header className={styles['comment-header']}>
                    <Link to={`/user/${owner.username}`}>
                        <div className={styles['image-container']}>
                            <FallbackImage src={owner.avatarURL} alt={"/images/avatar.png"} />
                        </div>
                    </Link>
                    <Link to={`/user/${owner.username}`}>
                        <h3 className={styles['comment-username']}>{owner.username}</h3>
                    </Link>
                    <span className={styles.date}>{createdAt.replace('T', ', ').substring(0, 17)}</span>
                </header>
                <main className={styles.content}>
                    <section className={styles['icon-container']}>
                        {
                            editComment
                                ?
                                <>
                                    <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className={styles.icon}
                                        style={{ color: 'green' }}
                                        onClick={editCommentHandler}
                                    />
                                    <FontAwesomeIcon
                                        icon={faXmarkCircle}
                                        className={styles.icon}
                                        style={{ color: 'darkred' }}
                                        onClick={() => { setEditComment(false); setCommentContent(content) }}
                                    />
                                </>
                                :
                                <>
                                    <FontAwesomeIcon
                                        style={
                                            isAdministrator || isModerator || username === owner.username
                                                ? {}
                                                : { display: 'none' }
                                        }
                                        icon={faPenToSquare}
                                        className={styles.icon}
                                        onClick={() => setEditComment(true)}
                                    />
                                    <FontAwesomeIcon
                                        style={
                                            isAdministrator || isModerator || username === owner.username
                                                ? {}
                                                : { display: 'none' }
                                        }
                                        icon={faTrashCan}
                                        className={styles.icon}
                                        onClick={() => {
                                            confirmModal({ title: 'Сигурни ли сте, че искате да изтриете този коментар?' })
                                                .then(() => {
                                                    deleteCommentHandler();
                                                })
                                                .catch(() => console.info('action canceled.'))
                                        }}
                                    />
                                </>
                        }
                    </section>
                    {
                        editComment ?
                            <input
                                type="text"
                                name="edit-comment"
                                value={commentContent}
                                className={styles['edit-comment-input']}
                                onChange={(e) => setCommentContent(e.target.value)}
                            />
                            : commentContent
                    }
                </main>
            </article>
            <Notification
                type={'fail'}
                isVisible={fail}
                message={'Не успяхме да редактираме коментара. Моля опитайте по-късно.'}
            />
        </>
    );
}