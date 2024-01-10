import { useMutation, useQuery } from "react-query";
import { BASE_URL } from "./recipesService";
import { UploadImageProps, UserEditRequest, UserProfileData } from "./types";
import { useCallback } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useRequestHandler } from "../hooks/useRequestHandler";

/**
 * hook to handle all notifications related requests
 * @returns handler functions
 */
export const useUserService = () => {
    const { GET, authPOST, authPATCH } = useRequestHandler();
    const { token } = useAuthContext();

    const getUser = (username: string) => {
        const {
            data: user,
            error: userFetchError,
            isFetching: userIsLoading
        } = useQuery(['user', username], (): Promise<UserProfileData> => GET(`${BASE_URL}/users/${username}`));

        return {
            user,
            userFetchError,
            userIsLoading
        }
    }

    const useUploadCoverImage = () => {
        const {
            mutateAsync: uploadMutation,
            isLoading,
            isError
        } = useMutation((data: UploadImageProps) =>
            authPOST(`${BASE_URL}/upload/image/users/cover-image`, data.formData, { 'X-Authorization': token }),
            { retry: 3 }
        );

        const uploadCover = useCallback(async (data: UploadImageProps) => {
            try {
                const uploadResponse = await uploadMutation(data);
                return { uploadResponse };
            } catch (error) {
                return { error };
            }
        }, [uploadMutation]);

        return { uploadCover, isLoading, isError };
    }

    const useUploadAvatarImage = () => {
        const {
            mutateAsync: uploadMutation,
            isLoading,
            isError
        } = useMutation((data: UploadImageProps) =>
            authPOST(`${BASE_URL}/upload/image/users/avatar-image`, data.formData, { 'X-Authorization': token }),
            { retry: 3 }
        );

        const uploadAvatar = useCallback(async (data: UploadImageProps) => {
            try {
                const uploadResponse = await uploadMutation(data);
                return { uploadResponse };
            } catch (error) {
                return { error };
            }
        }, [uploadMutation]);

        return { uploadAvatar, isLoading, isError };
    }

    const useUserDataEdit = () => {
        const {
            mutateAsync: editMutation,
            isLoading,
            isError
        } = useMutation((data: UserEditRequest) =>
            authPATCH(`${BASE_URL}/users/${data.oldUsername}`, data), { retry: 3 });

        const editProfile = useCallback(async (data: UserEditRequest) => {
            try {
                const editResponse = await editMutation(data);
                return { editResponse };
            } catch (error) {
                return { error };
            }
        }, [editMutation]);

        return { editProfile, isLoading, isError };
    };

    return {
        getUser,
        useUploadCoverImage,
        useUploadAvatarImage,
        useUserDataEdit,
    }
}