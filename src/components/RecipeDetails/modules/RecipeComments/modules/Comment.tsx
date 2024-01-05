import { Link } from 'react-router-dom';
import FallbackImage from '../../../../common/FallbackImage/FallbackImage';
import styles from './Comment.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPenToSquare, faTrashCan, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { CommentsProps } from '../../../../Landing/modules/LandingComments/LandingComments';
import { useAuthContext } from '../../../../../hooks/useAuthContext';

export default function Comment({ content, createdAt, owner }: CommentsProps) {
    const [editComment, setEditComment] = useState(false);
    const [commentContent, setCommentContent] = useState(content);
    const { isAdministrator, isModerator, username } = useAuthContext();
    // const [showModal, setShowModal] = useState(false);
    // const [showComment, setShowComment] = useState(true);

    // async function editCommentHandler() {
    //     if (commentContent.trim() != '') {
    //         await commentService.editComment(commentContent, id);
    //         setEditComment(false);
    //     }
    // }

    // async function deleteCommentHandler(choice) {
    //     setShowModal(true);
    //     if (choice) {
    //         await commentService.removeComment(id);
    //         setShowComment(false);
    //     }
    //     setShowModal(false);
    // }

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
                                        onClick={() => console.log('hi')}
                                    />
                                    <FontAwesomeIcon
                                        icon={faXmarkCircle}
                                        className={styles.icon}
                                        style={{ color: 'darkred' }}
                                        onClick={() => setEditComment(false)}
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
                                        onClick={() => console.log('showing modal ...')}
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
            {/* <ModalDialogue
                visibility={showModal}
                content={'Сигурни ли сте, че искате да изтриете този коментар?'}
                handler={deleteCommentHandler}
            /> */}
        </>
    );
}