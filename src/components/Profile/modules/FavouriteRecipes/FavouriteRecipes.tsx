import RecipesTemplate from "../RecipesTemplate/RecipesTemplate";
import * as recipeService from '../../../../services/recipesService';
import { useAuthContext } from "../../../../hooks/useAuthContext";

export default function FavouriteRecipes() {
    const { username } = useAuthContext();
    const { recipes } = recipeService.getUserFavouriteRecipes(username);

    return (
        <RecipesTemplate heading="Любими Рецепти" recipes={recipes ? recipes : []} />
    )
}