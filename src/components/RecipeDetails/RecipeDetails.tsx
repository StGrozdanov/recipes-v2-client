import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { capitalizatorUtil } from "../../utils/capitalizatorUtil";
import RecipeStep from "./modules/RecipeSteps/RecipeStep";
import styles from './RecipeDetails.module.scss';
import RecipeDetailsHeader from "./modules/RecipeDetailsHeader/RecipeDetailsHeader";
import RecipePanel from "./modules/RecipePanel/RecipePanel";
import RecipePanelNavigation from './modules/RecipePanel/modules/RecipePanelNavigation';
import LoadingPan from "../common/LoadingPan/LoadingPan";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useQueryClient } from "react-query";
import Notification from "../common/Notification/Notification";
import { useRecipesService } from "../../services/recipesService";
import { useFavouritesService } from "../../services/favouritesService";

export default function RecipeDetails() {
    const [viewportStep, setViewportStep] = useState(0);
    const { name } = useParams();
    const { isAuthenticated, userId, token, username } = useAuthContext();
    const { getASingleRecipe } = useRecipesService();
    const { useAddToFavourites, useRemoveFromFavourites, recipeIsInFavourites } = useFavouritesService();
    const { addToFavourites, isError } = useAddToFavourites();
    const { removeFromFavourites, isError: RemoveError } = useRemoveFromFavourites();
    const queryClient = useQueryClient();
    const [addToFavouritesSuccess, setAddToFavouritesSuccess] = useState(false);
    const [removeFromFavouritesSuccess, setRemoveFromFavouritesSuccess] = useState(false);

    const { recipe, recipeIsLoading } = getASingleRecipe(name as string);

    let recipeIsFavourite = false;

    if (isAuthenticated) {
        const { isInFavourites } = recipeIsInFavourites(userId, name?.toLowerCase() as string);
        recipeIsFavourite = isInFavourites as boolean;
    }

    const viewportStepHandler = (step: number) => setViewportStep(step);

    const favouriteRecipeHandler = async () => {
        const recipeName = name?.toLowerCase() as string;
        try {
            await addToFavourites({ recipeName, userId, token });
            await Promise.all([
                queryClient.invalidateQueries(['checkFavouriteRecipes', userId, recipeName]),
                queryClient.invalidateQueries(['favouriteRecipes', username]),
            ]);
            setAddToFavouritesSuccess(true);
        } catch (err) {
            console.error(err);
        }
    }

    const removeFromFavouritesRecipeHandler = async () => {
        const recipeName = name?.toLowerCase() as string;
        try {
            await removeFromFavourites({ recipeName, userId, token });
            await queryClient.invalidateQueries(['checkFavouriteRecipes', userId, recipeName]);
            await queryClient.invalidateQueries(['favouriteRecipes', username]);
            setRemoveFromFavouritesSuccess(true);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        recipeIsLoading
            ? <LoadingPan />
            : !recipe?.recipeName
                ? <Navigate to="/not-found" replace />
                : <>
                    <article className={styles.container}>
                        <section className={styles['top-section']}>
                            <RecipeDetailsHeader
                                category={recipe?.category}
                                name={recipe?.recipeName ? capitalizatorUtil(recipe.recipeName) : ''}
                                image={recipe?.imageURL}
                                ownerName={recipe?.owner?.username}
                                isFavourite={recipeIsFavourite}
                                isAuthenticated={isAuthenticated}
                                addToFavouritesHandler={favouriteRecipeHandler}
                                removeFromFavouritesHandler={removeFromFavouritesRecipeHandler}
                            />
                            <article className={styles['panel-container']}>
                                <RecipePanel
                                    calories={recipe?.calories || 0}
                                    preparationTime={recipe?.preparationTime || 0}
                                    products={recipe?.products}
                                    protein={recipe?.protein || 0}
                                />
                                <RecipePanelNavigation
                                    recipeName={recipe?.recipeName}
                                    ownerId={recipe?.owner?.id}
                                />
                            </article>
                        </section>
                        <section className={styles['methods-section']}>
                            <section className={styles.methods}>
                                {
                                    recipe?.steps && recipe.steps.length > 0 && recipe.steps.map(
                                        (step, index) =>
                                            <RecipeStep
                                                step={step}
                                                index={index}
                                                key={index}
                                                isInViewportHandler={viewportStepHandler}
                                            />
                                    )
                                }
                            </section>
                            <span className={styles['current-method-step']}>
                                {viewportStep + 1} от {recipe?.steps && recipe.steps.length}
                            </span>
                        </section>
                    </article>
                    <Notification
                        type={'fail'}
                        isVisible={isError}
                        message={'Не успяхме да добавим рецептата към любими. Моля опитайте по-късно.'}
                    />
                    <Notification
                        type={'success'}
                        isVisible={addToFavouritesSuccess}
                        message={'Успешно добавихте рецептата към любими!'}
                    />
                    <Notification
                        type={'fail'}
                        isVisible={RemoveError}
                        message={'Не успяхме да премахнем рецептата от любими. Моля опитайте по-късно.'}
                    />
                    <Notification
                        type={'info'}
                        isVisible={removeFromFavouritesSuccess}
                        message={'Успешно премахнахте рецептата от любими.'}
                    />
                </>
    );
}