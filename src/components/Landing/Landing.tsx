import LandingHeader from "./modules/LandingHeader/LandingHeader";
import LandingNav from "./modules/LandingNav/LandingNav";
import LandingDescription from "./modules/LandingDescription/LandingDescription";
import LandingFeatures from './modules/LandingFeatures/LandingFeatures';
import styles from './Landing.module.scss';
import LandingComments from "./modules/LandingComments/LandingComments";
import BackToTopButton from "../common/BackToTopButton/BackToTopButton";
import LoadingPan from "../common/LoadingPan/LoadingPan";
import latestSixCommentsFallback from './data/latestSixCommentsFallback.json';
import latestThreeRecipesFallback from './data/latestThreeRecipesFallback.json';
import mostViewedRecipesFallback from './data/mostViewedRecipesFallback.json';
import RecipeCard from "../RecipeCard/RecipeCard";
import { capitalizatorUtil } from "../utils/capitalizatorUtil";
import Animate from "../common/Animate/Animate";
import * as recipesAPI from '../../services/recipesService';

export default function Landing() {
    const {
        latestRecipesData,
        latestCommentsData,
        mostViewedRecipesData,
        recipesFetchError,
        commentsFetchError,
        mostViewedFetchError,
        isFetching,
    } = recipesAPI.getLandingPageData();

    const latestRecipes = recipesFetchError ? latestThreeRecipesFallback : latestRecipesData;
    const latestComments = commentsFetchError ? latestSixCommentsFallback : latestCommentsData;
    const mostViewedRecipes = mostViewedFetchError ? mostViewedRecipesFallback : mostViewedRecipesData;

    console.log(recipesFetchError)
    console.log(latestRecipes);

    return (
        isFetching
            ? <LoadingPan style={{ width: 500 }} />
            : <section>
                <LandingNav />
                <LandingHeader />
                <LandingDescription />
                <LandingFeatures />
                <h3 className={styles["landing-heading"]}>Последни Публикации</h3>
                <section className={styles["landing-section"]}>
                    {
                        latestRecipes?.map((recipe, index) =>
                            <Animate
                                key={recipe.recipeName + 'animate'}
                                animationName="fadeInUp"
                                delay={index * 300}
                                duration={2}
                            >
                                <RecipeCard key={recipe.recipeName} {...recipe} />
                            </Animate>
                        )
                    }
                </section>

                <section className={styles["landing-section"]}>
                    <article className={styles["landing-article"]}>
                        <h3 className={styles["landing-heading"]}>
                            Най-разглеждани Рецепти
                        </h3>
                        {
                            mostViewedRecipes?.map(recipe =>
                                <Animate key={recipe.recipeName + 'animate'} animationName="fadeInDown">
                                    <RecipeCard key={recipe.recipeName} {...recipe} />
                                </Animate>
                            )
                        }
                    </article>
                    <Animate animationName="fadeInRight">
                        <article className={styles["landing-article"]}>
                            <h3 className={styles["landing-heading"]}>Последни Коментари</h3>
                            {
                                latestComments?.map(comment => {
                                    comment.recipe.recipeName = capitalizatorUtil(comment.recipe.recipeName);

                                    return (
                                        <LandingComments
                                            key={comment.content + comment.createdAt}
                                            {...comment}
                                        />
                                    );
                                })
                            }
                        </article>
                    </Animate>
                </section>
                <BackToTopButton />
            </section >
    )
}