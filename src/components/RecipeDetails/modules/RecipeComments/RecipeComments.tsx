import styles from './RecipeComments.module.scss';
import { useParams } from "react-router-dom";
import { useAuthContext } from '../../../../hooks/useAuthContext';
import FallbackImage from "../../../common/FallbackImage/FallbackImage";
import LoadingPan from "../../../common/LoadingPan/LoadingPan";
import { useFormik } from "formik";
import { validationSchemas } from "../../../../configs/yupConfig";
import Comment from './modules/Comment';
import FailedValidationMessage from '../../../Authentication/FailedValidationMessage';
import { BaseCommentData } from '../../../../services/types';
import { useQueryClient } from 'react-query';
import { useState } from 'react';
import Notification from '../../../common/Notification/Notification';
import { useCommentService } from '../../../../services/commentService';

export default function RecipeComments() {
    const { name } = useParams();
    const { avatar, isAuthenticated, userId, username } = useAuthContext();
    const { useCreateComment, getRecipeComments } = useCommentService();
    const { createComment } = useCreateComment();
    const { comments, commentsAreLoading } = getRecipeComments(name as string);
    const queryClient = useQueryClient();
    const [failedComment, setFailedComment] = useState(false);

    const submitHandler = async (values: { comment: string }) => {
        setFailedComment(false);
        try {
            const newComment: BaseCommentData = {
                content: values.comment,
                recipeName: name!,
                owner: {
                    username: username,
                    id: userId,
                }
            }
            const { createCommentResponse } = await createComment(newComment);
            const response = await createCommentResponse;
            console.info(response);
            await queryClient.invalidateQueries(['recipeComments', name!.toLowerCase()]);
            formik.resetForm();
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

    return (
        commentsAreLoading
            ? <LoadingPan />
            : <>
                <h1 className={styles.heading}>Коментари</h1>
                <article className={styles.container}>
                    {
                        comments && comments.length > 0
                            ?
                            comments.map(comment =>
                                <Comment
                                    key={comment.id}
                                    content={comment.content}
                                    createdAt={comment.createdAt}
                                    owner={comment.owner}
                                    recipeName={comment.recipeName}
                                    id={comment.id}
                                />)
                            :
                            <h3 className={styles['no-comments']}>Все още няма коментари за тази рецепта.</h3>
                    }
                    <section
                        className={styles['add-comment-section']}
                        style={isAuthenticated ? {} : { display: 'none' }}
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
                                    ? <FailedValidationMessage message={formik.errors.comment} />
                                    : null
                            }
                        </form>
                    </section>
                </article>
                <Notification
                    type={'fail'}
                    isVisible={failedComment}
                    message={'Нещо се обърка при създаването на коментар. Моля опитайте по-късно.'}
                />
            </>
    );
}