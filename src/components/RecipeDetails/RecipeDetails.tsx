import { useState } from "react";
import { useParams } from "react-router-dom";
import * as recipeService from '../../services/recipesService';
import { capitalizatorUtil } from "../utils/capitalizatorUtil";
import RecipeStep from "./modules/RecipeSteps/RecipeStep";
import styles from './RecipeDetails.module.scss';
import RecipeDetailsHeader from "./modules/RecipeDetailsHeader/RecipeDetailsHeader";
import RecipePanel from "./modules/RecipePanel/RecipePanel";
import RecipePanelNavigation from './modules/RecipePanel/modules/RecipePanelNavigation';
import LoadingPan from "../common/LoadingPan/LoadingPan";

export default function RecipeDetails() {
    const [viewportStep, setViewportStep] = useState(0);
    const { name } = useParams();

    const { recipe, recipeIsLoading } = recipeService.getASingleRecipe(name as string);
    recipe ? recipe.recipeName = capitalizatorUtil(recipe.recipeName) : '';

    const viewportStepHandler = (step: number) => setViewportStep(step);

    return (
        recipeIsLoading
            ? <LoadingPan />
            : <article className={styles.container}>
                <section className={styles['top-section']}>
                    <RecipeDetailsHeader
                        category={recipe?.category}
                        name={recipe?.recipeName}
                        image={recipe?.imageURL}
                        ownerName={recipe?.owner.username}
                    />
                    <article className={styles['panel-container']}>
                        <RecipePanel
                            calories={recipe?.calories}
                            preparationTime={recipe?.preparationTime}
                            products={recipe?.products}
                            protein={recipe?.protein}
                        />
                        <RecipePanelNavigation recipeName={recipe?.recipeName} />
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
    );
}