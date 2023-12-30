import { CommentsProps } from '../components/Landing/modules/LandingComments/LandingComments';
import { useInfiniteQuery, useQueries, useQuery } from 'react-query';
import latestSixCommentsFallback from '../components/Landing/data/latestSixCommentsFallback.json';
import latestThreeRecipesFallback from '../components/Landing/data/latestThreeRecipesFallback.json';
import mostViewedRecipesFallback from '../components/Landing/data/mostViewedRecipesFallback.json';
import recipesFallback from '../components/Catalogue/recipesFallback.json';
import { RecipeDetails, RecipeSummary, RecipesPlaceholderData, ResponsePages } from './types';

export const BASE_URL = process.env.REACT_APP_DEV_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

const recipesPlaceHolderData: RecipesPlaceholderData = {
    pages: [recipesFallback],
    pageParams: [1],
};

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
            queryFn: getLatestRecipes,
            placeholderData: latestThreeRecipesFallback
        },
        {
            queryKey: 'latestSixComments',
            queryFn: getLatestComments,
            placeholderData: latestSixCommentsFallback
        },
        {
            queryKey: 'mostViewedRecipes',
            queryFn: getMostViewedRecipes,
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

/**
 * Used to fetch all recipes, utilising pagination with a default limit of 3 recipes per page.
 * @param page the page number 
 */
export const getRecipes = () => {
    const queryData = useInfiniteQuery(['recipes'], ({ pageParam = 1 }) => getRecipesRequest(pageParam), {
        getNextPageParam: (lastPage) => lastPage.pageData.lastPage ? undefined : lastPage.pageData.nextPage + 1,
        placeholderData: recipesPlaceHolderData,
    });

    return {
        ...queryData,
    }
}

/**
 * Used to search recipes by name including the search string
 * @param search the search string 
 */
export const searchRecipes = (search: string) => {
    const {
        data: recipesData,
        error: recipesFetchError,
        isFetching: recipesAreLoading
    } = useQuery(['recipesSearch', search], () => searchRecipesRequest(search));

    return {
        recipesData,
        recipesFetchError,
        recipesAreLoading
    }
}

/**
 * Used to search recipes by category that equals the search string
 * @param category the category name
 */
export const searchRecipesByCategory = (category: string) => {
    const {
        data: recipesData,
        error: recipesFetchError,
        isFetching: recipesAreLoading
    } = useQuery(['recipesCategorySearch', category], () => searchByCategoryRecipesRequest(category));

    return {
        recipesData,
        recipesFetchError,
        recipesAreLoading
    }
}

/**
 * Gets a recipe from the server
 */
export const getASingleRecipe = (recipeName: string) => {
    const {
        data: recipe,
        error: recipeFetchError,
        isFetching: recipeIsLoading
    } = useQuery(['recipe', recipeName.toLowerCase()], () => getASingleRecipeFunc(recipeName.toLowerCase()));

    return {
        recipe,
        recipeFetchError,
        recipeIsLoading
    }
}

/**
 * Gets all the recipes that the target user created
 */
export const getRecipesFromUser = (username: string) => {
    const {
        data: recipes,
        error: recipesFetchError,
        isFetching: recipesAreLoading
    } = useQuery(['recipesByUser', username], () => getRecipesFromUserRequest(username));

    return {
        recipes,
        recipesFetchError,
        recipesAreLoading
    }
}

/**
 * Gets all the recipes that the target user favourited
 */
export const getUserFavouriteRecipes = (username: string) => {
    const {
        data: recipes,
        error: recipesFetchError,
        isFetching: recipesAreLoading
    } = useQuery(['favouriteRecipes', username], () => getUserFavouriteRecipesRequest(username));

    return {
        recipes,
        recipesFetchError,
        recipesAreLoading
    }
}

const getLatestRecipes = async (): Promise<RecipeSummary[]> => {
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

const getMostViewedRecipes = async (): Promise<RecipeSummary[]> => {
    const response = await fetch(`${BASE_URL}/recipes/most-popular`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data}`);
    }
    return data;
}

const getRecipesRequest = async (page: number): Promise<ResponsePages> => {
    const RECIPES_PER_PAGE = 3;
    const response = await fetch(`${BASE_URL}/recipes?limit=${RECIPES_PER_PAGE}&cursor=${page - 1}`);
    const data: ResponsePages = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data}`);
    }
    return data;
}

const searchRecipesRequest = async (search: string): Promise<RecipeSummary[]> => {
    const response = await fetch(`${BASE_URL}/recipes?search=${search}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const searchByCategoryRecipesRequest = async (categoryName: string): Promise<RecipeSummary[]> => {
    const response = await fetch(`${BASE_URL}/recipes/category?name=${categoryName}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const getASingleRecipeFunc = async (recipeName: string): Promise<RecipeDetails> => {
    const response = await fetch(`${BASE_URL}/recipes/${recipeName}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const getRecipesFromUserRequest = async (username: string): Promise<RecipeSummary[]> => {
    const response = await fetch(`${BASE_URL}/recipes/user/${username}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const getUserFavouriteRecipesRequest = async (username: string): Promise<RecipeSummary[]> => {
    const response = await fetch(`${BASE_URL}/recipes/favourites/${username}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}