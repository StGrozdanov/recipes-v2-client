import styles from './RecipeDetailsHeader.module.scss';
import FallbackImage from '../../../common/FallbackImage/FallbackImage';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';

type RecipeDetailsHaderProps = {
    category?: string,
    name?: string,
    ownerName?: string,
    image?: string,
    isFavourite: boolean,
    isAuthenticated: boolean,
    addToFavouritesHandler: () => void,
    removeFromFavouritesHandler: () => void,
}

export default function RecipeDetailsHeader({
    category,
    name,
    ownerName,
    image,
    isAuthenticated,
    isFavourite,
    addToFavouritesHandler,
    removeFromFavouritesHandler,
}: RecipeDetailsHaderProps) {
    return (
        <>
            <section>
                <h4 className={styles['recipe-category']}>{category}</h4>
                <h2
                    className={styles['recipe-name']}
                    style={isAuthenticated ? { minHeight: '50px' } : { minHeight: '114px' }}
                >
                    {name}
                </h2>
                {
                    isAuthenticated
                        ? isFavourite
                            ? <FontAwesomeIcon
                                size='2x'
                                color='#E6B080'
                                icon={solidStar}
                                className={styles.favourites}
                                onClick={removeFromFavouritesHandler}
                            />
                            : <FontAwesomeIcon
                                size='2x'
                                color='#E6B080'
                                icon={faStar}
                                className={styles.favourites}
                                onClick={addToFavouritesHandler}
                            />
                        : null
                }
                <h4 className={styles['recipe-owner']}>
                    <span className={styles.published}>Публикувано от:</span>
                    <Link className={styles['owner-name']} to={`/user/${ownerName}`}>{ownerName}</Link>
                </h4>
                <h4 className={styles.method}>Метод на приготвяне</h4>
            </section>
            <div className={styles['recipe-image-container']}>
                <FallbackImage className={styles['recipe-image']} src={image || ''} alt={"/images/food.jpg"} />
            </div>
        </>
    );
}