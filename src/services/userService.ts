import { useMutation, useQuery } from "react-query";
import { BASE_URL } from "./recipesService";
import { UploadImageProps, UserProfileData } from "./types";
import { useCallback } from "react";

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

/**
 * uploads new cover image for the selected user
 */
export const useUploadCoverImage = () => {
    const {
        mutateAsync: uploadMutation,
        isLoading,
        isError
    } = useMutation((data: UploadImageProps) => uploadCoverImageRequest(data), { retry: 3 });

    const uploadCover = useCallback(async (data: UploadImageProps) => {
        try {
            const uploadResponse = await uploadMutation(data);
            return { uploadResponse };
        } catch (error) {
            return { error };
        }
    }, [uploadMutation]);

    return { uploadCover, isLoading, isError };
};

/**
 * uploads new avatar image for the selected user
 */
export const useUploadAvatarImage = () => {
    const {
        mutateAsync: uploadMutation,
        isLoading,
        isError
    } = useMutation((data: UploadImageProps) => uploadAvatarImageRequest(data), { retry: 3 });

    const uploadAvatar = useCallback(async (data: UploadImageProps) => {
        try {
            const uploadResponse = await uploadMutation(data);
            return { uploadResponse };
        } catch (error) {
            return { error };
        }
    }, [uploadMutation]);

    return { uploadAvatar, isLoading, isError };
};

const uploadCoverImageRequest = async ({ formData, token }: UploadImageProps): Promise<{ coverImageURL: string }> => {
    const response = await fetch(`${BASE_URL}/upload/image/users/cover-image`, {
        method: 'POST',
        headers: {
            'X-Authorization': token,
        },
        body: formData
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data}`);
    }
    return data;
}

const uploadAvatarImageRequest = async ({ formData, token }: UploadImageProps): Promise<{ avatarImageURL: string }> => {
    const response = await fetch(`${BASE_URL}/upload/image/users/avatar-image`, {
        method: 'POST',
        headers: {
            'X-Authorization': token,
        },
        body: formData
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    return data;
}

const getUserRequest = async (username: string): Promise<UserProfileData> => {
    const response = await fetch(`${BASE_URL}/users/${username}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data}`);
    }
    return data;
}