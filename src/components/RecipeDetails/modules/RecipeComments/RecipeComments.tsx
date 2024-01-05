import Comment from "./modules/Comment";
import styles from './RecipeComments.module.scss';
import * as commentService from '../../../../services/commentService';
import { useParams } from "react-router-dom";
import { useAuthContext } from '../../../../hooks/useAuthContext';
import FallbackImage from "../../../common/FallbackImage/FallbackImage";
import LoadingPan from "../../../common/LoadingPan/LoadingPan";

export default function RecipeComments() {
    const { name } = useParams();
    const { avatar, isAuthenticated } = useAuthContext();

    const { comments, commentsAreLoading } = commentService.getRecipeComments(name as string);

    // async function addCommentHandler(e) {
    //     e.preventDefault();
    //     const comment = new FormData(e.target).get('comment');

    //     if (comment.trim() !== '') {
    //         const content = { content: comment, targetRecipeId: recipeId, ownerId: user.id };
    //         await commentService.commentRecipe(content);
    //         commentService
    //             .getCommentsForRecipe(recipeId)
    //             .then(data => setComments(data))
    //             .catch(err => console.log(err));
    //         e.target.reset();
    //     }
    // }

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
                                    key={comment.content + comment.createdAt}
                                    content={comment.content}
                                    createdAt={comment.createdAt}
                                    owner={comment.owner}
                                    recipeName={comment.recipeName}
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
                        <form onSubmit={() => console.log('hi')}>
                            <input
                                type="text"
                                placeholder="Добави коментар ..."
                                name="comment"
                            />
                        </form>
                    </section>
                </article>
            </>
    );
}