import { useQuery } from "react-query";
import { BASE_URL } from "./recipesService";
import { UserProfileData } from "./types";

/**
 * Gets the user data
 * @param username the username of the user
 */
export const getUser = (username: string) => {
    const {
        data: user,
        error: userFetchError,
        isFetching: userIsLoading
    } = useQuery(['user', username], () => getUserRequest(username));

    return {
        user,
        userFetchError,
        userIsLoading
    }
}

const getUserRequest = async (username: string): Promise<UserProfileData> => {
    const response = await fetch(`${BASE_URL}/users/${username}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data}`);
    }
    return data;
}