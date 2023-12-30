import { useAuthContext } from "../../../../hooks/useAuthContext";
import * as recipesService from '../../../../services/recipesService';
import RecipesTemplate from "../RecipesTemplate/RecipesTemplate";

export default function MyRecipes() {
    const { username } = useAuthContext();
    const { recipes } = recipesService.getRecipesFromUser(username);

    return (
        <RecipesTemplate heading="Създадени Рецепти" recipes={recipes ? recipes : []} />
    );
}