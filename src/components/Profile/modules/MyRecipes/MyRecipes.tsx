import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useRecipesService } from "../../../../services/recipesService";
import RecipesTemplate from "../RecipesTemplate/RecipesTemplate";

export default function MyRecipes() {
    const { username } = useAuthContext();
    const { getRecipesFromUser } = useRecipesService();
    const { recipes } = getRecipesFromUser(username);
    return (
        <RecipesTemplate heading="Създадени Рецепти" recipes={recipes ? recipes : []} />
    );
}