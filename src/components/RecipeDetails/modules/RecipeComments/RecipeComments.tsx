import styles from './RecipeComments.module.scss';
import { useParams } from "react-router-dom";
import LoadingPan from "../../../common/LoadingPan/LoadingPan";
import Comment from './modules/Comment';
import { useCommentService } from '../../../../services/commentService';

export default function RecipeComments() {
    const { name } = useParams();
    const { getRecipeComments } = useCommentService();
    const { comments, commentsAreLoading } = getRecipeComments(name as string);
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
                </article>
            </>
    );
}