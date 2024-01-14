import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useRecipesService } from "../../../../services/recipesService";
import RecipesTemplate from "../RecipesTemplate/RecipesTemplate";
import Notification from "../../../common/Notification/Notification";

export default function MyRecipes() {
    const { username } = useAuthContext();
    const { getRecipesFromUser } = useRecipesService();
    const { recipes, recipesFetchError } = getRecipesFromUser(username);
    return (
        <>
            <RecipesTemplate heading="Създадени Рецепти" recipes={recipes ? recipes : []} />
            <Notification
                type={'fail'}
                isVisible={recipesFetchError as boolean}
                message={'Здравейте, имаме проблем с зареждането на всички рецепти и работим по отстраняването му.'}
            />
        </>
    );
}