import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import recipesFallback from '../components/Catalogue/recipesFallback.json';
import { RecipeDetails, RecipeSummary, RecipesPlaceholderData, ResponsePages, UploadRecipeImageProps } from './types';
import { useCallback } from 'react';

export const BASE_URL = process.env.REACT_APP_DEV_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

const recipesPlaceHolderData: RecipesPlaceholderData = {
    pages: [recipesFallback],
    pageParams: [1],
};

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

/**
 * Checks if the provided recipeName already exists in the database
 */
export const recipeIsAvailableRequest = async (recipeName: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/recipes/check-name`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipeName }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

/**
 * Used to send register request to the server
 */
export const useAddRecipe = (token: string) => {
    const {
        mutateAsync: addRecipeMutation,
        isLoading,
        isError
    } = useMutation((data: RecipeDetails) => addRecipeRequest(data, token), { retry: 3 });

    const create = useCallback(async (data: RecipeDetails) => {
        try {
            const recipeCreateResponse = addRecipeMutation(data);
            return { recipeCreateResponse };
        } catch (error) {
            return { error };
        }
    }, [addRecipeMutation]);

    return { create, isLoading, isError };
};

const addRecipeRequest = async (recipeData: RecipeDetails, token: string): Promise<RecipeDetails> => {
    const response = await fetch(`${BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,
        },
        body: JSON.stringify(recipeData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    return data;
}

const uploadRecipeImageRequest = async ({ formData, token }: UploadRecipeImageProps): Promise<{ imageURL: string }> => {
    const response = await fetch(`${BASE_URL}/recipes/upload-image`, {
        method: 'POST',
        headers: {
            'X-Authorization': token,
        },
        body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    return data;
}

/**
 * uploads new recipe image for the selected recipe
 */
export const useUploadRecipeImage = () => {
    const {
        mutateAsync: uploadMutation,
        isLoading,
        isError
    } = useMutation((data: UploadRecipeImageProps) => uploadRecipeImageRequest(data), { retry: 3 });

    const uploadImage = useCallback(async (data: UploadRecipeImageProps) => {
        try {
            const uploadResponse = await uploadMutation(data);
            return { uploadResponse };
        } catch (error) {
            return { error };
        }
    }, [uploadMutation]);

    return { uploadImage, isLoading, isError };
};