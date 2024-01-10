import { useEffect, useRef } from 'react';
import styles from './Catalogue.module.scss';
import RecipeCard from '../RecipeCard/RecipeCard';
import BackToTopButton from '../common/BackToTopButton/BackToTopButton';
import { useEndlessScroll } from '../../hooks/useEndlessScroll';
import { capitalizatorUtil } from '../../utils/capitalizatorUtil';
import Notification from '../common/Notification/Notification';
import recipesFallback from './recipesFallback.json';
import { useRecipesService } from '../../services/recipesService';

export default function Catalogue() {
    const loader = useRef(null);
    const isInViewport = useEndlessScroll({ loadingRef: loader });
    const { getRecipes } = useRecipesService()
    const { fetchNextPage, hasNextPage, isLoading, data, isError } = getRecipes();

    useEffect(() => {
        if (hasNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isInViewport]);

    const recipes = isError ? recipesFallback.pages : data?.pages.flatMap(nestedPage => nestedPage.pages);

    return (
        <section className={styles["cards-section"]}>
            <ul className={styles["recipe-card-list"]}>
                {
                    !isLoading && recipes?.map(recipe => {
                        recipe.recipeName = capitalizatorUtil(recipe.recipeName);
                        return (
                            <RecipeCard
                                key={recipe.imageURL + recipe.recipeName}
                                {...recipe}
                                style={{ margin: '40px 35px 10px 35px' }}
                                animate
                            />
                        );
                    })
                }
            </ul>
            <div ref={loader} />
            <BackToTopButton scrollVisibility={0} />
            <Notification
                type={'fail'}
                isVisible={isError}
                message={'Здравейте, имаме проблем с зареждането на всички рецепти и работим по отстраняването му.'}
            />
        </section >
    )
}