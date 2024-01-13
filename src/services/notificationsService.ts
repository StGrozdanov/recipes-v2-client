import { useMutation, useQuery } from "react-query";
import { BASE_URL } from "./recipesService";
import { Notifications } from "./types";
import { useCallback } from "react";
import { useRequestHandler } from "../hooks/useRequestHandler";

/**
 * hook to handle all notifications related requests
 * @returns handler functions
 */
export const useNotificationsService = () => {
    const { authGET, authPUT } = useRequestHandler();

    const getUserNotifications = (username: string) => {
        const {
            data: notifications,
            error: notificationsFetchError,
            isFetching: notificationsAreLoading
        } = useQuery(['userNotifications', username],
            (): Promise<Notifications[]> => authGET(`${BASE_URL}/notifications/${username}`, { username }));

        return {
            notifications,
            notificationsFetchError,
            notificationsAreLoading
        }
    }

    const useMarkAsRead = () => {
        const {
            mutateAsync: notificationsMutation,
            isLoading,
            isError
        } = useMutation((id: number): Promise<Notifications[]> =>
            authPUT(`${BASE_URL}/notifications`, { id }));

        const markAsRead = useCallback(async (id: number) => {
            try {
                const notificationsResponse = await notificationsMutation(id);
                return { notificationsResponse };
            } catch (error) {
                return { error };
            }
        }, [notificationsMutation]);

        return { markAsRead, isLoading, isError };
    };

    return {
        getUserNotifications,
        useMarkAsRead,
    }
}
