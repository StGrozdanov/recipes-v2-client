import { useQueries } from "react-query";
import latestSixCommentsFallback from '../components/Landing/data/latestSixCommentsFallback.json';
import latestThreeRecipesFallback from '../components/Landing/data/latestThreeRecipesFallback.json';
import mostViewedRecipesFallback from '../components/Landing/data/mostViewedRecipesFallback.json';
import { CommentsProps } from '../components/Landing/modules/LandingComments/LandingComments';
import { BASE_URL } from "./recipesService";
import { RecipeSummary } from "./types";
import { useRequestHandler } from "../hooks/useRequestHandler";

/**
 * Used to fetch the latest recipes, the most viewed recipes and the latest comments data. It is an abstraction
 * over the useQueries hook of ReactQuery - returning the data, error for each request and a isFetching boolean
 * that will resolve to false when all 3 requests are passed with success
 */
export const useGetLandingPageData = () => {
    const getLandingPageData = () => {
        const { GET } = useRequestHandler();

        const [
            { data: latestRecipesData, error: recipesFetchError, isFetching: recipesAreLoading },
            { data: latestCommentsData, error: commentsFetchError, isFetching: commentsAreLoading },
            { data: mostViewedRecipesData, error: mostViewedFetchError, isFetching: mostViewedAreLoading },
        ] = useQueries([
            {
                queryKey: 'latestThreeRecipes',
                queryFn: (): Promise<RecipeSummary[]> => GET(`${BASE_URL}/recipes/latest`),
                placeholderData: latestThreeRecipesFallback
            },
            {
                queryKey: 'latestSixComments',
                queryFn: (): Promise<CommentsProps[]> => GET(`${BASE_URL}/comments/latest`),
                placeholderData: latestSixCommentsFallback
            },
            {
                queryKey: 'mostViewedRecipes',
                queryFn: (): Promise<RecipeSummary[]> => GET(`${BASE_URL}/recipes/most-popular`),
                placeholderData: mostViewedRecipesFallback
            },
        ]);

        const isFetching = recipesAreLoading || commentsAreLoading || mostViewedAreLoading;

        return {
            latestRecipesData,
            latestCommentsData,
            mostViewedRecipesData,
            recipesFetchError,
            commentsFetchError,
            mostViewedFetchError,
            isFetching,
        }
    }

    return {
        getLandingPageData,
    }
}