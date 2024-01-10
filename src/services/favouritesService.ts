import { useCallback } from "react";
import { useMutation, useQuery } from "react-query";
import { RecipeFavouritesProps, RecipeSummary } from "./types";
import { BASE_URL } from "./recipesService";
import { useRequestHandler } from "../hooks/useRequestHandler";

/**
 * hook to handle all favourite recipe related requests
 * @returns handler functions
 */
export const useFavouritesService = () => {
    const { GET, POST, authPOST, authDELETE } = useRequestHandler();

    const getUserFavouriteRecipes = (username: string) => {
        const {
            data: recipes,
            error: recipesFetchError,
            isFetching: recipesAreLoading
        } = useQuery(['favouriteRecipes', username], () => {
            const response: Promise<RecipeSummary[]> = GET(`${BASE_URL}/recipes/favourites/${username}`);
            return response;
        });

        return {
            recipes,
            recipesFetchError,
            recipesAreLoading
        }
    }

    const recipeIsInFavourites = (userId: number, recipeName: string) => {
        const {
            data: isInFavourites,
            error: favouritesFetchError,
            isFetching: favouritesAreLoading
        } = useQuery(['checkFavouriteRecipes', userId, recipeName], () => {
            const response: Promise<boolean> = POST(`${BASE_URL}/recipes/is-favourite`, { userId, recipeName });
            return response;
        });

        return {
            isInFavourites,
            favouritesFetchError,
            favouritesAreLoading
        }
    }

    const useAddToFavourites = () => {
        const {
            mutateAsync: addToFavouritesMutation,
            isLoading,
            isError
        } = useMutation((data: RecipeFavouritesProps) => {
            const response: Promise<{ status: string }> = authPOST(`${BASE_URL}/recipes/add-to-favourites`, data);
            return response;
        }, { retry: 3 });

        const addToFavourites = useCallback(async (data: RecipeFavouritesProps) => {
            try {
                const response = await addToFavouritesMutation(data);
                return { response };
            } catch (error) {
                return { error };
            }
        }, [addToFavouritesMutation]);

        return { addToFavourites, isLoading, isError };
    }

    const useRemoveFromFavourites = () => {
        const {
            mutateAsync: removeFromFavouritesMutation,
            isLoading,
            isError
        } = useMutation((data: RecipeFavouritesProps) => {
            const response: Promise<{ status: string }> = authDELETE(`${BASE_URL}/recipes/remove-from-favourites`, data);
            return response;
        }, { retry: 3 });

        const removeFromFavourites = useCallback(async (data: RecipeFavouritesProps) => {
            try {
                const response = await removeFromFavouritesMutation(data);
                return { response };
            } catch (error) {
                return { error };
            }
        }, [removeFromFavouritesMutation]);

        return { removeFromFavourites, isLoading, isError };
    }

    return {
        getUserFavouriteRecipes,
        recipeIsInFavourites,
        useAddToFavourites,
        useRemoveFromFavourites,
    }
}