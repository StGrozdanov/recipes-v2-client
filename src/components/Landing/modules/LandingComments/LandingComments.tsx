import { Link } from 'react-router-dom';
import FallbackImage from '../../../common/FallbackImage/FallbackImage';
import styles from './LandingComments.module.scss';
import { RecipeProps } from '../../../RecipeCard/RecipeCard';

export type Owner = {
    username: string,
    avatarURL: string,
}

export type CommentsProps = {
    content: string,
    createdAt: string,
    recipe: RecipeProps,
    owner: Owner,
}

export default function LandingComments({
    content,
    createdAt,
    recipe,
    owner,
}: CommentsProps) {
    return (
        <article className={styles.comment}>
            <header className={styles['comment-header']}>
                <h3 className={styles['comment-username']}>{owner.username}, </h3>
                <Link to={`/users/${owner.username}`}>
                    <div className={styles['image-container']}>
                        <FallbackImage src={owner.avatarURL} alt={"/images/avatar.png"} />
                    </div>
                </Link>
                <span className={styles['target-recipe']}>{recipe.recipeName}</span>
                <span className={styles.date}>{createdAt.replace('T', ', ').substring(0, 17)}</span>
            </header>
            <main className={styles.content}>{content}</main>
        </article>
    );
}