import { CommentsProps } from '../components/Landing/modules/LandingComments/LandingComments';
import { RecipeProps } from '../components/RecipeCard/RecipeCard';
import { useQueries } from 'react-query';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Used to fetch the latest recipes, the most viewed recipes and the latest comments data. It is an abstraction
 * over the useQueries hook of ReactQuery - returning the data, error for each request and a isFetching boolean
 * that will resolve to false when all 3 requests are passed with success
 */
export const getLandingPageData = () => {
    const [
        { data: latestRecipesData, error: recipesFetchError, isFetching: recipesAreLoading },
        { data: latestCommentsData, error: commentsFetchError, isFetching: commentsAreLoading },
        { data: mostViewedRecipesData, error: mostViewedFetchError, isFetching: mostViewedAreLoading },
    ] = useQueries([
        {
            queryKey: 'latestThreeRecipes',
            queryFn: getLatestRecipes
        },
        {
            queryKey: 'latestSixComments',
            queryFn: getLatestComments
        },
        {
            queryKey: 'mostViewedRecipes',
            queryFn: getMostViewedRecipes
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

const getLatestRecipes = async (): Promise<RecipeProps[]> => {
    const response = await fetch(`${BASE_URL}/recipes/latest`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const getLatestComments = async (): Promise<CommentsProps[]> => {
    const response = await fetch(`${BASE_URL}/comments/latest`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data}`);
    }
    return data;
}

const getMostViewedRecipes = async (): Promise<RecipeProps[]> => {
    const response = await fetch(`${BASE_URL}/recipes/most-viewed`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data}`);
    }
    return data;
}