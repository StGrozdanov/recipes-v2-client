import { useCallback } from "react";
import { useMutation, useQuery } from "react-query";
import { RecipeFavouritesProps, RecipeSummary } from "./types";
import { BASE_URL } from "./recipesService";

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

/**
 * Checks if a recipe is in favourites
 */
export const recipeIsInFavourites = (userId: number, recipeName: string) => {
    const {
        data: isInFavourites,
        error: favouritesFetchError,
        isFetching: favouritesAreLoading
    } = useQuery(['checkFavouriteRecipes', userId, recipeName], () => recipeIsInFavouritesRequest(userId, recipeName));

    return {
        isInFavourites,
        favouritesFetchError,
        favouritesAreLoading
    }
}

/**
 * Adds recipe to favourites
 */
export const useAddToFavourites = () => {
    const {
        mutateAsync: addToFavouritesMutation,
        isLoading,
        isError
    } = useMutation((data: RecipeFavouritesProps) => addToFavouritesRequest(data), { retry: 3 });

    const addToFavourites = useCallback(async (data: RecipeFavouritesProps) => {
        try {
            const response = await addToFavouritesMutation(data);
            return { response };
        } catch (error) {
            return { error };
        }
    }, [addToFavouritesMutation]);

    return { addToFavourites, isLoading, isError };
};

/**
 * Adds recipe to favourites
 */
export const useRemoveFromFavourites = () => {
    const {
        mutateAsync: removeFromFavouritesMutation,
        isLoading,
        isError
    } = useMutation((data: RecipeFavouritesProps) => removeFromFavouritesRequest(data), { retry: 3 });

    const removeFromFavourites = useCallback(async (data: RecipeFavouritesProps) => {
        try {
            const response = await removeFromFavouritesMutation(data);
            return { response };
        } catch (error) {
            return { error };
        }
    }, [removeFromFavouritesMutation]);

    return { removeFromFavourites, isLoading, isError };
};

const getUserFavouriteRecipesRequest = async (username: string): Promise<RecipeSummary[]> => {
    const response = await fetch(`${BASE_URL}/recipes/favourites/${username}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const recipeIsInFavouritesRequest = async (userId: number, recipeName: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/recipes/is-favourite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, recipeName })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    return data;
}

const addToFavouritesRequest = async (favouritesData: RecipeFavouritesProps): Promise<{ status: string }> => {
    const response = await fetch(`${BASE_URL}/recipes/add-to-favourites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': favouritesData.token || '',
        },
        body: JSON.stringify(favouritesData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    return data;
}

const removeFromFavouritesRequest = async (favouritesData: RecipeFavouritesProps): Promise<{ status: string }> => {
    const response = await fetch(`${BASE_URL}/recipes/remove-from-favourites`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': favouritesData.token || '',
        },
        body: JSON.stringify(favouritesData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    return data;
}