import { useQuery } from "react-query";
import { CommentsProps } from "../components/Landing/modules/LandingComments/LandingComments";
import { BASE_URL } from "./recipesService";

/**
 * Gets all comments for the given recipe
 * @param recipeName the name of the recipe
 */
export const getRecipeComments = (recipeName: string) => {
    const {
        data: comments,
        error: commentsFetchError,
        isFetching: commentsAreLoading
    } = useQuery(['recipeComments', recipeName.toLowerCase()], () => getCommentsRequest(recipeName.toLowerCase()));

    return {
        comments,
        commentsFetchError,
        commentsAreLoading
    }
}

const getCommentsRequest = async (recipeName: string): Promise<CommentsProps[]> => {
    const response = await fetch(`${BASE_URL}/comments/${recipeName}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data}`);
    }
    return data;
}