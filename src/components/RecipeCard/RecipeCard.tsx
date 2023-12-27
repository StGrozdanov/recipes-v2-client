import { Link } from 'react-router-dom';
import FallbackImage from '../common/FallbackImage/FallbackImage';
import styles from './RecipeCard.module.scss';
import { capitalizatorUtil } from '../utils/capitalizatorUtil';

export type RecipeProps = {
    imageURL: string,
    recipeName: string,
    category?: string,
    style?: object,
    animate?: boolean,
}

export default function RecipeCard({
    imageURL,
    recipeName,
    category,
    style,
    animate,
}: RecipeProps
) {
    return (
        <article
            className={styles["card-container"] + (animate ? ' animate__animated animate__fadeInUp' : '')}
            style={style ? style : {}}
        >
            <Link to={`/details/${recipeName}`}>
                <header className={styles["picture-container"]}>
                    <FallbackImage src={imageURL} alt={"/images/food.jpg"} />
                </header>
            </Link>
            <main>
                <h3 className={styles["recipe-name"]}>{capitalizatorUtil(recipeName)}</h3>
            </main>
            <footer className={styles["card-footer"]}>{category}</footer>
        </article >
    );
}