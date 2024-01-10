import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import recipesFallback from '../components/Catalogue/recipesFallback.json';
import { RecipeDetails, RecipeSummary, RecipesPlaceholderData, ResponsePages, UploadRecipeImageProps } from './types';
import { useCallback } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useRequestHandler } from '../hooks/useRequestHandler';

export const BASE_URL = process.env.REACT_APP_DEV_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

const recipesPlaceHolderData: RecipesPlaceholderData = {
    pages: [recipesFallback],
    pageParams: [1],
};

/**
 * hook to handle all recipe related requests
 * @returns handler functions
 */
export const useRecipesService = () => {
    const { GET, authPOST, authPUT, authDELETE } = useRequestHandler();
    const { token } = useAuthContext();

    const getRecipes = () => {
        const RECIPES_PER_PAGE = 3;

        const queryData = useInfiniteQuery(['recipes'], ({ pageParam = 1 }) => {
            const response: Promise<ResponsePages> = GET(`${BASE_URL}/recipes?limit=${RECIPES_PER_PAGE}&cursor=${pageParam - 1}`);
            return response;
        }, {
            getNextPageParam: (lastPage) => lastPage.pageData.lastPage ? undefined : lastPage.pageData.nextPage + 1,
            placeholderData: recipesPlaceHolderData,
        });

        return {
            ...queryData,
        }
    }

    const searchRecipes = (search: string) => {
        const {
            data: recipesData,
            error: recipesFetchError,
            isFetching: recipesAreLoading
        } = useQuery(['recipesSearch', search], () => {
            const response: Promise<RecipeSummary[]> = GET(`${BASE_URL}/recipes?search=${search}`);
            return response;
        });

        return {
            recipesData,
            recipesFetchError,
            recipesAreLoading
        }
    }

    const searchRecipesByCategory = (category: string) => {
        const {
            data: recipesData,
            error: recipesFetchError,
            isFetching: recipesAreLoading
        } = useQuery(['recipesCategorySearch', category], () => {
            const response: Promise<RecipeSummary[]> = GET(`${BASE_URL}/recipes/category?name=${category}`);
            return response;
        });

        return {
            recipesData,
            recipesFetchError,
            recipesAreLoading
        }
    }

    const getASingleRecipe = (recipeName: string) => {
        const {
            data: recipe,
            error: recipeFetchError,
            isLoading: recipeIsLoading
        } = useQuery(['recipe', recipeName.toLowerCase()], () => {
            const response: Promise<RecipeDetails> = GET(`${BASE_URL}/recipes/${recipeName.toLowerCase()}`);
            return response;
        });

        return {
            recipe,
            recipeFetchError,
            recipeIsLoading
        }
    }

    const getRecipesFromUser = (username: string) => {
        const {
            data: recipes,
            error: recipesFetchError,
            isFetching: recipesAreLoading
        } = useQuery(['recipesByUser', username], () => {
            const response: Promise<RecipeSummary[]> = GET(`${BASE_URL}/recipes/user/${username}`);
            return response;
        });

        return {
            recipes,
            recipesFetchError,
            recipesAreLoading
        }
    }

    const useAddRecipe = () => {
        const {
            mutateAsync: addRecipeMutation,
            isLoading,
            isError
        } = useMutation((data: RecipeDetails) => {
            const response: Promise<RecipeDetails> = authPOST(`${BASE_URL}/recipes`, data);
            return response;
        }, { retry: 3 });

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

    const useEditRecipeRequest = () => {
        const {
            mutateAsync: editRecipeMutation,
            isLoading,
            isError
        } = useMutation(({ data, recipeName }: { data: RecipeDetails, recipeName: string }) => {
            const response: Promise<RecipeDetails> = authPUT(`${BASE_URL}/recipes/${recipeName}`, data);
            return response;
        }, { retry: 3 });

        const edit = useCallback(async (data: RecipeDetails, recipeName: string) => {
            try {
                const recipeEditResponse = editRecipeMutation({ data, recipeName });
                return { recipeEditResponse };
            } catch (error) {
                return { error };
            }
        }, [editRecipeMutation]);

        return { edit, isLoading, isError };
    };

    const useUploadRecipeImage = () => {
        const {
            mutateAsync: uploadMutation,
            isLoading,
            isError
        } = useMutation((data: UploadRecipeImageProps) => {
            const response: Promise<{
                imageURL: string
            }> = authPOST(`${BASE_URL}/recipes/upload-image`, data.formData as FormData, {
                'X-Authorization': token,
            });
            return response;
        }, { retry: 3 });

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

    const useDeleteRecipe = () => {
        const {
            mutateAsync: deleteRecipeMutation,
            isLoading,
            isError
        } = useMutation(({ recipeName }: { recipeName: string }) => {
            const response: Promise<{ status: string }> = authDELETE(`${BASE_URL}/recipes/${recipeName}`);
            return response;
        }, { retry: 3 });

        const deleteRecipe = useCallback(async (recipeName: string) => {
            try {
                const recipeDeleteResponse = deleteRecipeMutation({ recipeName });
                return { recipeDeleteResponse };
            } catch (error) {
                return { error };
            }
        }, [deleteRecipeMutation]);

        return { deleteRecipe, isLoading, isError };
    };

    return {
        getRecipes,
        searchRecipes,
        searchRecipesByCategory,
        getASingleRecipe,
        getRecipesFromUser,
        useAddRecipe,
        useEditRecipeRequest,
        useUploadRecipeImage,
        useDeleteRecipe,
    }
}

/**
 * checks if recipe name is available
 * @param recipeName 
 * @returns true if the recipe exists and false if it does not
 */
export const recipeIsAvailableRequest = async (recipeName: string): Promise<boolean> => 

{
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