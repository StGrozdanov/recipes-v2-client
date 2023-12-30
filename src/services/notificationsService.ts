import { useMutation, useQuery } from "react-query";
import { BASE_URL } from "./recipesService";
import { Notifications } from "./types";
import { useCallback } from "react";

/**
 * Gets the user notifications
 * @param username the username of the user
 */
export const getUserNotifications = (username: string, token: string) => {
    const {
        data: notifications,
        error: notificationsFetchError,
        isFetching: notificationsAreLoading
    } = useQuery(['userNotifications', username, token], () => getUserNotificationsRequest(username, token), {
        cacheTime: 0,
        staleTime: 0,
    });

    return {
        notifications,
        notificationsFetchError,
        notificationsAreLoading
    }
}

/**
 * Marks the notification as read - not showing it the next request
 */
export const useMarkAsRead = () => {
    const {
        mutateAsync: notificationsMutation,
        isLoading,
        isError
    } = useMutation((params: { token: string, id: number }) => markNotificationsAsReadRequest(params.token, params.id));

    const markAsRead = useCallback(async (params: { token: string, id: number }) => {
        try {
            const notificationsResponse = notificationsMutation(params);
            return { notificationsResponse };
        } catch (error) {
            return { error };
        }
    }, [notificationsMutation]);

    return { markAsRead, isLoading, isError };
};

const getUserNotificationsRequest = async (username: string, token: string): Promise<Notifications[]> => {
    const response = await fetch(`${BASE_URL}/notifications/${username}`, {
        headers: {
            'X-Authorization': token,
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data}`);
    }
    return data;
}

const markNotificationsAsReadRequest = async (token: string, id: number): Promise<Notifications[]> => {
    const response = await fetch(`${BASE_URL}/notifications`, {
        method: "PUT",
        headers: {
            'X-Authorization': token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    return data;
}