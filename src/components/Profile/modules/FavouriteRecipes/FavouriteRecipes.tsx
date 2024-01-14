import RecipesTemplate from "../RecipesTemplate/RecipesTemplate";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useFavouritesService } from "../../../../services/favouritesService";
import Notification from "../../../common/Notification/Notification";

export default function FavouriteRecipes() {
    const { username } = useAuthContext();
    const { getUserFavouriteRecipes } = useFavouritesService();
    const { recipes, recipesFetchError } = getUserFavouriteRecipes(username);

    return (
        <>
            <RecipesTemplate heading="Любими Рецепти" recipes={recipes ? recipes : []} />
            <Notification
                type={'fail'}
                isVisible={recipesFetchError as boolean}
                message={'Здравейте, имаме проблем с зареждането на всички рецепти и работим по отстраняването му.'}
            />
        </>
    )
}