import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext"
import * as recipesService from "../../services/recipesService";
import * as userService from "../../services/userService";
import RecipeCard from "../RecipeCard/RecipeCard";
import { capitalizatorUtil } from "../utils/capitalizatorUtil";
import styles from './UserProfile.module.scss';
import ProfileCard from "./modules/ProfileCard";

export default function UserProfile() {
    const { username } = useParams();
    const { isAuthenticated } = useAuthContext();
    const { recipes } = recipesService.getRecipesFromUser(username as string);
    const { user } = userService.getUser(username as string);

    return (
        <section className={styles["user-section"]}>
            <section className={styles["cards-section"]}>
                {
                    recipes && recipes.length > 0
                        ? recipes.map(recipe => {
                            recipe.recipeName = capitalizatorUtil(recipe.recipeName);
                            return (
                                <RecipeCard
                                    key={recipe.imageURL + recipe.recipeName}
                                    {...recipe}
                                    animate
                                />
                            );
                        })
                        : <h4 className={styles['cards-heading']}>Потребителят не е добавил рецепти.</h4>
                }
            </section>
            <section className={styles["user-section-profile"]}>
                <ProfileCard user={user} isAuthenticated={isAuthenticated} />
            </section>
        </section>
    )
}