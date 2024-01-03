import RecipesTemplate from "../RecipesTemplate/RecipesTemplate";
import * as favouritesService from '../../../../services/favouritesService';
import { useAuthContext } from "../../../../hooks/useAuthContext";

export default function FavouriteRecipes() {
    const { username } = useAuthContext();
    const { recipes } = favouritesService.getUserFavouriteRecipes(username);

    return (
        <RecipesTemplate heading="Любими Рецепти" recipes={recipes ? recipes : []} />
    )
}