import RecipesTemplate from "../RecipesTemplate/RecipesTemplate";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useFavouritesService } from "../../../../services/favouritesService";

export default function FavouriteRecipes() {
    const { username } = useAuthContext();
    const { getUserFavouriteRecipes } = useFavouritesService();
    const { recipes } = getUserFavouriteRecipes(username);

    return (
        <RecipesTemplate heading="Любими Рецепти" recipes={recipes ? recipes : []} />
    )
}