import { Navigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useRecipesService } from "../../../services/recipesService";

export default function RecipeOwnerRoute({ children }: { children: JSX.Element }) {
    const { isResourceOwner, isAdministrator, isModerator } = useAuthContext();
    const { name } = useParams();
    const { getASingleRecipe } = useRecipesService();
    const { recipe, recipeIsLoading } = getASingleRecipe(name?.toLowerCase() as string);

    return (
        recipeIsLoading
            ? <div>Loading ...</div>
            : recipe
                ? isResourceOwner(recipe.owner.id) || isAdministrator || isModerator
                    ? children
                    : <Navigate to="/login" replace />
                : <Navigate to="/login" replace />

    );
}