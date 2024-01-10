import styles from './Category.module.scss';
import { Link, useLocation } from 'react-router-dom';
import RecipeCard from '../RecipeCard/RecipeCard';
import BackToTopButton from '../common/BackToTopButton/BackToTopButton';
import { capitalizatorUtil } from '../../utils/capitalizatorUtil';
import Notification from '../common/Notification/Notification';
import { RecipeSummary } from '../../services/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { useRecipesService } from '../../services/recipesService';

type SearchResults = {
    recipes: RecipeSummary[] | undefined,
    isLoading: boolean,
    fetchError: unknown,
}

export default function Search() {
    const location = useLocation();
    const { searchRecipesByCategory } = useRecipesService();

    const query = decodeURI(location.search.split('=')[1]);

    const searchResults: SearchResults = { recipes: [], isLoading: false, fetchError: undefined }

    if (query.trim() != '') {
        const {
            recipesData,
            recipesAreLoading,
            recipesFetchError
        } = searchRecipesByCategory(query)

        searchResults.recipes = recipesData;
        searchResults.isLoading = recipesAreLoading;
        searchResults.fetchError = recipesFetchError;
    }

    return (
        <section className={styles["search-section"]} style={{ minHeight: '75vh' }}>
            <ul className={styles["recipe-card-list"]}>
                <h2 className={styles["filtration-heading"]}>Рецепти от категория {query}:</h2>
                {
                    !searchResults.isLoading && searchResults.recipes && searchResults.recipes.length > 0
                        ?
                        searchResults.recipes.map(recipe => {
                            recipe.recipeName = capitalizatorUtil(recipe.recipeName);
                            return (
                                <RecipeCard
                                    key={recipe.recipeName + recipe.imageURL}
                                    {...recipe}
                                    style={{ margin: '40px 35px 10px 35px' }}
                                    animate
                                />
                            );
                        })
                        :
                        <div className={styles['no-results']}>
                            <h3>{searchResults.isLoading ? 'Зареждаме рецептите ...' : 'Все още няма такива рецепти. Можете да добавите първата или да се върнете на каталога'}</h3>
                            <Link to="/catalogue">
                                <FontAwesomeIcon
                                    className={styles["return-anker"]}
                                    icon={faShare}
                                />
                            </Link>
                        </div>
                }
            </ul>
            <BackToTopButton scrollVisibility={0} />
            <Notification
                type={'fail'}
                isVisible={searchResults.fetchError ? true : false}
                message={'Здравейте, имаме проблем с зареждането на рецепти и работим по отстраняването му.'}
            />
        </section >
    );
}