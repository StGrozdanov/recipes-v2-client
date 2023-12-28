import { CommentsProps } from '../components/Landing/modules/LandingComments/LandingComments';
import { useInfiniteQuery, useMutation, useQueries, useQuery } from 'react-query';
import latestSixCommentsFallback from '../components/Landing/data/latestSixCommentsFallback.json';
import latestThreeRecipesFallback from '../components/Landing/data/latestThreeRecipesFallback.json';
import mostViewedRecipesFallback from '../components/Landing/data/mostViewedRecipesFallback.json';
import recipesFallback from '../components/Catalogue/recipesFallback.json';
import { LoginData, RecipeSummary, RecipesPlaceholderData, RegistrationData, ResetPasswordParams, ResponsePages, User, VerificationCodeResponse } from './types';
import { useCallback } from 'react';

const BASE_URL = process.env.REACT_APP_DEV_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

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
 * Used to send login request to the server
 */
export const useLogin = () => {
    const {
        mutateAsync: loginMutation,
        isLoading,
        isError,
    } = useMutation((data: LoginData) => loginRequest(data));

    const login = useCallback(async (data: LoginData) => {
        try {
            const loginResponse = loginMutation(data);
            return { loginResponse };
        } catch (error) {
            return { error };
        }
    }, [loginMutation]);

    return { login, isLoading, isError };
};

/**
 * Used to send register request to the server
 */
export const useRegistration = () => {
    const {
        mutateAsync: registrationMutation,
        isLoading,
        isError
    } = useMutation((data: RegistrationData) => registerRequest(data), { retry: 3 });

    const register = useCallback(async (data: RegistrationData) => {
        try {
            const registrationResponse = registrationMutation(data);
            return { registrationResponse };
        } catch (error) {
            return { error };
        }
    }, [registrationMutation]);

    return { register, isLoading, isError };
};

/**
 * Request verification code from the server for the password reset flow
 */
export const useRequestVerificationCode = () => {
    const {
        mutateAsync: requestVerificationMutation,
        isLoading,
        isError
    } = useMutation((email: string) => requestVerficiationCodeFunc(email));

    const requestVerificationCode = useCallback(async (email: string) => {
        try {
            const verificationCodeResponse = requestVerificationMutation(email);
            return { verificationCodeResponse };
        } catch (error) {
            return { error };
        }
    }, [requestVerificationMutation]);

    return { requestVerificationCode, isLoading, isError };
};

/**
 * Used to verify the code as part of the password reset flow
 */
export const useVerifyResetPasswordCode = () => {
    const {
        mutateAsync: requestVerificationMutation,
    } = useMutation((code: string) => verifyResetPasswordCodeFunc(code));

    const requestVerificationCode = useCallback(async (code: string) => {
        try {
            const verificationCodeResponse = requestVerificationMutation(code);
            return { verificationCodeResponse };
        } catch (error) {
            return { error };
        }
    }, [requestVerificationMutation]);

    return { requestVerificationCode };
};

/**
 * Used to reset the password of the user
 */
export const useResetPassword = () => {
    const {
        mutateAsync: resetPasswordMutation,
    } = useMutation((params: ResetPasswordParams) => resetPasswordFunc(params));

    const resetPassword = useCallback(async (params: ResetPasswordParams) => {
        try {
            const resetPasswordResponse = resetPasswordMutation(params);
            return { resetPasswordResponse };
        } catch (error) {
            return { error };
        }
    }, [resetPasswordMutation]);

    return { resetPassword };
};

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

const loginRequest = async (loginData: LoginData): Promise<User> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const registerRequest = async (registrationData: RegistrationData): Promise<User> => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

/**
 * Checks if the provided username is already registered in the server
 */
export const usernameIsAvailableRequest = async (username: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/auth/check-username`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

/**
 * Checks if the provided email is already registered in the server
 */
export const emailIsAvailableRequest = async (email: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const requestVerficiationCodeFunc = async (email: string): Promise<VerificationCodeResponse> => {
    const response = await fetch(`${BASE_URL}/auth/generate-verification-code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const verifyResetPasswordCodeFunc = async (code: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/auth/verify-code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const resetPasswordFunc = async ({ id, password }: ResetPasswordParams): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}